import { useState, useContext, useEffect } from "react";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import ItemFlight from "./ItemFlight.js";
import notify from "../Noti/notify.js";
import { ToastContainer } from "react-toastify";

export default function AdjustQuantity({
  objDeparture,
  setSelectedDepartureAirport,
  setPassengerChooseDeparture,
  objReturn,
  countDepartureFlights,
  countReturnFlights,
}) {
  const {
    handleMake_a_Reservation,
    handleReplacePriceAirport,
    setHideDetailItemFlight,
    setOpenAdjustQuantity,
    bayMotChieu,
    editQuantityPassenger,
  } = useContext(CONTEXT);

  useEffect(() => {
    const element = document.getElementById("return-ticket");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const [isStateShowNotiGiaVe, setStateShowNotiGiaVe] = useState(true);
  const handleChange = () => {
    setStateShowNotiGiaVe(!isStateShowNotiGiaVe);
  };

  const [quantityTicketsOfAdult, setQuantityTicketsOfAdult] = useState([
    objDeparture[1][0],
    0,
  ]);
  const [quantityTicketsOfChild, setQuantityTicketsOfChild] = useState([
    objDeparture[1][1],
    0,
  ]);
  const [quantityTicketsReturnAdult, setQuantityTicketsReturnAdult] = useState([
    objDeparture[1][0],
    0,
  ]);
  const [quantityTicketsReturnChild, setQuantityTicketsReturnChild] = useState([
    objDeparture[1][1],
    0,
  ]);

  const handleIncreaseQuantityTicket = ({ ticketType, ageType, i }) => {
    if (ageType === "adult") {
      if (ticketType === "normalTicket") {
        (i === 0 ? setQuantityTicketsOfAdult : setQuantityTicketsReturnAdult)(
          (pre) => {
            if (
              pre[0] + pre[1] + 1 > objDeparture[1][0] ||
              pre[0] + 1 > objDeparture[0].PhoThong
            ) {
              return [pre[0], pre[1]];
            }
            return [pre[0] + 1, pre[1]];
          }
        );
      }
      if (ticketType === "businessTicket") {
        (i === 0 ? setQuantityTicketsOfAdult : setQuantityTicketsReturnAdult)(
          (pre) => {
            if (
              pre[0] + pre[1] + 1 > objDeparture[1][0] ||
              pre[1] + 1 > objDeparture[0].ThuongGia
            ) {
              return [pre[0], pre[1]];
            }
            return [pre[0], pre[1] + 1];
          }
        );
      }
    }
    if (ageType === "child") {
      if (ticketType === "normalTicket") {
        (i === 0 ? setQuantityTicketsOfChild : setQuantityTicketsReturnChild)(
          (pre) => {
            if (
              pre[0] + pre[1] + 1 > objDeparture[1][1] ||
              pre[0] + 1 > objDeparture[0].PhoThong
            ) {
              return [pre[0], pre[1]];
            }
            return [pre[0] + 1, pre[1]];
          }
        );
      }
      if (ticketType === "businessTicket") {
        (i === 0 ? setQuantityTicketsOfChild : setQuantityTicketsReturnChild)(
          (pre) => {
            if (
              pre[0] + pre[1] + 1 > objDeparture[1][1] ||
              pre[1] + 1 > objDeparture[0].ThuongGia
            ) {
              return [pre[0], pre[1]];
            }
            return [pre[0], pre[1] + 1];
          }
        );
      }
    }
  };
  const handleReduceQuantityTicket = ({ ticketType, ageType, i }) => {
    if (ageType === "adult") {
      if (ticketType === "normalTicket") {
        (i === 0 ? setQuantityTicketsOfAdult : setQuantityTicketsReturnAdult)(
          (pre) => {
            if (pre[0] - 1 < 0) {
              return [pre[0], pre[1]];
            }
            return [pre[0] - 1, pre[1]];
          }
        );
      }
      if (ticketType === "businessTicket") {
        (i === 0 ? setQuantityTicketsOfAdult : setQuantityTicketsReturnAdult)(
          (pre) => {
            if (pre[1] - 1 < 0) {
              return [pre[0], pre[1]];
            }
            return [pre[0], pre[1] - 1];
          }
        );
      }
    }
    if (ageType === "child") {
      if (ticketType === "normalTicket") {
        (i === 0 ? setQuantityTicketsOfChild : setQuantityTicketsReturnChild)(
          (pre) => {
            if (pre[0] - 1 < 0) {
              return [pre[0], pre[1]];
            }
            return [pre[0] - 1, pre[1]];
          }
        );
      }
      if (ticketType === "businessTicket") {
        (i === 0 ? setQuantityTicketsOfChild : setQuantityTicketsReturnChild)(
          (pre) => {
            if (pre[1] - 1 < 0) {
              return [pre[0], pre[1]];
            }
            return [pre[0], pre[1] - 1];
          }
        );
      }
    }
  };

  const handleCheckQuantityTickets = ({ state }) => {
    if (
      quantityTicketsOfAdult[0] + quantityTicketsOfAdult[1] !==
      objDeparture[1][0]
    ) {
      notify(
        "Warn",
        `Còn ${
          objDeparture[1][0] -
          quantityTicketsOfAdult[0] +
          quantityTicketsOfAdult[1]
        } người lớn chưa chọn hạng vé ${objReturn ? "của chuyến bay đi" : ""}`
      );
      return;
    }

    if (
      quantityTicketsOfChild[0] + quantityTicketsOfChild[1] !==
      objDeparture[1][1]
    ) {
      notify(
        "Warn",
        `Còn ${
          objDeparture[1][1] -
          quantityTicketsOfChild[0] +
          quantityTicketsOfChild[1]
        } trẻ em chưa chọn hạng vé ${objReturn ? "của chuyến bay đi" : ""}`
      );
      return;
    }

    if (
      objReturn &&
      quantityTicketsReturnAdult[0] + quantityTicketsReturnAdult[1] !==
        objReturn[1][0]
    ) {
      notify(
        "Warn",
        `Còn ${
          objReturn[1][0] -
          quantityTicketsReturnAdult[0] +
          quantityTicketsReturnAdult[1]
        } người lớn chưa chọn hạng vé ${objReturn ? "của chuyến bay khứ hồi" : ""}`
      );
      return;
    }
    if (
      objReturn &&
      quantityTicketsReturnChild[0] + quantityTicketsReturnChild[1] !==
        objReturn[1][1]
    ) {
      notify(
        "Warn",
        `Còn ${
          objReturn[1][1] -
          quantityTicketsReturnChild[0] +
          quantityTicketsReturnChild[1]
        } trẻ em chưa chọn hạng vé ${objReturn ? "của chuyến bay khứ hồi" : ""}`
      );
      return;
    }

    setPassengerChooseDeparture(true);
    setOpenAdjustQuantity(false);
    setHideDetailItemFlight(true);
    // setSelectedDepartureAirport([objDeparture, quantityTicketsOfAdult, quantityTicketsOfChild]);
    const element = document.getElementById("round-trip-ticket");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    if (state === "withoutReturnflight" || bayMotChieu) {
      handleMake_a_Reservation({
        airportDeparture: objDeparture[0],
        quantityTicketsDeparture: {
          quantityTicketsOfAdult: quantityTicketsOfAdult,
          quantityTicketsOfChild: quantityTicketsOfChild,
          quantityTicketsOfBaby: editQuantityPassenger[2],
        },
        oneWayFlight: true,
      });
    } else if (state === "normal" && (!bayMotChieu && objReturn)) {
      handleMake_a_Reservation({
        airportDeparture: objDeparture[0],
        airportReturn: objReturn[0],
        quantityTicketsDeparture: {
          quantityTicketsOfAdult: quantityTicketsOfAdult,
          quantityTicketsOfChild: quantityTicketsOfChild,
          quantityTicketsOfBaby: editQuantityPassenger[2],
        },
        quantityTicketsReturn: {
          quantityTicketsOfAdult: quantityTicketsReturnAdult,
          quantityTicketsOfChild: quantityTicketsOfChild,
          quantityTicketsOfBaby: editQuantityPassenger[2],
        },
        oneWayFlight: false,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed z-20 flex items-center justify-center w-full h-screen bg-white/10 backdrop-brightness-75 ">
        <div
          onClick={() => {
            setOpenAdjustQuantity(false);
            setHideDetailItemFlight(true);
          }}
          className="absolute z-20 w-full h-full"
        ></div>
        <div
          className={`absolute z-20 m-auto max-h-[80%] h-fit md:w-[45%] w-11/12 rounded-lg  p-4 top-24 overflow-y-auto bg-white ${isStateShowNotiGiaVe ? "contrast-50" : ""}`}
        >
          {Array.from({ length: objReturn ? 2 : 1 }, (_, i) => (
            <>
              <div
                className={`flex flex-col w-full ${objReturn && i === 1 ? "border-t-2 border-dashed mt-5 border-zinc-500" : ""} `}
                id={objReturn && i === 1 ? "return-ticket" : ""}
              >
                <p className="px-[2%] rounded-2xl text-2xl font-bold select-none">
                  {i === 0
                    ? "Chọn hạng vé cho chuyến bay đi"
                    : "Chọn hạng vé cho chuyến bay khứ hồi"}
                </p>

                <p className="p-[2%] rounded-2xl text-base text-zinc-400 font-semibold select-none">
                  Giá vé hiện tại đang được áp dụng giá vé phổ thông <br />{" "}
                  <span className="text-[#FF5E1F]">
                    Số vé phổ thông còn lại :{" "}
                    {(i === 0 ? objDeparture : objReturn)[0].soGhePhoThong}
                  </span>{" "}
                  <br />{" "}
                  <span className="text-[#FF5E1F]">
                    Số vé thương gia còn lại :{" "}
                    {(i === 0 ? objDeparture : objReturn)[0].soGheThuongGia}
                  </span>
                </p>
              </div>
              <div className="h-fit bg-white rounded-2xl shadow-md mx-[2%]">
                <ItemFlight
                  hangBay={`${(i === 0 ? objDeparture : objReturn)[0].hangBay}`}
                  soHieu={`${(i === 0 ? objDeparture : objReturn)[0].soHieu}`}
                  loaiMayBay={`${(i === 0 ? objDeparture : objReturn)[0].loaiMayBay}`}
                  gioBay={`${(i === 0 ? objDeparture : objReturn)[0].gioBay}`}
                  diemBay={`${(i === 0 ? objDeparture : objReturn)[0].diemBay}`}
                  gioDen={`${(i === 0 ? objDeparture : objReturn)[0].gioDen}`}
                  diemDen={`${(i === 0 ? objDeparture : objReturn)[0].diemDen}`}
                  gia={`${(i === 0 ? objDeparture : objReturn)[0].gia}`}
                  ThuongGia={`${(i === 0 ? objDeparture : objReturn)[0].ThuongGia}`}
                  PhoThong={`${(i === 0 ? objDeparture : objReturn)[0].PhoThong}`}
                />
              </div>
              <span className="text-lg font-semibold text-zinc-700 uppercase w-full flex justify-center">
                Hành khách: {objDeparture[1][0]} Người lớn, {objDeparture[1][1]}{" "}
                Trẻ em, {objDeparture[1][2]} Em bé
              </span>
              <div className="flex flex-col w-full">
                {objDeparture[1][0] >= 1 && (
                  <div className="mb-3">
                    <div className="flex">
                      <p className="text-base font-semibold text-zinc-800">
                        - Người lớn (x{objDeparture[1][0]}){"  "}
                      </p>
                      <div>
                        {(i === 0
                          ? quantityTicketsOfAdult
                          : quantityTicketsReturnAdult)[0] > 0 && (
                          <p className="text-base font-semibold text-red-600">
                            {" - "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                            }).format(
                              handleReplacePriceAirport(
                                (i === 0 ? objDeparture : objReturn)[0].gia
                              )
                            )}{" "}
                            x{" "}
                            {
                              (i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult)[0]
                            }{" "}
                            (Phổ thông) -{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) *
                                  (i === 0
                                    ? quantityTicketsOfAdult
                                    : quantityTicketsReturnAdult)[0]
                              )
                            ) + " VND"}
                          </p>
                        )}

                        {(i === 0
                          ? quantityTicketsOfAdult
                          : quantityTicketsReturnAdult)[1] > 0 && (
                          <p className="text-red-600 text-base font-semibold">
                            -{"  "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                            }).format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) * 1.5
                              )
                            )}{" "}
                            x{" "}
                            {
                              (i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult)[1]
                            }{" "}
                            (Thương gia) -{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) *
                                  1.5 *
                                  (i === 0
                                    ? quantityTicketsOfAdult
                                    : quantityTicketsReturnAdult)[1]
                              )
                            ) + " VND"}
                          </p>
                        )}
                        {(i === 0
                          ? quantityTicketsOfAdult
                          : quantityTicketsReturnAdult)[0] === 0 &&
                          (i === 0
                            ? quantityTicketsOfAdult
                            : quantityTicketsReturnAdult)[1] === 0 && (
                            <p className="text-red-600 text-base font-semibold">
                              {" "}
                              - Chưa chọn hạng ghế cho người lớn
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex px-3 gap-x-7">
                      {Array.from({ length: 2 }, (_, i2) => (
                        <div className="flex items-center gap-x-2 flex-col">
                          <span className="font-semibold text-sm uppercase text-neutral-600">
                            {i2 === 0 ? "Số vé phổ thông" : "Số vé thương gia"}
                          </span>
                          <AdjustQuantityQualityTicket
                            quantityTickets={
                              i2 === 0
                                ? (i === 0
                                    ? quantityTicketsOfAdult
                                    : quantityTicketsReturnAdult)[0]
                                : (i === 0
                                    ? quantityTicketsOfAdult
                                    : quantityTicketsReturnAdult)[1]
                            }
                            handleReduceQuantityTicket={
                              handleReduceQuantityTicket
                            }
                            handleIncreaseQuantityTicket={
                              handleIncreaseQuantityTicket
                            }
                            ticketType={
                              i2 === 0 ? "normalTicket" : "businessTicket"
                            }
                            ageType="adult"
                            normalTicket={
                              (i === 0 ? objDeparture : objReturn)[0].PhoThong
                            }
                            businessTicket={
                              (i === 0 ? objDeparture : objReturn)[0].ThuongGia
                            }
                            totalTickets={
                              i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult
                            }
                            quantityPassenger={
                              (i === 0 ? objDeparture : objReturn)[1]
                            }
                            indexArr={i}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(i === 0 ? objDeparture : objReturn)[1][1] >= 1 && (
                  <div className="mb-3">
                    <div className="flex">
                      <p className="text-base font-semibold text-zinc-800">
                        - Trẻ em (x{(i === 0 ? objDeparture : objReturn)[1][1]}){" "}
                      </p>
                      <div>
                        {(i === 0
                          ? quantityTicketsOfChild
                          : quantityTicketsReturnChild)[0] > 0 && (
                          <p className="text-base font-semibold text-red-600">
                            -{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                            }).format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) * 0.75
                              )
                            )}{" "}
                            x{" "}
                            {
                              (i === 0
                                ? quantityTicketsOfChild
                                : quantityTicketsReturnChild)[0]
                            }{" "}
                            (Phổ thông) -{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) *
                                  0.75 *
                                  (i === 0
                                    ? quantityTicketsOfChild
                                    : quantityTicketsReturnChild)[0]
                              )
                            ) + " VND"}
                          </p>
                        )}

                        {(i === 0
                          ? quantityTicketsOfChild
                          : quantityTicketsReturnChild)[1] > 0 && (
                          <p className="text-base font-semibold text-red-600">
                            -{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                            }).format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) *
                                  0.75 *
                                  1.5
                              )
                            )}{" "}
                            x{" "}
                            {
                              (i === 0
                                ? quantityTicketsOfChild
                                : quantityTicketsReturnChild)[1]
                            }{" "}
                            (Thương gia) -{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                              Math.floor(
                                handleReplacePriceAirport(
                                  (i === 0 ? objDeparture : objReturn)[0].gia
                                ) *
                                  1.5 *
                                  0.75 *
                                  (i === 0
                                    ? quantityTicketsOfChild
                                    : quantityTicketsReturnChild)[1]
                              )
                            ) + " VND"}
                          </p>
                        )}

                        {(i === 0
                          ? quantityTicketsOfChild
                          : quantityTicketsReturnChild)[0] === 0 &&
                          (i === 0
                            ? quantityTicketsOfChild
                            : quantityTicketsReturnChild)[1] === 0 && (
                            <p className="text-red-600 text-base font-semibold">
                              {" "}
                              - Chưa chọn hạng ghế cho Trẻ em
                            </p>
                          )}
                      </div>
                    </div>
                    <span className="text-sm ml-5 font-medium text-slate-700">
                      Lưu ý: Giá vé trẻ em (từ 2 đến 12 tuổi) sẽ được tính bằng
                      75% giá vé người lớn.
                    </span>
                    <div className="flex px-3 gap-x-7">
                      {Array.from({ length: 2 }, (_, i2) => (
                        <div className="flex items-center gap-x-2 flex-col">
                          <span className="font-semibold text-sm uppercase text-neutral-600">
                            {i2 === 0 ? "Số vé phổ thông" : "Số vé thương gia"}
                          </span>
                          <AdjustQuantityQualityTicket
                            quantityTickets={
                              i2 === 0
                                ? (i === 0
                                    ? quantityTicketsOfChild
                                    : quantityTicketsReturnChild)[0]
                                : (i === 0
                                    ? quantityTicketsOfChild
                                    : quantityTicketsReturnChild)[1]
                            }
                            handleReduceQuantityTicket={
                              handleReduceQuantityTicket
                            }
                            handleIncreaseQuantityTicket={
                              handleIncreaseQuantityTicket
                            }
                            ticketType={
                              i2 === 0 ? "normalTicket" : "businessTicket"
                            }
                            ageType="child"
                            normalTicket={
                              (i === 0 ? objDeparture : objReturn)[0].PhoThong
                            }
                            businessTicket={
                              (i === 0 ? objDeparture : objReturn)[0].ThuongGia
                            }
                            totalTickets={
                              i === 0
                                ? quantityTicketsOfChild
                                : quantityTicketsReturnChild
                            }
                            quantityPassenger={
                              (i === 0 ? objDeparture : objReturn)[1]
                            }
                            indexArr={i}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(i === 0 ? objDeparture : objReturn)[1][2] >= 1 && (
                  <div className="mb-3">
                    <p className="text-base font-semibold text-zinc-800">
                      - Em bé (x{(i === 0 ? objDeparture : objReturn)[1][2]}) -
                      0 x {(i === 0 ? objDeparture : objReturn)[1][2]} - 0 VND
                    </p>
                    <span className="text-sm ml-5 font-medium text-slate-700">
                      Lưu ý: Em bé (dưới 2 tuổi) sẽ không được ngồi ghế riêng mà
                      phải ngồi trong lòng người lớn.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col w-full border-t-2 border-dashed mt-3 border-zinc-500">
                <div className="mt-3">
                  {((i === 0
                    ? quantityTicketsOfAdult
                    : quantityTicketsReturnAdult)[0] > 0 ||
                    (i === 0
                      ? quantityTicketsOfChild
                      : quantityTicketsReturnChild)[0] > 0) && (
                    <p className="text-base font-semibold text-neutral-800">
                      Tổng{" "}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[0] +
                        (i === 0
                          ? quantityTicketsOfChild
                          : quantityTicketsReturnChild)[0]}{" "}
                      vé phổ thông cho{" "}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[0] > 0
                        ? quantityTicketsOfAdult[0] + " người lớn"
                        : ""}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[0] > 0 &&
                      (i === 0
                        ? quantityTicketsOfChild
                        : quantityTicketsReturnChild)[0] > 0
                        ? " và "
                        : ""}
                      {(i === 0
                        ? quantityTicketsOfChild
                        : quantityTicketsReturnChild)[0] > 0
                        ? (i === 0
                            ? quantityTicketsOfChild
                            : quantityTicketsReturnChild)[0] + " trẻ em"
                        : ""}{" "}
                      <p className="text-xl font-bold text-[#FF5E1F]">
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.floor(
                            handleReplacePriceAirport(
                              (i === 0 ? objDeparture : objReturn)[0].gia
                            ) *
                              (i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult)[0] +
                              handleReplacePriceAirport(
                                (i === 0 ? objDeparture : objReturn)[0].gia
                              ) *
                                0.75 *
                                (i === 0
                                  ? quantityTicketsOfChild
                                  : quantityTicketsReturnChild)[0]
                          )
                        )}{" "}
                        VND
                      </p>
                    </p>
                  )}
                  {((i === 0
                    ? quantityTicketsOfAdult
                    : quantityTicketsReturnAdult)[1] > 0 ||
                    (i === 0
                      ? quantityTicketsOfChild
                      : quantityTicketsReturnChild)[1] > 0) && (
                    <p className="text-base font-semibold text-neutral-800">
                      Tổng{" "}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[1] +
                        (i === 0
                          ? quantityTicketsOfChild
                          : quantityTicketsReturnChild)[1]}{" "}
                      vé thương gia cho{" "}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[1] > 0
                        ? (i === 0
                            ? quantityTicketsOfAdult
                            : quantityTicketsReturnAdult)[1] + " người lớn"
                        : ""}
                      {(i === 0
                        ? quantityTicketsOfAdult
                        : quantityTicketsReturnAdult)[1] > 0 &&
                      (i === 0
                        ? quantityTicketsOfChild
                        : quantityTicketsReturnChild)[1] > 0
                        ? " và "
                        : ""}
                      {(i === 0
                        ? quantityTicketsOfChild
                        : quantityTicketsReturnChild)[1] > 0
                        ? (i === 0
                            ? quantityTicketsOfChild
                            : quantityTicketsReturnChild)[1] + " trẻ em"
                        : ""}
                      <p className="text-xl font-bold text-[#FF5E1F]">
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.floor(
                            handleReplacePriceAirport(
                              (i === 0 ? objDeparture : objReturn)[0].gia
                            ) *
                              1.5 *
                              (i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult)[1] +
                              handleReplacePriceAirport(
                                (i === 0 ? objDeparture : objReturn)[0].gia
                              ) *
                                0.75 *
                                1.5 *
                                (i === 0
                                  ? quantityTicketsOfChild
                                  : quantityTicketsReturnChild)[1]
                          )
                        )}{" "}
                        VND
                      </p>
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="border-t-2 border-dashed mt-3 border-zinc-500 font-semibold text-neutral-800">
                    {i === 0
                      ? "Tổng số tiền cần than toán cho chuyến bay đi"
                      : "Tổng số tiền cần than toán cho chuyến bay khứ hồi"}
                    <p className="text-2xl font-bold text-[#FF5E1F]">
                      {new Intl.NumberFormat("vi-VN").format(
                        Math.floor(
                          handleReplacePriceAirport(
                            (i === 0 ? objDeparture : objReturn)[0].gia
                          ) *
                            (i === 0
                              ? quantityTicketsOfAdult
                              : quantityTicketsReturnAdult)[0] +
                            handleReplacePriceAirport(
                              (i === 0 ? objDeparture : objReturn)[0].gia
                            ) *
                              0.75 *
                              (i === 0
                                ? quantityTicketsOfChild
                                : quantityTicketsReturnChild)[0] +
                            (handleReplacePriceAirport(
                              (i === 0 ? objDeparture : objReturn)[0].gia
                            ) *
                              1.5 *
                              (i === 0
                                ? quantityTicketsOfAdult
                                : quantityTicketsReturnAdult)[1] +
                              handleReplacePriceAirport(
                                (i === 0 ? objDeparture : objReturn)[0].gia
                              ) *
                                0.75 *
                                1.5 *
                                (i === 0
                                  ? quantityTicketsOfChild
                                  : quantityTicketsReturnChild)[1])
                        )
                      )}{" "}
                      VND
                    </p>
                  </p>
                </div>
              </div>
            </>
          ))}

          {!bayMotChieu && countReturnFlights <= 0 && (
            <>
              <p className="text-base font-semibold mt-5 text-zinc-800">
                Không có chuyến bay khứ hồi nào, bạn có thể{" "}
                <span className="text-[#FF5E1F]">
                  chọn "Xác nhận chuyến bay đi" để bỏ qua chuyến bay khứ hồi
                </span>
                {"  hoặc "}
                <span className="text-[#FF5E1F]">
                  chọn "Tiến hành đặt" để tìm chuyến bay khác
                </span>
              </p>
              <button
                type="button"
                onClick={() =>
                  !isStateShowNotiGiaVe &&
                  handleCheckQuantityTickets({ state: "withoutReturnflight" })
                }
                className={` ${isStateShowNotiGiaVe ? "bg-gray-500" : "bg-[#FF5E1F]"} flex justify-center items-center font-bold text-white size-fit cursor-pointer p-3 rounded-lg float-right`}
              >
                Xác nhận chuyến bay đi
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              !isStateShowNotiGiaVe &&
              handleCheckQuantityTickets({ state: "normal" })
            }
            className={` ${isStateShowNotiGiaVe ? "bg-gray-500" : "bg-[#FF5E1F]"} mr-5 flex justify-center items-center font-bold text-white size-fit cursor-pointer p-3 rounded-lg float-right`}
          >
            {bayMotChieu ? "Xác nhận chuyến bay đi" : "Tiến hành đặt"}
          </button>
        </div>
        {isStateShowNotiGiaVe && (
          <div className="md:w-[40%] w-11/12 select-none absolute z-50 h-fit p-2 bg-white rounded-lg">
            <p className="font-semibold lg:text-[16px] md:text-[16px] text-[12px] text-[#0194F3]">
              Vui lòng bạn chọn hạng vé tại đây. Sau khi nhấn tiến hành đặt bạn
              không thể sửa hạng vé.
              <br />
              <span className="text-[#FF5E1F]">
                - Giá vé thương gia người lớn = vé phổ thông * 150%.
                <br /> - Giá vé trẻ em = 50% giá vé người lớn.
                <br /> - Em bé không tính giá vé và em bé phải ngồi chung với
                người lớn.
                {objReturn && (
                  <>
                    <br /> - Chú ý: Số lượng vé khứ hồi giống số lượng vé đi,
                    hạng vé khứ hồi có thể thay đổi.
                  </>
                )}
              </span>
            </p>
            <button
              type="button"
              className="p-2 m-auto bg-[#0194F3] text-white font-semibold rounded-xl"
              onClick={handleChange}
            >
              OK, hiểu rồi
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function AdjustQuantityQualityTicket({
  handleReduceQuantityTicket,
  handleIncreaseQuantityTicket,
  quantityTickets,
  normalTicket,
  businessTicket,
  ticketType,
  ageType,
  totalTickets,
  quantityPassenger,
  indexArr,
}) {
  return (
    <div className="flex justify-around items-center rounded-2xl bg-[#FF5E1F] w-36 h-7">
      <button
        className={`text-3xl w-[30%] h-fit flex rounded-2xl items-center ${quantityTickets <= 0 ? "bg-[#ffffff] text-[#FF5E1F]" : "bg-[#FF5E1F] text-white"}`}
        type="button"
        onClick={() =>
          handleReduceQuantityTicket({ ticketType, ageType, i: indexArr })
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="m-auto size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <input
        readOnly
        type="number"
        value={quantityTickets}
        className="bg-transparent bg-[#FF5E1F] text-white border-x-2 w-[35%] rounded-lg h-full text-center text-xl select-none pointer-events-none"
      />
      <button
        className={`text-3xl w-[30%] h-fit flex rounded-2xl items-center ${(ageType === "adult" && totalTickets[0] + totalTickets[1] >= quantityPassenger[0]) || (ageType === "child" && totalTickets[0] + totalTickets[1] >= quantityPassenger[1]) ? " bg-[#ffffff] text-[#FF5E1F]" : "bg-[#FF5E1F] text-white"}`}
        type="button"
        onClick={() =>
          handleIncreaseQuantityTicket({ ticketType, ageType, i: indexArr })
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
