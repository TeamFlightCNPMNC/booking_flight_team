import { memo } from "react";

const ItemDetailFlight = (props) => {
  return (
    <button
      type="button"
      className="flex flex-col gap-x-2 justify-start items-start rounded-b-xl w-full bg-[#F7F9FA] p-2 text-lg font-semibold h-fit">
      <div className="flex gap-x-3">
        <div className="flex flex-col items-center justify-center h-fit">
          <div className="w-[14px] md:w-[20px] h-[14px] md:h-[20px] border-2 border-[#109AF4] rounded-full"></div>
          <div className="h-16 md:h-[94px] w-fit border-[1px] border-[#687172]"></div>
          <div className="w-[14px] md:w-[20px] h-[14px] md:h-[20px] border-2 border-[#109AF4] bg-[#109AF4] rounded-full"></div>
        </div>
        <ul className="text-sm md:text-base flex flex-col items-start justify-between text-[#109AF4] font-medium">
          <li>Ngày cất cánh: {props.ngayBay}</li>
          <li>Hãng máy bay: {props.hangBay}</li>
          <li>Ngày đến: {props.ngayDen}</li>
        </ul>
      </div>
    </button>
  );
};
export default memo(ItemDetailFlight);
