import { memo } from "react";

const ItemDetailFlight = (props) => {
  return (
    <button
      type="button"
      className="flex flex-col gap-x-2 justify-start items-start rounded-b-xl w-full bg-[#F7F9FA] p-[2%] text-lg font-semibold"
    >
      <div className="flex gap-x-3">
        <div className="flex flex-col items-center justify-center h-fit">
          <div className="w-[12px] md:w-[24px] h-[12px] md:h-[24px] border-2 border-[#109AF4] rounded-full"></div>
          <div className="h-[94px] md:h-[200px] w-fit border-[1px] border-[#687172]"></div>
          <div className="w-[12px] md:w-[24px] h-[12px] md:h-[24px] border-2 border-[#109AF4] bg-[#109AF4] rounded-full"></div>
        </div>
        <ul className="text-base flex flex-col items-start justify-between text-[#109AF4] font-bold">
          <li>
            Hãng máy bay: {props.hangBay} - Loại: {props.loaiMayBay} - Số hiệu:{" "}
            {props.soHieu}
          </li>

          <li>Thời gian bay: {props.thoigianBay}</li>

          <li>Số vé thường còn lại: {props.PhoThong}</li>
          <li>Số vé thương gia còn lại: {props.ThuongGia}</li>
        </ul>
      </div>
    </button>
  );
};
export default memo(ItemDetailFlight);
