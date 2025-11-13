import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider ";
import "./stylesChatbot.css";

function FuncChatbot() {
  return (
    <div className="absolute z-50 top-12 lg:top-20 right-4 w-fit h-fit border border-gray-300 rounded-lg overflow-hidden">
      <div className="App">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </div>
  );
}

export default FuncChatbot;
