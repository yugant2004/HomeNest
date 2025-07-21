import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the socket server on the fixed port
    const SOCKET_PORT = 8888; // Updated to match the Socket.io server port
    console.log(`Connecting to socket server on port ${SOCKET_PORT}...`);

    // Create socket instance with error handling
    let socketInstance;
    try {
      socketInstance = io(`http://localhost:${SOCKET_PORT}`, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Failed to connect to socket server:", error.message);
      });

      socketInstance.on("connect", () => {
        console.log(`Successfully connected to socket server on port ${SOCKET_PORT}`);
        setSocket(socketInstance);
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
    }

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
  currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};