import { memo, useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import ItemDetailFlight from "./ItemDetailFlight.js";
import { NotifySheet } from "./AdjustQuantityv2";

const ItemFlight = (isFlight) => {
  const { hideDetailItemFlight, openAdjustQuantity } = useContext(CONTEXT);

  return (
    <>
      <button
        type="button"
        className="h-[130px] flex-wrap w-full bg-white p-2 md:p-3 flex justify-start items-center gap-x-2">
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
            <div className="flex items-center w-full">
              <div className="w-[12px] md:size-4 h-[12px] border-2 border-[#687172] rounded-full"></div>
              <div className="relative flex-1 h-[2px] bg-[#687172] mx-1 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-3 bg-gradient-to-r from-green-500 to-green-300 animate-progress"></div>
              </div>
              <div className="w-[12px] md:size-4 h-[12px] border-2 border-[#687172] bg-[#687172] rounded-full"></div>
            </div>
            <p className="text-sm font-semibold text-[#687176]">
              {isFlight.loaiChuyenBay}
            </p>
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
              className="w-48 h-12 hidden lg:block"
            />
          ) : isFlight.hangBay === "VietJet" ? (
            <img
              src="https://www.vietjetair.com/static/media/vj-logo.0f71c68b.svg"
              alt="VietJet"
              className="w-48 h-12 hidden lg:block"
            />
          ) : isFlight.hangBay === "VNA" ? (
            <img
              src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo%20Header/VNA_logo_vn.png"
              alt="Vietnam Airlines"
              className="w-48 h-12 hidden lg:block"
            />
          ) : isFlight.hangBay === "BamBoo" ? (
            <img
              src="https://www.bambooairways.com/o/wpbav-home-theme/css/assets/logo.png"
              alt="Bamboo Airways"
              className="w-48 h-12 hidden lg:block"
            />
          ) : isFlight.hangBay === "Vietravel Airlines" ? (
            <img
              src="	https://www.vietravelairlines.com/img/common/logo.png"
              alt="Bamboo Airways"
              className="w-48 h-12 hidden lg:block"
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

        <NotifySheet
          content={`Số ghế phổ thông còn lại: ${isFlight.soGhePhoThong} - Số ghế thương gia còn lại: ${isFlight.soGheThuongGia}`}
          icon={
            <div className="flex items-center gap-x-1">
              <p className="text-sm font-semibold text-[#687176]">
                PT:{" "}
                <span
                  className={`${
                    isFlight.soGhePhoThong > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {isFlight.soGhePhoThong}
                </span>
              </p>
              <p className="text-sm font-semibold text-[#687176]">
                TG:{" "}
                <span
                  className={`${
                    isFlight.soGheThuongGia > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {isFlight.soGheThuongGia}
                </span>
              </p>
            </div>
          }
        />
      </button>
      {hideDetailItemFlight && (
        <ItemDetailFlight
          hangBay={isFlight.hangBay}
          ngayBay={isFlight.ngayBay}
          ngayDen={isFlight.ngayDen}
        />
      )}
    </>
  );
};
export default memo(ItemFlight);
