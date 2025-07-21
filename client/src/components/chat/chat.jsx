

// import { useState, useEffect, useContext, useRef } from 'react';
// import './chat.scss';
// import { AuthContext } from "../../context/AuthContext";
// import { SocketContext } from '../../context/SocketContext';
// import apiRequest from '../../lib/apiReq';
// import { format } from "timeago.js";
// import { useNotificationStore } from '../../lib/notificationStore';

// function Chat({ chats }) {
//   const [chat, setChat] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);
//   const messageEndRef = useRef();

//   const decrease = useNotificationStore((state) => state.decrease);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const handleOpenChat = async (id, receiver) => {
//     try {
//       const res = await apiRequest.get("/chats/" + id);
//       if (!res.data.seenBy.includes(currentUser.id)) {
//         decrease();
//       }

//       setChat({ ...res.data, receiver });
//     } catch (err) {
//       console.error("Failed to open chat:", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const text = formData.get("text");

//     if (!text.trim()) return;

//     try {
//       const res = await apiRequest.post("/messages/" + chat.id, { text });

//       setChat((prev) => ({
//         ...prev,
//         messages: [...prev.messages, res.data],
//       }));

//       socket.emit("sendMessage", {
//         receiverId: chat.receiver.id,
//         data: res.data,
//       });

//       e.target.reset();
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   useEffect(() => {
//     const markAsRead = async () => {
//       try {
//         await apiRequest.put("/chats/read/" + chat.id);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     if (chat && socket) {
//       socket.on("getMessage", (data) => {
//         if (chat.id === data.chatId) {
//           setChat((prev) => ({
//             ...prev,
//             messages: [...prev.messages, data],
//           }));
//           markAsRead();
//         }
//       });
//     }

//     return () => {
//       socket.off("getMessage");
//     };
//   }, [socket, chat]);

//   return (
//     <div className="chat">
//       <div className="messages">
//         <h1>Last Message</h1>
//         {chats?.map((c) => (
//           <div
//             className="message"
//             key={c.id}
//             style={{
//               backgroundColor:
//                 c.seenBy.includes(currentUser.id) || chat?.id === c.id
//                   ? "white"
//                   : "#fecd514e",
//             }}
//             onClick={() => handleOpenChat(c.id, c.receiver)}
//           >
//             <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
//             <span>{c.receiver.username}</span>
//             <p>{c.lastMessage}</p>
//           </div>
//         ))}
//       </div>

//       {chat && (
//         <div className="chatbot">
//           <div className="top">
//             <div className="user">
//               <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="User" />
//               {chat.receiver.username}
//             </div>
//             <div className="close" onClick={() => setChat(null)}>X</div>
//           </div>

//           <div className="center">
//             {chat.messages.map((message) => (
//               <div
//                 className="chatMessage"
//                 key={message.id}
//                 style={{
//                   alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
//                   textAlign: message.userId === currentUser.id ? "right" : "left",
//                 }}
//               >
//                 <p>{message.text}</p>
//                 <span>{format(message.createdAt)}</span>
//               </div>
//             ))}
//             <div ref={messageEndRef}></div>
//           </div>

//           <form onSubmit={handleSubmit} className="bottom">
//             <textarea name="text" placeholder="Type a message..." />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Chat;

import { useState, useEffect, useContext, useRef } from 'react';
import './chat.scss';
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from '../../context/SocketContext';
import apiRequest from '../../lib/apiReq';
import { format } from "timeago.js";
import { useNotificationStore } from '../../lib/notificationStore';

function Chat({ chats, selectedUser, autoOpen, initialChatId }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest.get("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text.trim()) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));

      // Add null check before emitting socket event
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        });
      } else {
        console.warn("Socket is not connected. Message sent but not delivered in real-time.");
      }

      e.target.reset();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    // Only set up the event listener if both chat and socket are available
    if (chat && socket) {
      try {
        // Set up the getMessage event listener
        socket.on("getMessage", (data) => {
          if (chat.id === data.chatId) {
            setChat((prev) => ({
              ...prev,
              messages: [...prev.messages, data],
            }));
            markAsRead();
          }
        });
      } catch (error) {
        console.error("Error setting up socket event listener:", error);
      }
    }

    // Cleanup function
    return () => {
      // Add null check to prevent "Cannot read properties of null (reading 'off')" error
      if (socket) {
        try {
          socket.off("getMessage");
        } catch (error) {
          console.error("Error removing socket event listener:", error);
        }
      }
    };
  }, [socket, chat]);

  // Auto-open chat if initialChatId is provided or if selectedUser is passed
  useEffect(() => {
    // Skip if required data is missing
    if (!currentUser) {
      console.warn("Cannot open chat: User not logged in");
      return;
    }

    const fetchOrCreateChat = async () => {
      try {
        // If we have an initialChatId, open that specific chat
        if (initialChatId && !chat) {
          try {
            const res = await apiRequest.get("/chats/" + initialChatId);

            // Check if the response contains valid data
            if (res.data && res.data.id) {
              if (!res.data.seenBy.includes(currentUser.id)) {
                decrease();
              }
              // Find the receiver from the chats list
              const chatInfo = chats?.find(c => c.id === initialChatId);
              setChat({
                ...res.data,
                receiver: chatInfo?.receiver || selectedUser,
                // Ensure messages array exists
                messages: res.data.messages || []
              });
            } else {
              console.error("Invalid chat data received:", res.data);
            }
          } catch (err) {
            console.error("Failed to open chat with ID:", err);
          }
        }
        // Otherwise, if we have a selectedUser, create or open a chat with them
        else if (selectedUser && autoOpen && !chat) {
          try {
            const res = await apiRequest.post("/chats/", { receiverId: selectedUser.id });

            // Check if the response contains valid data
            if (res.data && res.data.id) {
              setChat({
                ...res.data,
                receiver: selectedUser,
                // Ensure messages array exists
                messages: res.data.messages || []
              });
            } else {
              console.error("Invalid chat data received:", res.data);
            }
          } catch (err) {
            console.error("Auto open chat error:", err);
          }
        }
      } catch (error) {
        console.error("Unexpected error in fetchOrCreateChat:", error);
      }
    };

    fetchOrCreateChat();
  }, [initialChatId, selectedUser, autoOpen, chat, chats, currentUser, decrease]);

  // Handle case where currentUser is not available
  if (!currentUser) {
    return (
      <div className="chat">
        <div className="messages">
          <h1>Chat</h1>
          <p className="error-message">Please log in to use the chat feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="messages">
        <h1>Last Message</h1>
        {Array.isArray(chats) ? (
          chats.map((c) => (
            <div
              className="message"
              key={c.id}
              style={{
                backgroundColor:
                  (Array.isArray(c.seenBy) && c.seenBy.includes(currentUser.id)) || chat?.id === c.id
                    ? "white"
                    : "#fecd514e",
              }}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
              <span>{c.receiver?.username || "Unknown"}</span>
              <p>{c.lastMessage || "No message"}</p>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      {chat && (
        <div className="chatbot">
          <div className="top">
            <div className="user">
              <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="User" />
              {chat.receiver?.username || "User"}
            </div>
            <div className="close" onClick={() => setChat(null)}>X</div>
          </div>

          <div className="center">
            {Array.isArray(chat.messages) ? (
              chat.messages.map((message) => (
                <div
                  className="chatMessage"
                  key={message.id || Math.random().toString()}
                  style={{
                    alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                    textAlign: message.userId === currentUser.id ? "right" : "left",
                  }}
                >
                  <p>{message.text}</p>
                  <span>{message.createdAt ? format(message.createdAt) : ""}</span>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..." />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
