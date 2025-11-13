import React, { useEffect, useState } from "react";
import axios from "../Utils/authAxios.js";
import { MessageCircleMore, Send, ChevronUp, ChevronDown } from "lucide-react";

const UserManual = (props) => {
  // const options = ["Tài khoản", "Chuyến bay", "Đơn hàng"];
  const options = ["Chuyến bay"];

  const messageFlights = [
    "Tìm chuyến bay ngày mai",
    "Tìm chuyến bay 25-3 chuyến bay đi",
    "Tìm chuyến bay Cần Thơ đến Quy Nhơn",
    "Tìm chuyến bay Vinh đến Vũng Tàu chuyến bay đi",
    "Tìm chuyến bay Hải Phòng đến Phú Quốc 15-03-2025",
    "Tìm chuyến bay Đà Nẵng đến Hạ Long 03-04-2025 chuyến bay khứ hồi",
  ];

  const { setState, actionProvider } = props;

  const setNativeValue = (element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    )?.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const handleSelectMessage = (message) => {
    const inputField = document.querySelector(".react-chatbot-kit-chat-input");

    if (inputField) {
      setNativeValue(inputField, message);
      inputField.focus();
    }
  };

  const handleSendMessage = (message) => {
    actionProvider.flightsHandler(message, "user");
  };

  const [showMessage, setShowMessage] = useState([false, false, false]);

  const handleChangeShowMessage = (i) => {
    setShowMessage((prev) =>
      prev.map((value, index) => {
        if (i.includes(index)) {
          return !value;
        }
        return false;
      })
    );
  };

  return (
    <div className="">
      {Array.from({ length: options.length }, (_, i) => (
        <div key={i}>
          <div
            className="bg-gray-700 p-2 rounded-lg flex justify-between text-white mb-3 cursor-pointer"
            onClick={() => handleChangeShowMessage([i])}
          >
            <p>{options[i]}</p>
            {!showMessage[i] ? <ChevronDown /> : <ChevronUp />}
          </div>
          {showMessage[i] && i === 0 && (
            <div>
              <ul className="">
                {messageFlights.map((option, index) => (
                  <li
                    className="flex justify-between mb-3 p-1 border-b"
                    key={index}
                  >
                    • {option}
                    <div className="flex gap-x-3">
                      <div className="relative">
                        <div className="flex items-center w-fit">
                          <div className="cursor-pointer icon-hover-trigger">
                            <MessageCircleMore
                              className="cursor-pointer"
                              color="#2898ec"
                              size={19}
                              onClick={() => handleSelectMessage(option)}
                            />
                          </div>
                          <div
                            className={`absolute font-semibold overflow-hidden whitespace-nowrap -top-5 -left-5 z-10 w-0 text-sm text-[#2898ec] rounded transition-opacity duration-300 opacity-0 hover-note`}
                          >
                            <p className="font-mono">Soạn</p>
                          </div>
                        </div>
                      </div>
                      <style jsx="true">{`
                        .icon-hover-trigger:hover + .hover-note {
                          opacity: 1;
                          width: fit-content;
                          padding: 3px;
                          overflow: auto;
                        }
                      `}</style>

                      <div className="relative">
                        <div className="flex items-center w-fit">
                          <div className="cursor-pointer icon-hover-trigger">
                            <Send
                              className="cursor-pointer"
                              color="#2898ec"
                              size={19}
                              onClick={() => handleSendMessage(option)}
                            />
                          </div>
                          <div
                            className={`absolute font-semibold overflow-hidden whitespace-nowrap -top-5 -left-5 z-10 w-0 text-sm text-[#2898ec] rounded transition-opacity duration-300 opacity-0 hover-note`}
                          >
                            <p className="font-mono">Send</p>
                          </div>
                        </div>
                      </div>

                      <style jsx="true">{`
                        .icon-hover-trigger:hover + .hover-note {
                          opacity: 1;
                          width: fit-content;
                          padding: 3px;
                          overflow: auto;
                        }
                      `}</style>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserManual;
