import React, { memo, useEffect, useState } from "react";
import Header from "./Header";
import InfoTicket from "./Plane/InfoTicket";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MoMo, UpdatePayUrl, Paypal } from "../API/Payment.js";
import { bouncy } from "ldrs";
import { useContext } from "react";
import { CONTEXT } from "../Context/ContextGlobal.js";
import CountdownTimer from "../Components/Utils/CountdownTimer.js";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import { LoginSuccess } from "./Setting/StateLoginSucces";

function TrangThanhToan() {
  bouncy.register();

  const location = useLocation();
  const data = location.state || {};
  const [notiMinues, setNotiMinues] = useState(true);

  const {
    showNotification,
    convertVNDtoUSD,
    isExpired,
    QR_VietQR,
    setQR_VietQR,
    isShowOptionSetting_LoginSuccess,
  } = useContext(CONTEXT);
  const payment = localStorage.getItem("payment");

  useEffect(() => {
    if (
      !data ||
      Object.keys(data).length === 0 ||
      !payment ||
      payment.split(" ")[2]?.replace(/"/g, "") === "Pending"
    ) {
      window.location.href = `/`;
    }
  }, []);

  useEffect(() => {
    if (isExpired) {
      window.location.href = `/`;
    }
  }, [isExpired]);

  const pay = [
    {
      name: "MoMo",
      state: true,
    },
    {
      name: "Paypal",
      state: false,
    },
    {
      name: "VietQR",
      state: false,
    },
  ];
  const [isCheckPickPay, setCheckPickPay] = useState([false, false, false]);

  function formatNumber(num) {
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "");
    return parts.join("");
  }

  const mutationMoMo = useMutation({
    mutationFn: MoMo,
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với MoMo",
        "Warn"
      );
    },
  });

  const mutationPaypal = useMutation({
    mutationFn: Paypal,
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với paypal",
        "Warn"
      );
    },
  });

  const mutationUpdatePayUrl = useMutation({
    mutationFn: UpdatePayUrl,
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán",
        "Warn"
      );
    },
  });

  const handleReqPayMoMo = async () => {
    const payload = {
      amount: formatNumber(data.data.objectOrder.priceOrder.split(" ")[0]),
      orderId: data.data.objectOrder.idDH,
    };
    const response = await mutationMoMo.mutateAsync(payload);
    if (response.status === 200) {
      const res = await mutationUpdatePayUrl.mutateAsync({
        orderId: data.data.objectOrder.idDH,
        payUrl: response.data.payUrl,
        typePay: "MoMo",
      });

      if (res.status === 200) {
        localStorage.setItem(
          "payment",
          JSON.stringify(
            `${data.data.objectOrder.idDH} ${data.data.objectOrder.expiredAt} Pending`
          )
        );
        window.open(res.data.payUrl, "_blank");
        window.location.href = `/Setting/HistoryTicket`;
      }
    }
  };

  const handleReqPaypal = async () => {
    const payload = {
      amount: convertVNDtoUSD(data.data.objectOrder.priceOrder),
      orderId: data.data.objectOrder.idDH,
    };
    const response = await mutationPaypal.mutateAsync(payload);
    if (response.status === 200) {
      const res = await mutationUpdatePayUrl.mutateAsync({
        orderId: data.data.objectOrder.idDH,
        payUrl: response.data.url,
        typePay: "Paypal",
      });
      if (res.status === 200) {
        localStorage.setItem(
          "payment",
          JSON.stringify(
            `${data.data.objectOrder.idDH} ${data.data.objectOrder.expiredAt} Pending`
          )
        );

        window.location.href = res.data.payUrl;
      }
    }
  };

  const handleReqPayVietQR = async () => {
    const BANK_ID = "970415";
    const ACCOUNT_NO = "100883974104";
    const TEMPLATE = "compact2";
    const AMOUNT = formatNumber(data.data.objectOrder.priceOrder.split(" ")[0]);
    const DESCRIPTION = `${data.data?.timeEndPayOrder} ${data.data?.objectOrder?.idDH}`;
    const ACCOUNT_NAME = "TRUONG THANH LONG";

    const QR = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;
    const res = await mutationUpdatePayUrl.mutateAsync({
      orderId: data.data?.objectOrder?.idDH,
      payUrl: QR,
      typePay: "VietQR",
    });
    if (res.status === 200) {
      localStorage.setItem(
        "payment",
        JSON.stringify(
          `${data.data.objectOrder.idDH} ${data.data.objectOrder.expiredAt} Pending`
        )
      );
      setQR_VietQR(QR);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <div className="w-full h-full bg-slate-50 relative">
        {isShowOptionSetting_LoginSuccess && <LoginSuccess />}

        {notiMinues && (
          <NotiMinutes
            setNotiMinues={setNotiMinues}
            time={data?.data?.timeEndPayOrder}
          />
        )}
        {QR_VietQR && (
          <div
            className="w-full h-full bg-white/50 backdrop-brightness-75 fixed z-[100]"
            onClick={() => setQR_VietQR(null)}>
            <div className="w-96 h-96 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src={QR_VietQR} alt="QR-VietQR" />
              <CountdownTimer
                targetTime={data.data.objectOrder.expiredAt}
                orderId={data.data?.objectOrder?.idDH}
              />
            </div>
          </div>
        )}

        <div className="flex w-full gap-7 h-full items-start md:flex-row flex-col md:p-5 p-3 md:justify-center">
          <div className="flex flex-col gap-5">
            <div className="justify-center w-full font-semibold text-center text-sm md:text-base shadow-md rounded-md h-fit overflow-hidden shadow-blue-400">
              <p className="bg-blue-600 text-white p-3">
                Đừng lo lắng, giá vẫn giữ nguyên. Hoàn tất thanh toán của bạn
                bằng
              </p>
              <div className="bg-white rounded-b-md w-full flex flex-col">
                {Array.from({ length: pay.length }, (_, i) => (
                  <button
                    key={i}
                    className={`${pay[i].state ? "" : "line-through text-neutral-400"} text-center cursor-pointer p-3 ${isCheckPickPay[i] ? "text-orange-400" : "text-neutral-600"}`}
                    onClick={() => {
                      if (pay[i].state) {
                        setCheckPickPay((prev) => prev.map((_, j) => j === i));
                      }
                    }}>
                    Thanh toán bằng {pay[i].name}
                  </button>
                ))}
              </div>
            </div>

            {(isCheckPickPay[0] || isCheckPickPay[1] || isCheckPickPay[2]) && (
              <div className="flex-col p-3 bg-white rounded-md shadow-blue-400 shadow-md">
                <div className="flex flex-wrap justify-between items-start">
                  <h1 className="text-base md:text-lg font-semibold w-fit">
                    Tổng số tiền cần thanh toán
                  </h1>
                  <h1 className="text-base md:text-lg font-semibold text-blue-600 w-fit">
                    {isCheckPickPay[1]
                      ? convertVNDtoUSD(data.data.objectOrder.priceOrder) +
                        " USD"
                      : data.data.objectOrder.priceOrder}
                  </h1>
                </div>

                {/* //! thanh toán */}

                <div
                  className={`flex p-3 ${isCheckPickPay[0] || isCheckPickPay[1] || isCheckPickPay[2] ? "bg-orange-500 hover:bg-orange-400 cursor-pointer" : "bg-[#b8b2b2] select-none  cursor-not-allowed"}  rounded-md mt-4 items-center justify-center `}
                  onClick={
                    isCheckPickPay[0]
                      ? handleReqPayMoMo
                      : isCheckPickPay[1]
                        ? handleReqPaypal
                        : isCheckPickPay[2]
                          ? handleReqPayVietQR
                          : undefined
                  }>
                  {mutationMoMo.isError ||
                  mutationPaypal.isError ||
                  mutationUpdatePayUrl.isError ? (
                    <h1 className="text-white font-semibold text-sm md:text-base">
                      Có lỗi khi thanh toán, vui lòng thử lại
                    </h1>
                  ) : mutationMoMo.isPending ||
                    mutationPaypal.isPending ||
                    mutationUpdatePayUrl.isPending ? (
                    <l-bouncy size="35" speed="1.75" color="white" />
                  ) : (
                    <h1
                      className={`text-white font-semibold text-sm md:text-base`}>
                      {isCheckPickPay[0]
                        ? `Thanh toán bằng ${pay[0].name}`
                        : isCheckPickPay[1]
                          ? `Thanh toán bằng ${pay[1].name}`
                          : isCheckPickPay[2]
                            ? `Thanh toán bằng ${pay[2].name}`
                            : ""}
                    </h1>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* //! ticket */}
          <div className="flex flex-col">
            {Array.from(
              { length: data?.data?.objectOrder?.dataTickets?.length },
              (_, i) => (
                <InfoTicket
                  key={i}
                  airport={{
                    loaiChuyenBay:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.loaiChuyenBay
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.loaiChuyenBay
                          : "",
                    diemBay:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.diemBay
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.diemBay
                          : "",
                    diemDen:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.diemDen
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.diemDen
                          : "",
                    gioBay:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.gioBay
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.gioBay
                          : "",
                    gioDen:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.gioDen
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.gioDen
                          : "",
                    ngayBay:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.ngayBay
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.ngayBay
                          : "",
                    ngayDen:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.ngayDen
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.ngayDen
                          : "",
                    hangBay:
                      data?.data?.airportDeparture?._id ===
                      data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                        ? data?.data?.airportDeparture?.hangBay
                        : data?.data?.airportReturn?._id ===
                            data?.data?.objectOrder?.dataTickets[i]?.maChuyenBay
                          ? data?.data?.airportReturn?.hangBay
                          : "",
                    loaiTuoi: data?.data?.objectOrder?.dataTickets[i]?.loaiTuoi,
                    hangVe: data?.data?.objectOrder?.dataTickets[i]?.hangVe,
                    giaVe: data?.data?.objectOrder?.dataTickets[i]?.giaVe,
                    Ten: data?.data?.objectOrder?.dataTickets[i]?.Ten,
                    ngaySinh: data?.data?.objectOrder?.dataTickets[i]?.ngaySinh,
                    maSoGhe: data?.data?.objectOrder?.dataTickets[i]?.maSoGhe,
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function NotiMinutes({ setNotiMinues, time }) {
  return (
    <div className="w-full h-full overflow-hidden fixed inset-0 z-[100] bg-white/5 backdrop-brightness-75">
      <div className="fixed z-[100] transform bg-[#0194f3] -translate-x-1/2 rounded-md flex items-start justify-between -translate-y-1/2 top-1/3 left-1/2 w-fit h-fit">
        <p className="subpixel-antialiased font-semibold text-white text-sm md:text-base md:p-3 p-2">
          {`Nếu bạn không thanh toán trước ${time} hệ thống sẽ tự
          động xóa đơn đặt vé của bạn.`}
        </p>
        <div
          className="w-fit cursor-pointer bg-white rounded-bl-lg"
          onClick={() => setNotiMinues(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            className="size-7 stroke-rose-600">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default memo(TrangThanhToan);
