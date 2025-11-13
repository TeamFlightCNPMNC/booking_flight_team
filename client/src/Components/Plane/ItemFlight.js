import { memo, useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import ItemDetailFlight from "./ItemDetailFlight.js";

const ItemFlight = (isFlight) => {
  const { hideDetailItemFlight, openAdjustQuantity } = useContext(CONTEXT);

  return (
    <>
      <button
        type="button"
        className="h-[130px] w-full bg-white p-3 flex justify-between items-center"
      >
        <div className="flex items-center font-semibold sm:text-2xl gap-x-3 w-fit h-fit">
          <div className="flex flex-col items-center gap-y-1">
            <span className="text-sm font-semibold text-[#687176]">
              Giờ cất cánh
            </span>
            <span className="font-mono font-semibold text-zinc-700">
              {isFlight.gioBay}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-[#687176]">
              {isFlight.thoigianBay}
            </p>
            <div className="flex flex-row items-center w-fit">
              <div className="w-[12px] md:w-[24px] h-[12px] md:h-[24px] border-2 border-[#687172] rounded-full"></div>
              <div className="w-[20px] md:w-[70px] h-fit border-[1px] border-[#687172]"></div>
              <div className="w-[12px] md:w-[24px] h-[12px] md:h-[24px] border-2 border-[#687172] bg-[#687172] rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-1">
            <span className="text-sm font-semibold text-[#687176]">
              Giờ hạ cánh
            </span>
            <span className="font-mono font-semibold text-zinc-700">
              {isFlight.gioDen}
            </span>
          </div>
        </div>
        {!openAdjustQuantity &&
          (isFlight.hangBay === "Pacific Airlines" ? (
            <img
              src="https://www.pacific-airlines.com/uploads/images/logo/logo-pacific-airlines.png"
              alt="Pacific Airlines"
              className="w-48 h-12"
            />
          ) : isFlight.hangBay === "VietJet" ? (
            <img
              src="https://www.vietjetair.com/static/media/vj-logo.0f71c68b.svg"
              alt="VietJet"
              className="w-48 h-12"
            />
          ) : isFlight.hangBay === "VNA" ? (
            <img
              src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo%20Header/VNA_logo_vn.png"
              alt="Vietnam Airlines"
              className="w-48 h-12"
            />
          ) : isFlight.hangBay === "BamBoo" ? (
            <img
              src="https://www.bambooairways.com/o/wpbav-home-theme/css/assets/logo.png"
              alt="Bamboo Airways"
              className="w-48 h-12"
            />
          ) : isFlight.hangBay === "Vietravel Airlines" ? (
            <img
              src="	https://www.vietravelairlines.com/img/common/logo.png"
              alt="Bamboo Airways"
              className="w-48 h-12"
            />
          ) : (
            ""
          ))}

        <div className="flex sm:text-lg items-center font-bold text-[#FF5E1F]">
          {isFlight.gia}
          <span className="text-sm sm:w-fit w-0 overflow-hidden font-semibold text-[#687176]">
            /khách
          </span>
        </div>
      </button>
      {hideDetailItemFlight && (
        <ItemDetailFlight
          hangBay={isFlight.hangBay}
          soHieu={isFlight.soHieu}
          loaiMayBay={isFlight.loaiMayBay}
          ThuongGia={isFlight.ThuongGia}
          PhoThong={isFlight.PhoThong}
          thoigianBay={isFlight.thoigianBay}
        />
      )}
    </>
  );
};
export default memo(ItemFlight);
