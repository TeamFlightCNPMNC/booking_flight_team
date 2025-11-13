import React, { useState } from "react";

const ChatInput = ({ sendMessage, messages }) => {
  const [input, setInput] = useState(""); // Nội dung nhập hiện tại
  const [historyIndex, setHistoryIndex] = useState(-1); // Vị trí lịch sử nhập

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      sendMessage(input); // Gửi tin nhắn
      setInput(""); // Reset ô nhập
      setHistoryIndex(-1); // Reset index
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (messages.length > 0) {
        const newIndex =
          historyIndex === -1
            ? messages.length - 1
            : Math.max(historyIndex - 1, 0);
        setHistoryIndex(newIndex);
        setInput(messages[newIndex]); // Hiển thị message từ state
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= messages.length) {
          setInput(""); // Nếu vượt quá, xóa nội dung nhập
          setHistoryIndex(-1);
        } else {
          setHistoryIndex(newIndex);
          setInput(messages[newIndex]); // Hiển thị message tiếp theo
        }
      }
    }
  };

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Nhập tin nhắn..."
      className="border p-2 w-full"
    />
  );
};

export default ChatInput;
