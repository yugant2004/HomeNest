import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        chatUsers: {
          some: {
            userId: tokenUserId,
          },
        },
      },
      include: {
        chatUsers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    const enrichedChats = chats.map(chat => {
      const receiverUser = chat.chatUsers.find(
        cu => cu.userId !== tokenUserId
      )?.user;

      return {
        ...chat,
        receiver: receiverUser,
        lastMessage: chat.messages[0]?.text || null,
      };
    });

    res.status(200).json(enrichedChats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        chatUsers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!chat || !chat.chatUsers.some(cu => cu.userId === tokenUserId)) {
      return res.status(404).json({ message: "Chat not found or unauthorized." });
    }

    // Update seenBy if not already in it
    if (!chat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          seenBy: { push: tokenUserId },
        },
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  console.log("addChat called with:", { tokenUserId, receiverId, body: req.body });

  // Check if receiverId is missing
  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" });
  }

  // Check if user is trying to chat with themselves
  if (tokenUserId === receiverId) {
    return res.status(400).json({ message: "You cannot chat with yourself" });
  }

  try {
    // Check if a chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            chatUsers: {
              some: {
                userId: tokenUserId,
              },
            },
          },
          {
            chatUsers: {
              some: {
                userId: receiverId,
              },
            },
          },
        ],
      },
      include: {
        chatUsers: true,
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        chatUsers: {
          create: [
            { user: { connect: { id: tokenUserId } } },
            { user: { connect: { id: receiverId } } },
          ],
        },
      },
      include: {
        chatUsers: true,
      },
    });

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const isUserInChat = await prisma.chatUser.findFirst({
      where: {
        chatId,
        userId: tokenUserId,
      },
    });

    if (!isUserInChat) {
      return res.status(403).json({ message: "You are not part of this chat." });
    }

    const chat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to mark chat as read!" });
  }
};


