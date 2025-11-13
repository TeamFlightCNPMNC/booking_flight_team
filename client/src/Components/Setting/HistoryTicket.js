import { CONTEXT } from "../../Context/ContextGlobal";
import { useEffect, useContext, useState, useCallback, memo } from "react";
import InfoTicket from "../Plane/InfoTicket.js";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pay, UpdatepdateStatus } from "../../API/DonHang.js";
import { useReservations } from "../../API/Account.js";
import { bouncy } from "ldrs";
import { UpdatePayUrl } from "../../API/Payment.js";

function History() {
  const queryClient = useQueryClient();
  bouncy.register();
  const location = useLocation();
  const navigate = useNavigate();

  const { showNotification } = useContext(CONTEXT);

  const [dataReservation, setDataReservation] = useState([]);

  //1. so page hien tai 2. tong so page
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  /* 1. trang thai hien option
  2. da huy
  3. da thanh toan
  4. chua thanh toan
  5. all
  */
  const [optionShow, setOptionShow] = useState([
    false,
    false,
    false,
    false,
    true,
  ]);
  const [optionTypes, setOptionTypes] = useState(4);

  // thay doi trang thai cua option hien don hang
  const stateOptionShow = (indexes) => {
    setOptionShow((prev) =>
      prev.map((value, index) => {
        if (indexes.includes(index)) {
          return true;
        }
        return index !== 0 ? false : value;
      })
    );
  };

  // 1. trang thai hien search 2. content search
  const [isSearch, setIsSearch] = useState([false, ""]);

  // const findOrderByOnChange = async () => {
  //   if (dataReservation !== null) {
  //     setDataReservation(
  //       dataReservation.filter((order) => {
  //         const tickets = order.tickets;

  //         return tickets.some((ticket) => {
  //           const [timePart, datePart] = convertDateToVNDate(
  //             order.createdAt
  //           ).split(" ");
  //           const [date, month, year] = datePart.split("/");
  //           const dateString = date + month + year;

  //           return (
  //             (ticket.maDon === isSearch[1]?.trim() ||
  //               ticket.phoneNumber === isSearch[1]?.trim() ||
  //               datePart === isSearch.trim() ||
  //               dateString.includes(isSearch[1]?.trim())) &&
  //             order._id === ticket.maDon
  //           );
  //         });
  //       })
  //     );
  //   }
  // };

  const updateUrl = (page, type) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    params.set("type", type);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const types = ["Đã hủy", "Đã thanh toán", "Chưa thanh toán", "All"];

  const { data, isLoading, error } = useReservations(
    currentPage + 1,
    types[optionTypes - 1]
  );

  useEffect(() => {
    if (data?.data) {
      setDataReservation(data.data.orders);
      setTotalPage(data.data.totalPage);
    }
  }, [data]);

  const handleChooseOptionShow = (index) => {
    const page = 1;
    setCurrentPage(0);
    updateUrl(page, types[index]);
    setOptionTypes(index + 1);
    stateOptionShow([index + 1]);
    setOptionShow((pre) => [!pre[0], pre[1], pre[2], pre[3], pre[4]]);
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    updateUrl(selectedPage, types[optionTypes - 1]);
  };

  useEffect(() => {
    const handlePage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get("page") || 1;
      const type = urlParams.get("type") || "All";
      setCurrentPage(Number(page) - 1);
      updateUrl(page, type);
      setOptionTypes([types.indexOf(type) + 1]);
      stateOptionShow([types.indexOf(type) + 1]);
    };

    handlePage();
  }, []);

  const mutationUpdatepdateStatus = useMutation({
    mutationFn: UpdatepdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries("reservations");
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Lỗi hủy đơn hàng",
        "Warn"
      );
    },
  });

  const mutationPay = useMutation({
    mutationFn: Pay,
    onError: (error) => {
      showNotification(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Lỗi thanh toán",
        "Warn"
      );
    },
  });

  const mutationUpdatePayUrl = useMutation({
    mutationFn: UpdatePayUrl,
    onError: (error) => {
      showNotification(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Lỗi khi hủy khứ hồi",
        "Warn"
      );
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="relative flex items-center w-full h-[407px] my-5 text-xl font-semibold select-none overflow-hidden">
          <div className="w-full h-full justify-center items-center flex">
            <l-bouncy size="45" speed="1.75" color="black" />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full min-h-full inset-0 flex-1 flex flex-col p-3 md:p-0 overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <div className="md:px-5 gap-x-2 md:gap-x-5 border-b rounded-sm md:border-none md:rounded-none relative flex items-center w-full h-[40px] my-3 md:my-5 text-xl font-semibold select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="transition-transform duration-300 cursor-pointer size-6 md:size-7 stroke-[#0194f3]"
                  style={!optionShow[0] ? { transform: "rotate(-90deg)" } : {}}
                  onClick={() =>
                    setOptionShow((pre) => [
                      !pre[0],
                      pre[1],
                      pre[2],
                      pre[3],
                      pre[4],
                    ])
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                {!isSearch[0] && (
                  <div
                    className={`bg-zinc-900 rounded overflow-hidden top-0 z-10 font-mono md:font-sans absolute md:bg-transparent transition-opacity duration-300 ${optionShow[0] ? "opacity-100 w-fit md:w-[420px] h-fit md:h-[42px] md:gap-3 flex flex-col md:flex-row md:right-0 ml-10" : "opacity-0 pointer-events-none w-0 h-0"}`}
                  >
                    {Array.from({ length: 4 }, (_, i) => (
                      <OptionShowHistoryOrder
                        index={i}
                        content={
                          i === 0
                            ? "Đã hủy"
                            : i === 1
                              ? "Đã thanh toán"
                              : i === 2
                                ? "Chưa thanh toán"
                                : "All"
                        }
                        stateChoose={
                          i === 0
                            ? optionShow[1]
                            : i === 1
                              ? optionShow[2]
                              : i === 2
                                ? optionShow[3]
                                : optionShow[4]
                        }
                        handleChooseOptionShow={handleChooseOptionShow}
                      />
                    ))}
                  </div>
                )}

                <div
                  className={`Typewriter transition-opacity duration-300 ${optionShow[0] || isSearch[0] ? "opacity-0 pointer-events-none w-0 h-0" : "opacity-100 h-fit w-fit whitespace-nowrap"}`}
                >
                  <p className="text-neutral-900 font-medium text-sm md:text-lg truncate">
                    Lịch sử đơn hàng
                  </p>
                </div>
              </div>

              <div className="md:px-5 md:pt-5 md:border-t">
                {dataReservation?.length > 0 ? (
                  <HistoryDon
                    dataReservation={dataReservation}
                    isSearch={isSearch}
                    mutationUpdatepdateStatus={mutationUpdatepdateStatus}
                    mutationPay={mutationPay}
                    mutationUpdatePayUrl={mutationUpdatePayUrl}
                  />
                ) : (
                  <div className="flex items-center select-none gap-11">
                    <img
                      alt="nodata"
                      src="https://ik.imagekit.io/tvlk/image/imageResource/2020/07/10/1594367281441-5ec1b573d106b7aec243b19efa02ac56.svg?tr=h-96,q-75,w-96"
                    />
                    <p className="text-center text-gray-500 h-fit">
                      Không có đơn hàng nào.
                    </p>
                  </div>
                )}
              </div>
              {dataReservation?.length > 0 && (
                <ReactPaginate
                  className="flex justify-center gap-x-4 rounded md:rounded-md text-base md:text-lg font-mono border p-2 md:p-4"
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={totalPage}
                  previousLabel="< previous"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="bg-blue-500 text-white rounded-md w-7 h-full text-center"
                  renderOnZeroPageCount={null}
                  forcePage={currentPage}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function OptionShowHistoryOrder({
  index,
  content,
  stateChoose,
  handleChooseOptionShow,
}) {
  return (
    <button
      type="button"
      className={`${stateChoose ? "text-[#109AF4]" : "md:text-zinc-700 text-white"} w-full justify-center whitespace-nowrap select-none flex font-medium p-2 text-base border-b md:border-none border-[#109AF4] transition duration-0 hover:duration-700 hover:ease-in-out`}
      onClick={() => handleChooseOptionShow(index)}
    >
      {content}
    </button>
  );
}

function HistoryDon({
  mutationUpdatepdateStatus,
  dataReservation,
  isSearch,
  mutationPay,
  mutationUpdatePayUrl,
}) {
  const {
    convertDateToVNDate,
    handleReplacePriceAirport,
    naviReload,
    convertVNDtoUSD,
    setQR_VietQR,
    setTimeExpired_VietQR,
    showNotification,
    setOrderId_VietQR,
  } = useContext(CONTEXT);

  const huyOrder = async (order) => {
    const flightsDeparture = order.tickets.filter(
      (ticket) => ticket?.flights?.loaiChuyenBay === "Chuyến bay đi"
    );
    const flightsReturn = order.tickets.filter(
      (ticket) => ticket?.flights?.loaiChuyenBay === "Chuyến bay khứ hồi"
    );

    const countTicketNormal = flightsDeparture.filter(
      (ticket) => ticket.hangVe === "Vé phổ thông"
    ).length;
    const countTicketBusiness = flightsDeparture.filter(
      (ticket) => ticket.hangVe === "Vé thương gia"
    ).length;
    const countTicketNormalReturn = flightsReturn.filter(
      (ticket) =>
        ticket.hangVe === "Vé phổ thông" &&
        ticket.trangThaiVe === "Chưa thanh toán"
    ).length;
    const countTicketBusinessReturn = flightsReturn.filter(
      (ticket) =>
        ticket.hangVe === "Vé thương gia" &&
        ticket.trangThaiVe === "Chưa thanh toán"
    ).length;

    const price =
      new Intl.NumberFormat("vi-VN").format(
        order.tickets.reduce((acc, item) => {
          const giaVeSo = handleReplacePriceAirport(item.giaVe);

          return acc + giaVeSo;
        }, 0)
      ) + " VND";

    mutationUpdatepdateStatus.mutate({
      status: "201",
      orderID: order._id,
      flight: {
        idDeparture: flightsDeparture[0].flights._id,
        idReturn: flightsReturn[0]?.flights._id,

        countTicketNormal: countTicketNormal,
        countTicketBusiness: countTicketBusiness,

        countTicketNormalReturn: countTicketNormalReturn,
        countTicketBusinessReturn: countTicketBusinessReturn,

        price: price,
      },
    });
  };

  const thanhToan = async (order) => {
    const currentTime = new Date();
    if (currentTime >= new Date(order.expiredAt)) {
      showNotification("Thời gian thanh toán đã hết", "Warn");
      return;
    }
    const airportDeparture = order.tickets.filter(
      (ticket) => ticket.flights?.loaiChuyenBay === "Chuyến bay đi"
    );
    const airportReturn = order.tickets.filter(
      (ticket) => ticket.flights?.loaiChuyenBay === "Chuyến bay khứ hồi"
    );

    const data = {
      timeEndPayOrder: convertDateToVNDate(order.expiredAt),
      objectOrder: {
        idDH: order._id,
        priceOrder: order.tongGia,
        createAt: order.createdAt,
        expiredAt: order.expiredAt,
        dataTickets: order.tickets,
      },
      airportDeparture: airportDeparture[0].flights,
      airportReturn: airportReturn.length > 0 ? airportReturn[0].flights : {},
    };

    const response = await mutationPay.mutateAsync({ orderId: order._id });
    if (response.status === 200) {
      if (response.data.payment?.payUrl === "NO payURL") {
        naviReload("/XemDanhSachChuyenbBay/ThanhToan", {
          state: {
            data: data,
          },
        });
      } else if (response.data.payment?.typePay === "VietQR") {
        setOrderId_VietQR(order._id);
        setQR_VietQR(response.data.payment.payUrl);
        setTimeExpired_VietQR(order.expiredAt);
      } else {
        window.location.href = response.data.payment.payUrl;
      }
    }
  };

  const huyVeKhuHoi = async (order) => {
    const tickets = order.tickets.filter(
      (ticket) => ticket?.flights?.loaiChuyenBay === "Chuyến bay đi"
    );

    const ticketsReturn = order.tickets.filter(
      (ticket) => ticket?.flights?.loaiChuyenBay === "Chuyến bay khứ hồi"
    );
    const priceNew =
      new Intl.NumberFormat("vi-VN").format(
        tickets.reduce((acc, item) => {
          const giaVeSo = handleReplacePriceAirport(item.giaVe);

          return acc + giaVeSo;
        }, 0)
      ) + " VND";

    const countTicketNormal = ticketsReturn.filter(
      (ticket) => ticket.hangVe === "Vé phổ thông"
    ).length;
    const countTicketBusiness = ticketsReturn.filter(
      (ticket) => ticket.hangVe === "Vé thương gia"
    ).length;

    const res = await mutationUpdatepdateStatus.mutateAsync({
      status: "202",
      orderID: order._id,
      flight: {
        id: ticketsReturn[0]?.flights?._id,
        priceNew: priceNew,
        countTicketNormal: countTicketNormal,
        countTicketBusiness: countTicketBusiness,
      },
    });
    if (res.status === 200) {
      mutationUpdatePayUrl.mutate({
        orderId: order._id,
        payUrl: "NO payURL",
      });
      localStorage.setItem(
        "payment",
        JSON.stringify(`${order?._id} ${order?.expiredAt}`)
      );
    }
  };

  const [historyVe, setHistoryVe] = useState(null);

  const handleHistoryVe = useCallback(
    (index) => {
      setHistoryVe(historyVe === index ? null : index);
    },
    [historyVe]
  );

  return (
    <>
      {dataReservation?.map((order, index) => (
        <div
          key={order._id}
          className={`rounded-md bg-white relative shadow-md overflow-hidden p-2 w-full mb-5 transition-all duration-300 border-b border-zinc-200 select-none min-h-[110px]`}
        >
          <div>
            <div
              className="font-semibold w-full overflow-hidden cursor-pointer text-stone-800 font-sans"
              onClick={() => handleHistoryVe(index)}
            >
              <p className="line-clamp-1">
                Ngày đặt vé: {convertDateToVNDate(order.createdAt)}
              </p>
              <p className="line-clamp-1">Số lượng vé: {order.soLuongVe}</p>
              <p className="line-clamp-1">
                Loại CB:
                {order.tickets.some(
                  (ticket) =>
                    ticket?.flights?.loaiChuyenBay === "Chuyến bay khứ hồi"
                )
                  ? " Chuyến bay một chiều và khứ hồi"
                  : " Chuyến bay một chiều"}
              </p>
              <p className="line-clamp-1">
                Tổng giá: {order.tongGia}{" "}
                {order?.phuongThuc === "Paypal" &&
                  `~ ${convertVNDtoUSD(order.tongGia)} USD`}
              </p>
              <p className="line-clamp-1">
                Trạng thái:{" "}
                {order.trangThai === "Đã thanh toán" && (
                  <span className="text-[#0bc175]">{order.trangThai}</span>
                )}
                {order.trangThai === "Chưa thanh toán" && (
                  <span className="text-[#ffd000]">{order.trangThai}</span>
                )}
                {order.trangThai === "Đã hủy" && (
                  <span className="text-red-600">{order.trangThai}</span>
                )}
                {order.trangThai ===
                  "Chưa thanh toán chuyến đi (Đã hủy vé khứ hồi)" && (
                  <span className="text-[#ffd000]">{order.trangThai}</span>
                )}
              </p>
              <p className="line-clamp-1">
                {(order.trangThai === "Chưa thanh toán" ||
                  order.trangThai ===
                    "Chưa thanh toán chuyến đi (Đã hủy vé khứ hồi)") && (
                  <span className="text-red-500">
                    • {convertDateToVNDate(order.expiredAt)} đơn hàng sẽ bị xóa
                    nếu không thanh toán
                  </span>
                )}
              </p>
              {order.trangThai === "Đã thanh toán" && order?.phuongThuc && (
                <p className="line-clamp-1">
                  Phương thức thanh toán:{" "}
                  <span className="text-[#0bc175]">{order?.phuongThuc}</span>
                </p>
              )}
            </div>

            {historyVe === index && (
              <>
                <HistoryVe order={dataReservation[index]} />
              </>
            )}
          </div>

          {dataReservation[index].trangThai.includes("Chưa thanh toán") && (
            <div className="absolute z-10 flex top-2 right-2 gap-3 flex-col text-sm">
              <button
                className={`font-semibold line-clamp-1 rounded md:rounded-md p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                onClick={() => huyOrder(dataReservation[index])}
              >
                {mutationUpdatepdateStatus.isPending ? (
                  <l-bouncy size="30" speed="1.75" color="white" />
                ) : (
                  "Hủy đơn"
                )}
              </button>
              {order.tickets.some(
                (ticket) =>
                  ticket.flights.loaiChuyenBay === "Chuyến bay khứ hồi" &&
                  ticket.trangThaiVe !== "Đã hủy"
              ) && (
                <button
                  className={`font-semibold line-clamp-1 rounded md:rounded-md p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                  onClick={() => huyVeKhuHoi(dataReservation[index])}
                >
                  {mutationUpdatepdateStatus.isPending ? (
                    <l-bouncy size="30" speed="1.75" color="white" />
                  ) : (
                    "Hủy khứ hồi"
                  )}
                </button>
              )}

              <button
                className={`transition-all duration-500 font-semibold line-clamp-1 rounded md:rounded-md p-2 self-center text-white ease-in-out active:bg-slate-200 bg-[#109AF4]`}
                onClick={() => thanhToan(dataReservation[index])}
              >
                {mutationPay.isPending ? (
                  <l-bouncy size="30" speed="1.75" color="white" />
                ) : (
                  "Thanh toán"
                )}
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function HistoryVe({ order }) {
  return (
    <div className="flex w-full p-2 overflow-x-auto gap-x-3">
      {order.tickets &&
        order.tickets.map((ticket, index) => (
          <div className={`min-w-fit h-fit`}>
            <InfoTicket
              airport={{
                loaiChuyenBay: ticket.flights.loaiChuyenBay,
                diemBay: ticket.flights.diemBay,
                diemDen: ticket.flights.diemDen,
                gioBay: ticket.flights.gioBay,
                gioDen: ticket.flights.gioDen,
                ngayBay: ticket.flights.ngayBay,
                ngayDen: ticket.flights.ngayDen,
                hangBay: ticket.flights.hangBay,
                loaiTuoi: ticket.loaiTuoi,
                hangVe: ticket.hangVe,
                giaVe: ticket.giaVe,
                maSoGhe: ticket.maSoGhe,
                Ten: ticket.Ten,
                ngaySinh: ticket.ngaySinh,
                trangThaiVe: ticket.trangThaiVe,
              }}
            />
          </div>
        ))}
    </div>
  );
}

export default memo(History);
