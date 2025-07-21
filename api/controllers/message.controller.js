import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    // Check if the chat exists and user is part of it
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        chatUsers: {
          some: {
            userId: tokenUserId,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

    // Create a message (✅ pass chatId directly)
    const message = await prisma.message.create({
      data: {
        text,
        chatId,            // ✅ match your schema
        userId: tokenUserId,
      },
    });

    // Update chat with seenBy and lastMessage
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
