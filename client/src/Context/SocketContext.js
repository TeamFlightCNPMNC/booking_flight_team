import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const [stateConnectSocket, setStateConnectSocket] = useState(() => {
    const savedValue = localStorage.getItem("state_connect_server");
    return savedValue !== null ? JSON.parse(savedValue) : false;
  });

  const changeStateConnectSocket = (state) => {
    setStateConnectSocket(state);
    localStorage.setItem("state_connect_server", JSON.stringify(state));
  };

  const [operatingStatus, setOperatingStatus] = useState("Offline");
  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   if (stateConnectSocket) {
  //     const socketInstance = new io("http://localhost:4001", {
  //       autoConnect: false,
  //       withCredentials: true,
  //       timeout: 30000,
  //     });

  //     socketInstance.on("connect", () => {
  //       setOperatingStatus("Online");
  //     });

  //     socketInstance.on("disconnect", (reason) => {
  //       console.log("Disconnected from server:", reason);
  //       setOperatingStatus("Offline");
  //     });

  //     setSocket(socketInstance); // Lưu socket vào state
  //   } else {
  //     setOperatingStatus("Offline");
  //     setSocket(null);
  //   }
  // }, [stateConnectSocket]);

  useEffect(() => {
    if (socket) {
      socket.connect();
    }
  }, [socket]);

  const [showNotificationSocket, setShowNotificationSocket] = useState(false);

  return (
    <SocketContext.Provider
      value={{
        operatingStatus,
        socket,
        changeStateConnectSocket,
        showNotificationSocket,
        setShowNotificationSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
