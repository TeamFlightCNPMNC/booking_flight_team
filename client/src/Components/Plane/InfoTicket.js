import { memo } from "react";

function InfoTicket({ airport, enableUpdateTIcket }) {
  let currentLocation = window.location.href;
  const currentPath = new URL(currentLocation).pathname;
  const arrayUrl = [
    "/XemDanhSachChuyenbBay/ThanhToan",
    "/Setting/HistoryTicket",
  ];
  let place = arrayUrl.includes(currentPath);

  return (
    <div
      className={`w-fit flex-shrink-0 snap-center flex-col bg-white md:mb-2 overflow-hidden rounded-md shadow-md h-fit shadow-blue-400 ${airport?.trangThaiVe === "Đã hủy" ? "grayscale" : ""}`}>
      <div className="flex gap-3 p-2 md:p-4 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#0194f3"
          className="mt-1 md:size-7 size-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
          />
        </svg>

        <div className="gap-3 flex items-center font-semibold from-neutral-800 md:text-base text-sm whitespace-nowrap">
          <span>{airport?.diemBay}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
          <span>{airport?.diemDen}</span>
        </div>
      </div>

      <div className="p-2 md:p-4 shadow-sm text-sm md:text-base font-semibold text-[#0194F3] flex flex-col gap-y-2 w-fit">
        <h4>
          • {airport?.loaiChuyenBay}: {airport?.gioBay}
          {", "}
          {airport?.ngayBay}
        </h4>
        <h4>
          • Thời gian đến nơi: {airport?.gioDen}
          {", "}
          {airport?.ngayDen}
        </h4>
        <h4>• Hãng máy bay: {airport?.hangBay}</h4>
        <h4>
          • Loại hành khách:{" "}
          {airport?.loaiTuoi.split(" thứ")[0] || airport?.loaiTuoi}{" "}
        </h4>
        <h4>• Hạng vé: {airport?.hangVe || "Ngồi chung với người lớn"}</h4>
        <h4>• Giá vé: {airport?.giaVe}</h4>
        <h4>• Mã số ghế: {airport?.maSoGhe}</h4>
      </div>

      <div className="p-2 md:p-4 shadow-sm text-sm md:text-base font-semibold text-[#0194F3] flex flex-col gap-y-2 w-fit">
        {place && (
          <>
            <h4>• Tên khách hàng: {airport?.Ten}</h4>
            <h4>• Ngày sinh: {airport?.ngaySinh}</h4>
            {/* <h4>• CCCD: {airport?.cccd}</h4> */}
          </>
        )}
      </div>
      {airport?.trangThaiVe && (
        <div className="p-2 md:p-4 shadow-sm text-sm md:text-base font-semibold flex items-center gap-2 w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffcc00"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>

          <h4
            className={`${
              airport?.trangThaiVe === "Đã hủy"
                ? "text-red-500"
                : airport?.trangThaiVe === "Đã thanh toán"
                  ? "text-[#0bc175]"
                  : airport?.trangThaiVe === "Chưa thanh toán" ||
                      airport?.trangThaiVe ===
                        "Chưa thanh toán chuyến đi (Đã hủy vé khứ hồi)"
                    ? "text-[#ffd000]"
                    : ""
            }`}>
            {airport?.trangThaiVe}
          </h4>
        </div>
      )}
    </div>
  );
}

export default memo(InfoTicket);
