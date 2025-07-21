// import {Server} from "socket.io";

// const io= new Server({
//     cors:{
//        origin:"http://localhost:5173/",
//     },
// });
// let onlineUser=[];

// const addUser=(userId,socketId)=>{
//    const userExists=onlineUser.find(user=>user.userId===userId);
//    if(!userExists){
//     onlineUser.push({userId,socketId});
//    }
// }

// const removeUser=(socketId)=>{
//     onlineUser=onlineUser.filter(user=>user.socketId != socketId);
// }

// const getUser=(userId)=>{
//     return onlineUser.find(user=>user.userId===userId);
// }


// io.on("connection",(socket)=>{
//     socket.on("connection",(socket)=>{
//         socket.on("newUser",(user)=>{
//          addUser(userId,socket.id);
//         })
//         socket.on("sendMessage",({receiverId,data})=>{
//             const receive=getUser(receiverId);
//             io.to(receiverId.socketId).emit("getMessage",data);
//         }

//         )

//         socket.on("disconnect",()=>{
//           removeUser(socket.io);
//         })
//     })

// })

// io.listen("4000");

import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.find((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// Import the http module to create a server
import http from 'http';

// Create an HTTP server
const httpServer = http.createServer();

// Attach Socket.io to the HTTP server
io.attach(httpServer);

// Use port 8888 which is less likely to be in use
const PORT = 8888;

// Set up error handling for the HTTP server
httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port and try again.`);

    // Try to find the process using this port
    console.log("You can find and kill the process using these commands:");
    console.log(`1. Run: netstat -ano | findstr :${PORT}`);
    console.log("2. Look for the PID (Process ID) in the last column");
    console.log("3. Run: taskkill /F /PID <PID>");
  } else {
    console.error('HTTP server error:', error);
  }
  process.exit(1);
});

// Start the server
console.log(`Starting Socket.io server on port ${PORT}...`);
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is now running on port ${PORT}`);
});
