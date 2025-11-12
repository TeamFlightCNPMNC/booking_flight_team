import { CONTEXT } from "../../Context/ContextGlobal";
import { useEffect, useContext, useState, useCallback, memo } from "react";
import InfoTicket from "../Plane/InfoTicket.js";
import Loading from "../Loading.js";
import { ToastContainer } from "react-toastify";
import notify from "../Noti/notify.js";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { authorizedAxiosInstance } from "../Utils/authAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../../Context/SocketContext.js";

function History() {
  const { convertDateToVNDate } = useContext(CONTEXT);

  const [loadingTicketPremium, setLoadTicketPremium] = useState(true);
  const [dataGetTicketPremium, setDataTicketPremium] = useState(null);
  const [showOrdersAfterFilter, setShowOrdersAfterFilter] = useState(null);
  const [totalOrder, setTotalOrder] = useState(0);
  // const [page, setPage] = useState(1);
  // const stateShowOrder = ["Canceled", "Paid", "Pending", 'All'];
  const [stateShowOrder, setStateShowOrder] = useState([
    false,
    false,
    false,
    true,
  ]);
  // Action show filter
  const [rotateIconAction, setRotateIconAction] = useState(false);
  const [iconActionSearch, setIconActionSearch] = useState(false);
  const [changeSearchForAnimation, setChangeSearchForAnimation] = useState("");
  const actionShowFilter = () => {
    setRotateIconAction(!rotateIconAction);
    setIconActionSearch(false);
  };
  const actionSearch = () => {
    if (!changeSearchForAnimation) {
      setIconActionSearch(!iconActionSearch);
      setRotateIconAction(false);
    }
  };

  const findOrderByOnChange = async () => {
    if (showOrdersAfterFilter !== null || dataGetTicketPremium !== null) {
      setShowOrdersAfterFilter(
        dataGetTicketPremium.filter((order) => {
          const tickets = order.tickets;

          return tickets.some((ticket) => {
            const [timePart, datePart] = convertDateToVNDate(
              order.createdAt
            ).split(" ");
            const [date, month, year] = datePart.split("/");
            const dateString = date + month + year;

            return (
              (ticket.maDon === changeSearchForAnimation.trim() ||
                ticket.phoneNumber === changeSearchForAnimation.trim() ||
                datePart === changeSearchForAnimation.trim() ||
                dateString.includes(changeSearchForAnimation.trim())) &&
              order._id === ticket.maDon
            );
          });
        })
      );
    }
    if (!changeSearchForAnimation) {
      if (dataGetTicketPremium !== null) {
        setShowOrdersAfterFilter(
          dataGetTicketPremium.length > 0 ? dataGetTicketPremium : []
        );
      }
    }
  };

  useEffect(() => {
    findOrderByOnChange();
  }, [changeSearchForAnimation]);

  const toggleStates = (indexes) => {
    setStateShowOrder((prev) =>
      prev.map((value, index) => {
        if (indexes.includes(index)) {
          return true;
        } else {
          return false;
        }
      })
    );
  };

  const getTicketPremium = async (page) => {
    try {
      const res = await authorizedAxiosInstance.post(
        `https://travrel-server.vercel.app/user/get_reservation-flights?page=${page}`
      );
      if (res.status === 200) {
        if (res.data.length === 0) {
          setDataTicketPremium([]);
          setShowOrdersAfterFilter([]);
          return;
        }

        toggleStates([3]);

        setShowOrdersAfterFilter(res.data.orders);
        setDataTicketPremium(res.data.orders);
        setTotalOrder(res.data.totalOrder);
      } else {
        return console.error("Error get ticket premium", res);
      }
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    getTicketPremium();
  }, []);

  useEffect(() => {
    if (showOrdersAfterFilter !== null && dataGetTicketPremium !== null) {
      setLoadTicketPremium(false);
    }
  }, [showOrdersAfterFilter, dataGetTicketPremium]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add(
          "drop-shadow-[0_7px_3px_rgb(34,211,238)]",
          "outline-0"
        );
        setTimeout(() => {
          element.classList.remove(
            "drop-shadow-[0_7px_3px_rgb(34,211,238)]",
            "outline-0"
          );
        }, 1000);
      }
    }
  }, [loadingTicketPremium]);

  const location = useLocation();
  const navigate = useNavigate();

  const updateUrl = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page); // Cập nhật tham số 'page'

    // Cập nhật URL mà không tải lại trang
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  if (loadingTicketPremium) {
    return <Loading />;
  }

  const funcSearchOrderCancel = () => {
    toggleStates([0]);

    setShowOrdersAfterFilter(
      dataGetTicketPremium.filter((order) => order.trangThai === "Đã hủy")
        .length > 0
        ? dataGetTicketPremium.filter((order) => order.trangThai === "Đã hủy")
        : []
    );
  };
  const funcSearchOrderPaid = () => {
    toggleStates([1]);

    setShowOrdersAfterFilter(
      dataGetTicketPremium.filter(
        (order) => order.trangThai === "Đã thanh toán"
      ).length > 0
        ? dataGetTicketPremium.filter(
            (order) => order.trangThai === "Đã thanh toán"
          )
        : []
    );
  };
  const funcSearchOrderPendingPay = () => {
    toggleStates([2]);

    setShowOrdersAfterFilter(
      dataGetTicketPremium.filter(
        (order) => order.trangThai === "Đang chờ thanh toán"
      ).length > 0
        ? dataGetTicketPremium.filter(
            (order) => order.trangThai === "Đang chờ thanh toán"
          )
        : []
    );
  };
  const funcCancelSearchOrder = () => {
    toggleStates([3]);

    setShowOrdersAfterFilter(
      dataGetTicketPremium.length > 0 ? dataGetTicketPremium : []
    );
  };

  const handlePageClick = (event) => {
    getTicketPremium(+event.selected + 1);
    updateUrl(+event.selected + 1);
  };

  return (
    <>
      <ToastContainer />
      <div className="relative flex items-center w-full h-[42px] my-5 text-xl font-semibold select-none overflow-hidden">
        <div
          className={`flex h-[42px] justify-center w-fit items-center right-[12%] absolute ${rotateIconAction ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {iconActionSearch && (
            <>
              <input
                type="search"
                value={changeSearchForAnimation}
                className={`w-[420px] h-full p-2 outline-none border-b font-normal text-lg transition ${changeSearchForAnimation ? "border-b-[#0194f3] animate-pulse" : ""}`}
                placeholder="Ngày đặt đơn hàng hoặc mã đơn hàng"
                onChange={(event) =>
                  setChangeSearchForAnimation(event.target.value)
                }
              />
            </>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className={`transition-transform duration-300 cursor-pointer size-7 ${iconActionSearch ? "-rotate-12" : "rotate-90"} ${changeSearchForAnimation ? "stroke-[#DC2626]" : "stroke-[#0194f3]"}`}
            onClick={actionSearch}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <div
          className={`absolute w-fit transform -translate-x-1/2 left-[50%] whitespace-nowrap transition-opacity duration-300 ${rotateIconAction || iconActionSearch ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          Lịch sử đơn hàng
        </div>
        {!iconActionSearch && (
          <div
            className={`flex h-[42px] w-fit items-center absolute left-[12%]`}
          >
            {!rotateIconAction && (
              <span className="relative flex w-3 h-3 left-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
              </span>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#0194f3"
              className="transition-transform duration-300 cursor-pointer size-7"
              style={!rotateIconAction ? { transform: "rotate(-90deg)" } : {}}
              onClick={actionShowFilter}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>

            <div
              className={`ml-3 gap-x-3 w-[420px] h-[42px] transition-opacity duration-300 flex ${rotateIconAction ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <button
                type="button"
                className={`${stateShowOrder[0] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} select-none flex font-medium p-2 text-base rounded-xl border border-[#109AF4] transition duration-0 hover:duration-700 hover:ease-in-out`}
                onClick={funcSearchOrderCancel}
              >
                Đã hủy
              </button>
              <button
                type="button"
                className={`${stateShowOrder[1] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} select-none flex font-medium p-2 rounded-xl text-base border border-[#109AF4] transition duration-0 hover:duration-700 hover:ease-in-out`}
                onClick={funcSearchOrderPaid}
              >
                Đã thanh toán
              </button>
              <button
                type="button"
                className={`${stateShowOrder[2] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} flex  font-medium p-2 rounded-xl border text-base border-[#109AF4] select-none transition duration-0 hover:duration-700 hover:ease-in-out`}
                onClick={funcSearchOrderPendingPay}
              >
                Chưa thanh toán
              </button>
              <button
                type="button"
                className={`${stateShowOrder[3] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} transition duration-0 hover:duration-700 text-base hover:ease-in-out flex font-medium p-2 rounded-xl border border-[#109AF4] select-none`}
                onClick={funcCancelSearchOrder}
              >
                All
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="px-5 pt-5 border-t">
        {showOrdersAfterFilter !== null && (
          <HistoryDon
            showOrdersAfterFilter={showOrdersAfterFilter}
            loadingTicketPremium={loadingTicketPremium}
            setLoadTicketPremium={setLoadTicketPremium}
            refreshOrders={getTicketPremium}
          />
        )}

        {showOrdersAfterFilter.length === 0 && (
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
      <ReactPaginate
        className="flex justify-center gap-x-4 text-lg font-mono border p-4"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalOrder}
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
      />
    </>
  );
}

function HistoryDon({
  loadingTicketPremium,
  showOrdersAfterFilter,
  setLoadTicketPremium,
  refreshOrders,
}) {
  const { convertDateToVNDate, handleReplacePriceAirport, naviReload } =
    useContext(CONTEXT);

  const { showNotificationSocket, setShowNotificationSocket, socket } =
    useContext(SocketContext);

  const payment = JSON.parse(localStorage.getItem("payment"));

  const huyOrder = async (_id) => {
    setLoadTicketPremium(true);

    try {
      const response = await authorizedAxiosInstance.post(
        `https://travrel-server.vercel.app/order/update_status`,
        {
          status: 201,
          orderID: _id,
        }
      );
      if (response.status === 200) {
        if (socket) {
          socket.emit();
        }

        if (payment && payment.split(" ")[0].replace(/"/g, "") === _id) {
          localStorage.removeItem("payment");
        }
        await refreshOrders();
      }
    } catch (error) {
      notify("Error", "Hủy đơn hàng không thành công, vui lòng thử lại sau");
    } finally {
      setLoadTicketPremium(false);
    }
  };

  const thanhToan = (order) => {
    const data = {
      timeEndPayOrder: convertDateToVNDate(order.expiredAt),
      objectOrder: {
        idDH: order._id,
        priceOrder: order.tongGia,
        createAt: order.createdAt,
        expiredAt: order.expiredAt,
        dataTickets: order.tickets,
      },
    };
    naviReload("/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan", {
      state: {
        data: data,
      },
    });
  };

  const huyVeKhuHoi = async (order) => {
    setLoadTicketPremium(true);
    const tickets = order.tickets.filter(
      (ticket) => ticket.loaiChuyenBay === "Chuyến bay đi"
    );

    const priceNew =
      new Intl.NumberFormat("vi-VN").format(
        tickets.reduce((acc, item) => {
          const giaVeSo = handleReplacePriceAirport(
            item.giaVe.replace(/\./g, ",")
          );

          return acc + giaVeSo;
        }, 0)
      ) + " VND";

    try {
      const response = await authorizedAxiosInstance.post(
        `https://travrel-server.vercel.app/order/ccc`,
        {
          orderID: order._id,
          priceNew: priceNew,
        }
      );
      if (response.status === 200) {
        await notify("Success", "Hủy vé khứ hồi thành công");

        await refreshOrders();
      }
      if (response.status === 404) {
        notify("Warn", response.data.message);
      }
    } catch (error) {
      notify("Error", "Hủy đơn hàng không thành công, vui lòng thử lại sau");
    } finally {
      setLoadTicketPremium(false);
    }
  };

  const [historyVe, setHistoryVe] = useState(null);

  const handleHistoryVe = useCallback(
    (index) => {
      setHistoryVe(historyVe === index ? null : index);
    },
    [historyVe]
  );

  const [isBeginUpdateTicket, setBeginUpdateTicket] = useState(false);
  const funcUpdateTicket = () => {
    setBeginUpdateTicket(true);
    notify("Info", "Coming soon");
  };

  if (loadingTicketPremium) {
    return <Loading />;
  }

  return (
    <>
      {showOrdersAfterFilter.map((order, index) => (
        <div
          id={`${order._id}`}
          key={order._id}
          className={`w-full p-2 mb-5 hover:text-zinc-800 outline-slate-300 hover:duration-500 transition-all overflow-hidden duration-300 relative outline outline-1  rounded-lg select-none min-h-[110px]`}
        >
          <div>
            <div
              className="flex justify-between w-full cursor-pointer"
              onClick={() => handleHistoryVe(index)}
            >
              <div className="font-semibold w-full overflow-hidden">
                <p className="line-clamp-1">
                  Ngày đặt vé: {convertDateToVNDate(order.createdAt)}
                </p>
                <p className="line-clamp-1">Số lượng vé: {order.soLuongVe}</p>
                <p className="line-clamp-1">
                  Loại chuyến bay:
                  {order.tickets.some(
                    (ticket) => ticket.loaiChuyenBay === "Chuyến bay khứ hồi"
                  )
                    ? " Chuyến bay một chiều và khứ hồi"
                    : " Chuyến bay một chiều"}
                </p>
                <p className="line-clamp-1">Tổng giá: {order.tongGia}</p>
                <p className="line-clamp-1">
                  Trạng thái:{" "}
                  {order.trangThai === "Đã thanh toán" && (
                    <span className="text-[#0bc175]">{order.trangThai}</span>
                  )}
                  {order.trangThai === "Đang chờ thanh toán" && (
                    <span className="text-[#ffd000]">{order.trangThai}</span>
                  )}
                  {order.trangThai === "Đã hủy" && (
                    <span className="text-red-600">{order.trangThai}</span>
                  )}
                  {order.trangThai ===
                    "Đang chờ thanh toán chuyến đi (Đã hủy vé khứ hồi)" && (
                    <span className="text-[#0bc175]">{order.trangThai}</span>
                  )}
                </p>
              </div>
            </div>

            {historyVe === index && (
              <>
                <HistoryVe
                  isBeginUpdateTicket={isBeginUpdateTicket}
                  ves={showOrdersAfterFilter[index].tickets}
                  dtChuyenBays={showOrdersAfterFilter[index]}
                  donhang={showOrdersAfterFilter}
                />
              </>
            )}
          </div>

          {showOrdersAfterFilter[index].trangThai.includes(
            "Đang chờ thanh toán"
          ) && (
            <div className="absolute z-10 flex top-2 right-2 gap-x-3">
              <button
                className={`font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                onClick={() => huyOrder(showOrdersAfterFilter[index]._id)}
              >
                Hủy đơn
              </button>
              {order.tickets.some(
                (ticket) =>
                  ticket.loaiChuyenBay === "Chuyến bay khứ hồi" &&
                  ticket.trangThaiVe !== "Đã hủy"
              ) && (
                <button
                  className={`font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                  onClick={() => huyVeKhuHoi(showOrdersAfterFilter[index])}
                >
                  Hủy vé khứ hồi
                </button>
              )}

              <button
                className={`font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white transition ease-in-out active:bg-slate-200 bg-[#109AF4]`}
                onClick={() => thanhToan(showOrdersAfterFilter[index])}
              >
                Thanh toán
              </button>
              {/* <button
                className={`font-semibold line-clamp-1 rounded-md text-[14px] transition ease-in-out active:bg-slate-200 p-2 self-center text-white ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-[#109AF4]"}`}
                onClick={funcUpdateTicket}
              >
                Sửa vé
              </button> */}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function HistoryVe({ isBeginUpdateTicket, ves, dtChuyenBays }) {
  const [indexChooseTicket, setIndexChooseTicket] = useState(null);

  const hanldeChooseTicket = useCallback(
    (index) => {
      setIndexChooseTicket(indexChooseTicket === index ? null : index);
    },
    [indexChooseTicket]
  );

  return (
    <div className="flex w-full p-2 overflow-x-scroll gap-x-3">
      {ves &&
        ves.map((ve, index) => (
          <div className={`flex w-fit h-fit}`}>
            <div
              className={`w-fit h-fit ${isBeginUpdateTicket ? "cursor-pointer" : ""} `}
              onClick={() => hanldeChooseTicket(index)}
            >
              <InfoTicket airport={dtChuyenBays.tickets[index]} />
            </div>

            {isBeginUpdateTicket && indexChooseTicket === index && (
              <>
                <div className="w-[300px] h-full ml-3 bg-gray-500">
                  <InfoTicket
                    dataFlight={dtChuyenBays}
                    dataTicket={ve}
                    enableUpdateTIcket={isBeginUpdateTicket}
                  />
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

function ShowUIChooseTicketUpdateAnima({ dtChuyenBays, ve }) {
  //assssaaaaaaa
  return (
    <div className="fixed inset-0 z-20 w-screen h-full bg-orange-400 opacity-50">
      {ve &&
        ve.map((ve, index) => (
          <div className="w-fit">
            <InfoTicket dataFlight={dtChuyenBays} dataTicket={ve} />
          </div>
        ))}
    </div>
  );
}

export default memo(History);
