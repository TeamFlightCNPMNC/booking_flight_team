import React from "react";

const Options = (props) => {
  const { actionProvider } = props;

  const handleOptionClick = (option) => {
    switch (option) {
      case "Xem chuyến bay":
        actionProvider.flightsHandler();
        break;
      case "Hỗ trợ":
        actionProvider.supportHandler();
        break;
      case "Quay lại":
        actionProvider.goBack();
        break;
      default:
        break;
    }
  };

  return (
    <div className="gap-x-4 text-white flex">
      <button
        className="bg-[#2898ec] rounded-full p-2"
        onClick={() => handleOptionClick("Xem chuyến bay")}
      >
        Xem chuyến bay
      </button>
      <button
        className="bg-[#2898ec] rounded-full p-2"
        onClick={() => handleOptionClick("Hỗ trợ")}
      >
        Hỗ trợ
      </button>
      <button
        className="bg-[#2898ec] rounded-full p-2"
        onClick={() => handleOptionClick("Quay lại")}
      >
        Quay lại
      </button>
    </div>
  );
};

export default Options;
