/* eslint-disable no-unused-vars */
import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  memo,
} from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "react-slideshow-image/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import Header from "../Header.js";
import ItemFlight from "./ItemFlight.js";
import { LoginSuccess } from "../Setting/StateLoginSucces.js";
import { differenceInMinutes, parse } from "date-fns";
import { useLocation } from "react-router-dom";
import { GheMaSoGhe, useSearchFlights } from "../../API/Flight.js";
import ComponentSearchFlight from "./SearchFlight.js";
import { bouncy } from "ldrs";
import { Helmet } from "react-helmet-async";
import AdjustQuantityv2 from "./AdjustQuantityv2.js";
import { useMutation } from "@tanstack/react-query";
import Footer from "../Footer.js";
import { calculateDuration } from "../Utils/tinhThoiGianBay.js";
import FuncChatbot from "../Chatbot/FuncChatbot.js";

function XemDanhSachChuyenBay() {
  const {
    openAdjustQuantity,
    setOpenAdjustQuantity,
    setHideDetailItemFlight,
    isShowOptionSetting_LoginSuccess,
    setShowOptionSetting_LoginSuccess,
    handleShowAirports,
    AirportFrom,
    AirportTo,
    editQuantityPassenger,
    bayMotChieu,
    Departure_Return_Date,
    setBayMotChieu,
    setAirportFrom,
    setAirportTo,
    setEditQuantityPassenger,
    setDeparture_Return_Date,
    handleReplacePriceAirport,
    showNotification,
    setSavedSeatState,
    isShowChatbot,
    setShowChatbot,
  } = useContext(CONTEXT);

  bouncy.register();
  const location = useLocation();

  const [isFlights, setFlights] = useState({
    departureFlights: [],
    returnFlights: [],
  });

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    try {
      const departure = searchParams.get("departure");
      const arrival = searchParams.get("arrival");
      const departureDate = searchParams.get("departureDate");
      const oneWayTicket_ = searchParams.get("oneWayTicket");
      const returnDate = searchParams.get("returnDate");
      const passengers = searchParams.get("passengers");

      if (!departure || !arrival || !departureDate || !passengers) {
        console.error("Missing required parameters");
        return;
      }

      setAirportFrom(departure);
      setAirportTo(arrival);
      setEditQuantityPassenger(passengers.split(",").map(Number));

      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-").map(Number);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          throw new Error("Invalid date format");
        }
        return new Date(year, month - 1, day);
      };

      const dateDeparFormat = parseDate(departureDate);

      let dateReturn;

      if (oneWayTicket_ === "true") {
        dateReturn = new Date(
          dateDeparFormat.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      } else {
        if (!returnDate) {
          throw new Error("Return date is required for round trip");
        }
        dateReturn = parseDate(returnDate);
      }
      setBayMotChieu(oneWayTicket_ === "true");

      setDeparture_Return_Date([dateDeparFormat, dateReturn]);
    } catch (error) {
      console.error("Error processing search parameters:", error);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setBayMotChieu(searchParams.get("oneWayTicket") === "true");
  }, [location.search]);

  const { data, isLoading, error } = useSearchFlights({
    searchParams: searchParams.toString(),
  });

  useEffect(() => {
    if (data) {
      setFlights(data);
    } else {
      setFlights({
        departureFlights: [],
        returnFlights: [],
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log(error);
      showNotification(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Lỗi khi tìm chuyến bay",
        "Warn"
      );
    }
  }, [error]);

  const [filterPrice, setFilterPrice] = useState(
    Number(0).toLocaleString("vi-VN")
  );

  const [filterPrice_Increase_Reduce, setFilterPrice_Increase_Reduce] =
    useState([false, false]);
  const [filterAirlines, setFilterAirlines] = useState(false);

  const hanldeStateFilterPrice_Increase_Reduce = (index) => {
    setFilterPrice_Increase_Reduce((pre) => pre.map((_, idx) => idx === index));
  };

  const [oneWayTicket, setOneWayTicket] = useState([]);
  const [roundtripTicket, setRoundtripTicket] = useState([]);

  const handleFilterOneWayTicket = useCallback(
    ({ kindFilter }) => {
      const departureFlights = [...isFlights?.departureFlights];
      const returnFlights = [...isFlights?.returnFlights];

      switch (kindFilter) {
        case "ReducePrice":
          setOneWayTicket(
            departureFlights.sort(
              (airport, airport_) =>
                handleReplacePriceAirport(airport_.gia) -
                handleReplacePriceAirport(airport.gia)
            )
          );
          setRoundtripTicket(
            returnFlights.sort(
              (airport, airport_) =>
                handleReplacePriceAirport(airport_.gia) -
                handleReplacePriceAirport(airport.gia)
            )
          );
          hanldeStateFilterPrice_Increase_Reduce(1);
          break;
        case "IncreasePrice":
          setOneWayTicket(
            departureFlights.sort(
              (airport, airport_) =>
                handleReplacePriceAirport(airport.gia) -
                handleReplacePriceAirport(airport_.gia)
            )
          );
          setRoundtripTicket(
            returnFlights.sort(
              (airport, airport_) =>
                handleReplacePriceAirport(airport.gia) -
                handleReplacePriceAirport(airport_.gia)
            )
          );
          hanldeStateFilterPrice_Increase_Reduce(0);
          break;
        case "Airlines":
          setOneWayTicket(
            departureFlights.sort((a, b) => a.hangBay.localeCompare(b.hangBay))
          );
          setRoundtripTicket(
            returnFlights.sort((a, b) => a.hangBay.localeCompare(b.hangBay))
          );
          setFilterAirlines(true);
          break;
        default:
          setOneWayTicket(departureFlights);
          setRoundtripTicket(returnFlights);
          setFilterPrice_Increase_Reduce([false, false]);
          setFilterAirlines(false);
      }
    },
    [isFlights, handleReplacePriceAirport]
  );

  useEffect(() => {
    handleFilterOneWayTicket({ kindFilter: "All" });
  }, [handleFilterOneWayTicket]);

  const [filterTakeoffTime, setFilterTakeoffTime] = useState([
    "00:00",
    "24:00",
  ]);

  const [filterLandingTime, setFilterLandingTime] = useState([
    "00:00",
    "24:00",
  ]);

  const handleFilterTakeoffTime = (event, newValue) => {
    let [startHour, endHour] = newValue;

    if (endHour - startHour < 1) {
      if (startHour === parseInt(filterTakeoffTime[0].split(":")[0])) {
        endHour = startHour + 1;
      } else {
        startHour = endHour - 1;
      }
    }

    // Cập nhật filterTakeoffTime với định dạng hh:mm
    setFilterTakeoffTime([
      startHour.toString().padStart(2, "0") + ":00",
      endHour.toString().padStart(2, "0") + ":00",
    ]);
  };

  const handleFilterLadingTime = (event, newValue) => {
    let [startHour, endHour] = newValue;

    if (endHour - startHour < 1) {
      if (startHour === parseInt(filterTakeoffTime[0].split(":")[0])) {
        endHour = startHour + 1;
      } else {
        startHour = endHour - 1;
      }
    }

    // Cập nhật filterTakeoffTime với định dạng hh:mm
    setFilterLandingTime([
      startHour.toString().padStart(2, "0") + ":00",
      endHour.toString().padStart(2, "0") + ":00",
    ]);
  };

  const [
    stateButtonSelectDepartureAirport,
    setStateButtonSelectDepartureAirport,
  ] = useState(false);
  const [passengerChooseDeparture, setPassengerChooseDeparture] =
    useState(false);
  const [selectedDepartureAirport, setSelectedDepartureAirport] =
    useState(null);
  const [selectedReturnAirport, setSelectedReturnAirport] = useState(null);

  const hanldeOpenAdjustQuantity_SelectedAirport = async (
    airport,
    typeAirport
  ) => {
    const [day, month, year] = airport?.ngayBay.split("-").map(Number);
    const ngayBay = new Date(year, month - 1, day);

    if (ngayBay <= new Date()) {
      showNotification("Ngày bay phải lớn hơn hiện tại", "Warn");
      return;
    }
    const payment = localStorage.getItem("payment");
    if (payment) {
      showNotification(
        "Bạn có đơn hàng chưa thanh toán, vui lòng xem tại Chi tiết đơn hàng.",
        "Warn"
      );

      return;
    }

    if (typeAirport === "departure" && passengerChooseDeparture) {
      const element = document.getElementById(
        `${selectedDepartureAirport[0]._id}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    if (typeAirport === "cancelDeparture") {
      setSelectedDepartureAirport(null);
      setPassengerChooseDeparture(false);
      setSavedSeatState({
        selectedSeats: new Set(),
        selectedSeatsReturn: new Set(),
        seats: [],
        seatsReturn: [],
      });
      return;
    }
    if (typeAirport === "departure" && !passengerChooseDeparture) {
      const resSoGhe = await mutateGheMaSoGhe.mutateAsync({
        idFlight: airport._id,
      });
      if (resSoGhe.data.message === "Lấy số ghế thành công") {
        setSelectedDepartureAirport([
          airport,
          editQuantityPassenger,
          {
            soGhePhoThong_Booked: resSoGhe.data.maSoGhePhoThong,
            soGheThuongGia_Booked: resSoGhe.data.maSoGheThuongGia,
          },
        ]);
      }
    }
    if (typeAirport === "return") {
      if (!passengerChooseDeparture) {
        const element = document.getElementById("one-way-ticket");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      const resSoGhe = await mutateGheMaSoGhe.mutateAsync({
        idFlight: airport._id,
      });
      if (resSoGhe.data.message === "Lấy số ghế thành công") {
        setSelectedReturnAirport([
          airport,
          editQuantityPassenger,
          {
            soGhePhoThong_Booked: resSoGhe.data.maSoGhePhoThong,
            soGheThuongGia_Booked: resSoGhe.data.maSoGheThuongGia,
          },
        ]);
      }
    }

    setOpenAdjustQuantity(true);
    setHideDetailItemFlight(false);
  };

  const mutateGheMaSoGhe = useMutation({
    mutationFn: GheMaSoGhe,
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi lấy số ghế chuyến bay",
        "Warn"
      );
    },
  });

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      {isShowChatbot && <FuncChatbot />}
      {openAdjustQuantity && (
        <AdjustQuantityv2
          objDeparture={selectedDepartureAirport}
          setSelectedDepartureAirport={setSelectedDepartureAirport}
          objReturn={passengerChooseDeparture ? selectedReturnAirport : null}
          setPassengerChooseDeparture={setPassengerChooseDeparture}
          countDepartureFlights={isFlights.departureFlights.length}
          countReturnFlights={isFlights.returnFlights.length}
        />
      )}
      <div
        onClick={() => {
          setShowOptionSetting_LoginSuccess(false);
          setShowChatbot(false);
        }}
        className={`min-h-full scrollbar-thin flex md:flex-row gap-y-2 flex-col justify-between w-full p-2 md:p-5`}>
        {isShowOptionSetting_LoginSuccess && <LoginSuccess />}

        <div
          className="bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png?tr=q-75')] justify-start md:sticky top-11 lg:top-[80px] bg-center bg-no-repeat bg-cover rounded lg:rounded-md md:overflow-y-auto md:overflow-x-hidden h-fit lg:h-[calc(100vh-100px)] flex flex-col items-center w-full md:w-[40%] lg:w-[37%] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          onClick={() => handleShowAirports([0, 1, 2], [false, false, false])}>
          <ComponentSearchFlight />
          <div className="hidden lg:flex p-5 flex-col justify-start items-start w-full">
            <ComponentFilterRange
              topic="Giờ cất cánh"
              topic_value={`${filterTakeoffTime[0]} - ${filterTakeoffTime[1]}`}
              value={filterTakeoffTime.map((time) =>
                parseInt(time.split(":")[0])
              )}
              handleChangeRange={handleFilterTakeoffTime}
              minRange={0}
              maxRange={24}
            />
            <ComponentFilterRange
              topic="Giờ hạ cánh"
              topic_value={`${filterLandingTime[0]} - ${filterLandingTime[1]}`}
              value={filterLandingTime.map((time) =>
                parseInt(time.split(":")[0])
              )}
              handleChangeRange={handleFilterLadingTime}
              minRange={0}
              maxRange={24}
            />
            <ComponentFilterRange
              topic="Giá"
              topic_value={`${filterPrice} đến 7.599.000 VND/Hành khách`}
              value={Number(filterPrice.replace(/\./g, ""))}
              handleChangeRange={(e) => {
                const formatPrice = Number(e.target.value).toLocaleString(
                  "vi-VN"
                );
                setFilterPrice(formatPrice);
              }}
              minRange={0}
              maxRange={7599000}
            />
          </div>
        </div>

        <div className="rounded lg:rounded-md flex flex-col items-center w-full md:w-[57%] lg:w-[60%] h-fit scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div
            className="hidden sticky md:top-11 lg:top-[80px] z-20 md:flex items-center shadow-lg shadow-blue-500/30 h-fit gap-x-2 w-full rounded lg:rounded-md p-2 bg-white mb-4"
            id="one-way-ticket">
            <button
              type="button"
              onClick={() =>
                handleFilterOneWayTicket({ kindFilter: "IncreasePrice" })
              }
              className={`${
                filterPrice_Increase_Reduce[0]
                  ? "bg-[#109AF4] text-white hover:bg-[#0184d9]"
                  : "text-[#109AF4] hover:bg-blue-50"
              } flex font-medium p-2 rounded-xl border border-[#109AF4] transition-colors duration-200`}>
              Giá
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                handleFilterOneWayTicket({ kindFilter: "ReducePrice" })
              }
              className={`${
                filterPrice_Increase_Reduce[1]
                  ? "bg-[#109AF4] text-white hover:bg-[#0184d9]"
                  : "text-[#109AF4] hover:bg-blue-50"
              } flex font-medium p-2 rounded-xl border border-[#109AF4] transition-colors duration-200`}>
              Giá
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                handleFilterOneWayTicket({ kindFilter: "Airlines" })
              }
              className={`${
                filterAirlines
                  ? "bg-[#109AF4] text-white hover:bg-[#0184d9]"
                  : "text-[#109AF4] hover:bg-blue-50"
              } flex font-medium p-2 rounded-xl border border-[#109AF4] transition-colors duration-200`}>
              Hãng bay
            </button>

            <button
              type="button"
              onClick={() => handleFilterOneWayTicket({ kindFilter: "All" })}
              className={`${
                filterPrice_Increase_Reduce[0] ||
                filterPrice_Increase_Reduce[1] ||
                filterAirlines
                  ? "bg-[#109AF4] text-white hover:bg-[#0184d9]"
                  : "text-[#109AF4] hover:bg-blue-50"
              } absolute right-3 font-medium p-2 rounded-xl border border-[#109AF4] transition-colors duration-200`}>
              Hủy
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <l-bouncy size="40" speed="1.75" color="black" />
            </div>
          ) : (
            <ShowFlight
              departureFlights={isFlights?.departureFlights}
              oneWayTicket={oneWayTicket}
              roundtripTicket={roundtripTicket}
              returnFlights={isFlights?.returnFlights}
              AirportFrom={AirportFrom}
              AirportTo={AirportTo}
              filterPrice={filterPrice}
              Departure_Return_Date={Departure_Return_Date}
              filterTakeoffTime={filterTakeoffTime}
              filterLandingTime={filterLandingTime}
              hanldeOpenAdjustQuantity_SelectedAirport={
                hanldeOpenAdjustQuantity_SelectedAirport
              }
              selectedDepartureAirport={selectedDepartureAirport}
              passengerChooseDeparture={passengerChooseDeparture}
              stateButtonSelectDepartureAirport={
                stateButtonSelectDepartureAirport
              }
              setStateButtonSelectDepartureAirport={
                setStateButtonSelectDepartureAirport
              }
              setHideDetailItemFlight={setHideDetailItemFlight}
              mutateGheMaSoGhe={mutateGheMaSoGhe}
              bayMotChieu={bayMotChieu}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function ShowFlight({
  departureFlights,
  returnFlights,
  AirportFrom,
  AirportTo,
  filterPrice,
  Departure_Return_Date,
  oneWayTicket,
  roundtripTicket,
  filterTakeoffTime,
  filterLandingTime,
  hanldeOpenAdjustQuantity_SelectedAirport,
  selectedDepartureAirport,
  passengerChooseDeparture,
  stateButtonSelectDepartureAirport,
  setStateButtonSelectDepartureAirport,
  setHideDetailItemFlight,
  mutateGheMaSoGhe,
  bayMotChieu,
}) {
  const { showNotification } = useContext(CONTEXT);

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const itemRefs = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const handleClick = useCallback(
    ({ indexF, flight }) => {
      // setHideDetailItemFlight(true);
      setExpandedIndex(expandedIndex === indexF ? null : indexF);
    },
    [expandedIndex]
  );

  return (
    <div className="flex flex-col h-fit w-full mt-[2%]">
      {Array.from({ length: bayMotChieu ? 1 : 2 }).map((_, index) => {
        return index === 0 && oneWayTicket?.length === 0 ? (
          <div className="flex items-center select-none gap-11">
            <img
              alt="nodata"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2020/07/10/1594367281441-5ec1b573d106b7aec243b19efa02ac56.svg?tr=h-96,q-75,w-96"
            />
            <p key={index} className="text-center text-gray-500 h-fit">
              Không có chuyến bay đi nào.
            </p>
          </div>
        ) : (
          <>
            {bayMotChieu === false && index === 1 && (
              <>
                <div
                  key={index}
                  className="flex items-center justify-center mb-3 w-[80%] m-auto"
                  id="round-trip-ticket">
                  <div className="border-t border-gray-400 flex-grow border-dashed"></div>
                  <span className="mx-4 text-[#444] uppercase">khứ hồi</span>
                  <div className="border-t border-gray-400 flex-grow border-dashed"></div>
                </div>
                {!bayMotChieu &&
                  (!roundtripTicket || roundtripTicket?.length === 0) && (
                    <div className="flex items-center select-none gap-11">
                      <img
                        alt="nodata"
                        src="https://ik.imagekit.io/tvlk/image/imageResource/2020/07/10/1594367281441-5ec1b573d106b7aec243b19efa02ac56.svg?tr=h-96,q-75,w-96"
                      />
                      <p
                        key={index}
                        className="text-center text-gray-500 h-fit">
                        Không có chuyến bay khứ hồi nào.
                      </p>
                    </div>
                  )}
              </>
            )}
            {(index === 0
              ? oneWayTicket
              : index === 1 && !bayMotChieu
                ? roundtripTicket
                : []
            )
              .filter((item) => {
                const itemPrice = parseInt(
                  item.gia.replace(" VND", "").replace(/\./g, ""),
                  10
                );
                const formatFilterPrice = filterPrice.replace(/\./g, "");

                return (
                  toMinutes(item.gioBay) >= toMinutes(filterTakeoffTime[0]) &&
                  toMinutes(item.gioBay) <= toMinutes(filterTakeoffTime[1]) &&
                  toMinutes(item.gioDen) >= toMinutes(filterLandingTime[0]) &&
                  toMinutes(item.gioDen) <= toMinutes(filterLandingTime[1]) &&
                  itemPrice >= formatFilterPrice
                );
              })
              .map((flight, indexF) => {
                return (
                  <div className="relative" key={indexF}>
                    <div
                      key={indexF}
                      ref={(el) => (itemRefs.current[indexF] = el)}
                      className={`transition-all duration-300 border-2 mb-3 hover:border-cyan-400 overflow-hidden rounded-md ${
                        expandedIndex ===
                        (index === 0 ? indexF : indexF + "round-trip-ticket")
                          ? "h-fit"
                          : "h-[130px]"
                      }`}
                      onClick={() =>
                        handleClick({
                          indexF:
                            index === 0 ? indexF : indexF + "round-trip-ticket",
                          flight,
                        })
                      }>
                      <ItemFlight
                        hangBay={flight.hangBay}
                        loaiChuyenBay={flight.loaiChuyenBay}
                        gioBay={flight.gioBay}
                        diemBay={flight.diemBay}
                        ngayBay={flight.ngayBay}
                        gioDen={flight.gioDen}
                        diemDen={flight.diemDen}
                        ngayDen={flight.ngayDen}
                        gia={flight.gia}
                        soGheThuongGia={flight.soGheThuongGia}
                        soGhePhoThong={flight.soGhePhoThong}
                        trangThaiChuyenBay={flight.trangThaiChuyenBay}
                        //
                        thoigianBay={calculateDuration(
                          flight.gioBay,
                          flight.gioDen
                        )}
                      />
                    </div>

                    {index === 0 &&
                      (!stateButtonSelectDepartureAirport &&
                      selectedDepartureAirport &&
                      passengerChooseDeparture &&
                      selectedDepartureAirport[0]?._id === flight._id ? (
                        <button
                          id={flight._id}
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className="bg-[#0194F3] tracking-wider right-3 absolute bottom-6 font-mono text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-md lg:rounded-lg text-sm md:text-base"
                          onMouseEnter={() =>
                            setStateButtonSelectDepartureAirport(true)
                          }
                          onMouseLeave={() =>
                            setStateButtonSelectDepartureAirport(false)
                          }
                          onClick={() =>
                            hanldeOpenAdjustQuantity_SelectedAirport(
                              flight,
                              "departure"
                            )
                          }>
                          Đã chọn
                        </button>
                      ) : stateButtonSelectDepartureAirport &&
                        selectedDepartureAirport &&
                        passengerChooseDeparture &&
                        selectedDepartureAirport[0]?._id === flight._id ? (
                        <button
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className="bg-red-600 tracking-wider right-3 absolute bottom-6 font-mono text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-md lg:rounded-lg text-sm md:text-base"
                          onMouseLeave={() =>
                            setStateButtonSelectDepartureAirport(false)
                          }
                          onClick={() =>
                            hanldeOpenAdjustQuantity_SelectedAirport(
                              flight,
                              "cancelDeparture"
                            )
                          }>
                          Hủy chọn
                        </button>
                      ) : (
                        <button
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className={`${passengerChooseDeparture ? "opacity-50" : ""} bg-[#0194F3] tracking-wider right-3 absolute bottom-6 font-mono text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-md lg:rounded-lg text-sm md:text-base`}
                          onClick={() => {
                            if (mutateGheMaSoGhe.isPending) {
                              return;
                            }
                            if (passengerChooseDeparture) {
                              showNotification(
                                "Bạn đã chọn chuyến bay khác",
                                "Warn"
                              );
                              return;
                            }
                            hanldeOpenAdjustQuantity_SelectedAirport(
                              flight,
                              "departure"
                            );
                          }}>
                          {mutateGheMaSoGhe.isPending ? (
                            <l-bouncy size="30" speed="1.75" color="white" />
                          ) : (
                            "Chọn"
                          )}
                        </button>
                      ))}

                    {index === 1 && !bayMotChieu && (
                      <button
                        ref={(el) => (itemRefs.current[indexF] = el)}
                        className={`${!passengerChooseDeparture ? "bg-slate-600" : "bg-[#0194F3]"} tracking-wider right-3 absolute bottom-6 font-mono text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-md lg:rounded-lg text-sm md:text-base`}
                        onClick={() => {
                          if (mutateGheMaSoGhe.isPending) {
                            return;
                          }
                          if (!passengerChooseDeparture) {
                            showNotification(
                              "Bạn chưa chọn chuyến bay đi",
                              "Warn"
                            );
                            return;
                          }
                          hanldeOpenAdjustQuantity_SelectedAirport(
                            flight,
                            "return"
                          );
                        }}>
                        {mutateGheMaSoGhe.isPending ? (
                          <l-bouncy size="30" speed="1.75" color="white" />
                        ) : (
                          "Chọn"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
          </>
        );
      })}
    </div>
  );
}

function ComponentFilterRange({
  topic,
  topic_value,
  value,
  handleChangeRange,
  minRange,
  maxRange,
}) {
  return (
    <div className="mb-5 w-full">
      <div className="text-white font-semibold text-lg flex flex-row justify-between">
        <span>{topic}</span> <span>{topic_value}</span>
      </div>
      <div className="flex justify-center">
        <Box className="w-[80%]">
          <Slider
            value={value}
            onChange={handleChangeRange}
            min={minRange}
            max={maxRange}
            sx={{
              "& .MuiSlider-thumb": {
                color: "white", // Change the thumb color to white
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}

export default memo(XemDanhSachChuyenBay);
