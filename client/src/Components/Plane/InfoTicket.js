import { memo } from "react";

function InfoTicket({ airport, enableUpdateTIcket }) {
  let currentLocation = window.location.href;
  const currentPath = new URL(currentLocation).pathname;
  const arrayUrl = [
    "/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan",
    "/Setting/HistoryTicket",
  ];
  let place = arrayUrl.includes(currentPath);

  return (
    <div
      className={`w-[350px] flex-col bg-white md:mb-2 overflow-hidden rounded-md shadow-md h-fit shadow-blue-400 ${airport?.trangThaiVe === "Đã hủy" ? "grayscale" : ""}`}
    >
      <div className="flex gap-3 p-4 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#0194f3"
          className="mt-1 size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
          />
        </svg>

        <div className="gap-3 flex items-center font-bold from-neutral-800 text-[17px]">
          <span>{airport?.diemBay}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
          <span>{airport?.diemDen}</span>
        </div>
      </div>
      <div className="flex-col p-4 shadow-sm">
        <div className="mt-[-5px] mb-5 text-base font-semibold text-[#0194F3] flex flex-col gap-y-2">
          <h4 className="">
            • {airport?.loaiChuyenBay}: {airport?.gioBay} {" - "}
            {airport?.ngayBay}
          </h4>
          <h4>
            • Hãng bay:{" "}
            {airport?.hangBay}
          </h4>
          <h4>
            • Loại hành khách:{" "}
            {airport?.ageType.split(" thứ")[0] || airport?.ageType}{" "}
          </h4>
          <h4>• Hạng vé: {airport?.hangVe || "Ngồi chung với người lớn"}</h4>
          <h4>• Giá vé: {airport?.giaVe}</h4>
        </div>
      </div>
      <div className="flex-col p-4 text-base gap-y-2 rounded-b-md">
        {place && (
          <ComponentInfoTicket
            data={airport?.Ten}
            topic={"Tên khách hàng:"}
            enableUpdateTIcket={enableUpdateTIcket}
          />
        )}

        {place && (
          <ComponentInfoTicket
            data={airport?.ngaySinh}
            topic={"Ngày sinh:"}
            enableUpdateTIcket={enableUpdateTIcket}
          />
        )}

        {airport && airport?.trangThaiVe && (
          <div className="flex items-center gap-2 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffcc00"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>

            <h4 className="text-[#ffcc00] font-medium">
              {airport?.trangThaiVe}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentInfoTicket({ data, topic, donVi, enableUpdateTIcket }) {
  return (
    <div className="flex gap-2 mt-2 font-medium whitespace-nowrap">
      <img
        src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/0/0451207408e414bb8a1664153973b3c8.svg"
        alt=""
        className="h-[14px] w-[14px] mt-1"
      />
      {topic}{" "}
      <input
        className={`w-full text-gray-500 focus:text-center ${enableUpdateTIcket && !donVi ? "" : "pointer-events-none"}`}
        value={`${data}`}
      />{" "}
      {donVi ? donVi : ""}
    </div>
  );
}

export default memo(InfoTicket);
