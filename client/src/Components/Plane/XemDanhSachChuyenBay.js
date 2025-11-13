/* eslint-disable no-unused-vars */
import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  memo,
  useMemo,
} from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "react-slideshow-image/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import AdjustQuantity from "./AdjustQuantity.js";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import Header from "../Header.js";
import ItemFlight from "./ItemFlight.js";
import { LoginSuccess } from "../Setting/StateLoginSucces.js";
import InterFaceLogin from "../Home/InterFaceLogin.js";
import { differenceInMinutes, format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import Loading from "../Loading.js";
import notify from "../Noti/notify.js";
import { ToastContainer } from "react-toastify";
import { authorizedAxiosInstance } from "../Utils/authAxios.js";
import axios from "axios";
import { useLocation, useSearchParams } from "react-router-dom";
import { SearchTicketFlight } from "../Home/Home.js";

function XemDanhSachChuyenBay() {
  const {
    openAdjustQuantity,
    setOpenAdjustQuantity,
    setHideDetailItemFlight,
    isShowInterfaceLogin,
    isShowOptionSetting_LoginSuccess,
    setShowOptionSetting_LoginSuccess,
    handleShowAirports,
    showAirports,
    choosePassenger,
    setChoosePassenger,
    handleInputAirport,
    AirportFrom,
    AirportTo,
    AirportsVN,
    invalid_AirportFrom_AirportTo,
    handleChooseAirport,
    handleSwapPlaceAirport,
    handleEditQuantityPassenger,
    editQuantityPassenger,
    bayMotChieu,
    Departure_Return_Date,
    handlePickDeparture_Return_Date,
    handleCheckAllInformationBeforeSearch,
    convertDateToVNDate,
    handleInvalid_AirportFrom_AirportTo,
    setBayMotChieu,
    setAirportFrom,
    setAirportTo,
    setEditQuantityPassenger,
    setDeparture_Return_Date,
    convertStringToOjectDate,
    handleSearchRealFlight,
    handleReplacePriceAirport,
    naviReload,
  } = useContext(CONTEXT);

  const flight = {
    flightsData: {
      departureFlights: [
        {
          hangBay: "VietJet",
          soHieu: "VJ603",
          loaiMayBay: "321",
          gioBay: "09:25",
          diemBay: "CXR",
          gioDen: "10:30",
          diemDen: "SGN",
          gia: "430,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1341",
          loaiMayBay: "321",
          gioBay: "08:40",
          diemBay: "CXR",
          gioDen: "09:50",
          diemDen: "SGN",
          gia: "789,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "Pacific Airlines",
          soHieu: "VN6151",
          loaiMayBay: "321",
          gioBay: "19:55",
          diemBay: "CXR",
          gioDen: "21:05",
          diemDen: "SGN",
          gia: "1,049,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "BamBoo",
          soHieu: "QH1313",
          loaiMayBay: "321",
          gioBay: "18:40",
          diemBay: "CXR",
          gioDen: "19:45",
          diemDen: "SGN",
          gia: "1,215,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN7351",
          loaiMayBay: "321",
          gioBay: "11:00",
          diemBay: "CXR",
          gioDen: "12:10",
          diemDen: "SGN",
          gia: "1,237,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1345",
          loaiMayBay: "321",
          gioBay: "13:50",
          diemBay: "CXR",
          gioDen: "15:00",
          diemDen: "SGN",
          gia: "1,237,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1347",
          loaiMayBay: "321",
          gioBay: "15:50",
          diemBay: "CXR",
          gioDen: "17:00",
          diemDen: "SGN",
          gia: "3,199,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
      ],
      returnFlights: [
        {
          hangBay: "VietJet",
          soHieu: "VJ604",
          loaiMayBay: "321",
          gioBay: "07:45",
          diemBay: "SGN",
          gioDen: "08:55",
          diemDen: "CXR",
          gia: "90,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "BamBoo",
          soHieu: "QH1312",
          loaiMayBay: "321",
          gioBay: "09:35",
          diemBay: "SGN",
          gioDen: "10:40",
          diemDen: "CXR",
          gia: "299,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1340",
          loaiMayBay: "321",
          gioBay: "06:50",
          diemBay: "SGN",
          gioDen: "08:00",
          diemDen: "CXR",
          gia: "489,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "Pacific Airlines",
          soHieu: "VN6150",
          loaiMayBay: "321",
          gioBay: "18:05",
          diemBay: "SGN",
          gioDen: "19:15",
          diemDen: "CXR",
          gia: "489,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1346",
          loaiMayBay: "321",
          gioBay: "14:05",
          diemBay: "SGN",
          gioDen: "15:10",
          diemDen: "CXR",
          gia: "789,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
        {
          hangBay: "VNA",
          soHieu: "VN1344",
          loaiMayBay: "321",
          gioBay: "12:05",
          diemBay: "SGN",
          gioDen: "13:10",
          diemDen: "CXR",
          gia: "1,049,000 VND",
          ThuongGia: 16,
          PhoThongDacBiet: 0,
          PhoThong: 162,
        },
      ],
    },
  };

  const [searchParams] = useSearchParams();

  const [isLoadingFlight, setIsLoadingFlight] = useState(false);
  const [isFlights, setFlights] = useState(flight.flightsData);

  const callAPIFlightRef = useRef();

  const callAPIFlight = useCallback(
    async ({
      departureIATA,
      arrivalIATA,
      departureDate,
      returnDate,
      passengers,
    }) => {
      try {
        setIsLoadingFlight(true);
        // let urlOneWayTicket = `https://www.etrip4u.com/tim-ve-may-bay/${departureIATA}-${arrivalIATA}-${departureDate}-${passengers[0] + "" + passengers[1] + "" + passengers[2]}`;
        // let urlRoundTripTicket = `https://www.etrip4u.com/tim-ve-may-bay/${departureIATA}-${arrivalIATA}-${departureDate}-${returnDate}-${passengers[0] + "" + passengers[1] + "" + passengers[2]}`;
        // const createAxios = axios.create();
        // createAxios.defaults.timeout = 60000;
        // const response = await createAxios.post(
        //   "https://travrel-server.vercel.app/api/realflight",
        //   {
        //     flightUrl: bayMotChieu ? urlOneWayTicket : urlRoundTripTicket,
        //   }
        // );
        // if (response.status === 200) {
        //   setFlights(response.data.flightsData);
        // }
      } catch (error) {
        notify("Error", "Hệ thống gặp lỗi khi tìm chuyến bay");
      } finally {
        setIsLoadingFlight(false);
      }
    },
    [bayMotChieu]
  );

  callAPIFlightRef.current = callAPIFlight;

  useEffect(() => {
    const departure = searchParams.get("departure");
    const arrival = searchParams.get("arrival");
    const departureIATA = searchParams.get("departureIATA");
    const arrivalIATA = searchParams.get("arrivalIATA");
    const departureDate = searchParams.get("departureDate");
    const oneWayTicket = searchParams.get("oneWayTicket");
    const returnDate = searchParams.get("returnDate");
    const passengers = searchParams.get("passengers");

    setAirportFrom(departure);
    setAirportTo(arrival);
    setEditQuantityPassenger(passengers.split(",").map(Number));
    setDeparture_Return_Date([
      convertStringToOjectDate(departureDate),
      convertStringToOjectDate(returnDate ?? departureDate),
    ]);
    setBayMotChieu(oneWayTicket === "true");

    callAPIFlightRef.current({
      departureIATA,
      arrivalIATA,
      departureDate,
      returnDate,
      passengers: passengers.split(",").map(Number),
    });
  }, [
    setDeparture_Return_Date,
    searchParams,
    setAirportFrom,
    setAirportTo,
    setEditQuantityPassenger,
    convertStringToOjectDate,
    setBayMotChieu,
  ]);

  const handleDefaultFilter = () => {
    setFilterPrice(Number(500000).toLocaleString("vi-VN"));
    setFilterTakeoffTime(["00:00", "24:00"]);
    setFilterLandingTime(["00:00", "24:00"]);
  };

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
      const departureFlights = [...isFlights.departureFlights];
      const returnFlights = [...isFlights.returnFlights];

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

  const hanldeOpenAdjustQuantity_SelectedAirport = (airport, typeAirport) => {
    const payment = localStorage.getItem("payment");
    if (payment) {
      notify(
        "Warn",
        "Bạn vui lòng thanh toán đơn hàng trong lịch sử đặt trước khi chọn chuyến bay khác, mã đơn hàng chưa thanh toán: " +
          payment.split(" ")[0]
      );
      return;
    }

    if (typeAirport === "departure" && passengerChooseDeparture) {
      const element = document.getElementById(
        `${selectedDepartureAirport[0].soHieu}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    if (typeAirport === "cancelDeparture") {
      setSelectedDepartureAirport(null);
      setPassengerChooseDeparture(false);
      return;
    }
    if (typeAirport === "departure" && !passengerChooseDeparture) {
      setSelectedDepartureAirport([airport, editQuantityPassenger]);
    }
    if (typeAirport === "return") {
      if (!passengerChooseDeparture) {
        const element = document.getElementById("one-way-ticket");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      setSelectedReturnAirport([airport, editQuantityPassenger]);
    }

    setOpenAdjustQuantity(true);
    setHideDetailItemFlight(false);
  };

  return (
    <>
      {isShowInterfaceLogin && <InterFaceLogin />}
      {openAdjustQuantity && (
        <AdjustQuantity
          objDeparture={selectedDepartureAirport}
          setSelectedDepartureAirport={setSelectedDepartureAirport}
          objReturn={passengerChooseDeparture ? selectedReturnAirport : null}
          setPassengerChooseDeparture={setPassengerChooseDeparture}
          setStateButtonSelectDepartureAirport={
            setStateButtonSelectDepartureAirport
          }
        />
      )}
      <Header />
      <ToastContainer />
      <div
        onClick={() => setShowOptionSetting_LoginSuccess(false)}
        className={`bg-slate-100 relative w-full h-full ${isLoadingFlight ? "animate-pulse select-none pointer-events-none" : ""}`}
      >
        {isShowOptionSetting_LoginSuccess && <LoginSuccess />}

        <div className="flex justify-around w-full h-full py-4">
          <div className="sticky z-0 top-[87px] h-[500px] flex flex-col items-center w-[32%] overflow-y-scroll px-3">
            <div className="w-full">
              <div className="flex gap-x-5 mb-5">
                <button
                  className={`transition-colors duration-0 font-semibold text-lg cursor-pointer p-2 rounded-lg line-clamp-2 text-white ${parseInt(filterTakeoffTime[0].split(":")) !== 0 || parseInt(filterTakeoffTime[1].split(":")) !== 24 || parseInt(filterLandingTime[0].split(":")) !== 0 || parseInt(filterLandingTime[1].split(":")) !== 24 || filterPrice !== Number(500000).toLocaleString("vi-VN") ? "bg-[#0194f3] duration-500" : "bg-neutral-500 duration-500"}`}
                  onClick={handleDefaultFilter}
                >
                  Đặt lại lựa chọn
                </button>
                <button
                  className="text-[#0194f3] font-semibold text-lg cursor-pointer bg-white p-2 rounded-lg line-clamp-2"
                  onClick={() => {
                    const element = document.getElementById("one-way-ticket");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Chuyến bay một chiều ({isFlights.departureFlights.length})
                </button>
                {!bayMotChieu && (
                  <button
                    className="text-[#0194f3] font-semibold text-lg cursor-pointer bg-white p-2 rounded-lg line-clamp-2"
                    onClick={() => {
                      const element =
                        document.getElementById("round-trip-ticket");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Chuyến bay khứ hồi ({isFlights.returnFlights.length})
                  </button>
                )}
              </div>

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

              {/* <div className="flex flex-col items-start mb-5">
                <span className="text-lg font-semibold">Hãng máy bay</span>
                <div className="flex gap-3">
                  <input type="checkbox" id="airlineAll" />
                  <label htmlFor="airlineAll">Tất cả</label>
                </div>
                <div className="flex gap-3">
                  <input type="checkbox" id="airlineBamboo" />
                  <label htmlFor="airlineBamboo">BamBoo Airways</label>
                </div>
                <div className="flex gap-3">
                  <input type="checkbox" id="airlineVN" />
                  <label htmlFor="airlineVN">Vietnam Airlines</label>
                </div>
                <div className="flex gap-3">
                  <input type="checkbox" id="VietjetAir" />
                  <label htmlFor="VietjetAir">VietjetAir</label>
                </div>
                <div className="flex gap-3">
                  <input type="checkbox" id="PacificAirlines" />
                  <label htmlFor="PacificAirlines">Pacific Airlines</label>
                </div>
              </div> */}

              <ComponentFilterRange
                topic="Giá"
                topic_value={`${filterPrice} đến 7.599.000/Hành khách`}
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

          <div className="flex flex-col items-center w-[65%] h-full">
            <div
              className="relative flex items-center justify-center w-full h-fit"
              onClick={() =>
                handleShowAirports([0, 1, 2], [false, false, false])
              }
            >
              <svg
                viewBox="0 0 672 185"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform scale-x-[-1]"
              >
                <path
                  d="M672 20c0-11.046-8.954-20-20-20H20C8.954 0 0 8.954 0 20v92.139c0 10.408 7.983 19.076 18.355 19.932l632 52.143c11.655.962 21.645-8.238 21.645-19.932V20Z"
                  fill="#007CE8"
                ></path>
                <mask
                  id="a"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="669"
                  height="137"
                  className="custom-mask"
                >
                  <path
                    d="M0 9.846C0 4.408 4.408 0 9.846 0h639.109c12.166 0 21.514 10.77 19.801 22.815l-.668 4.698c-9.345 65.723-67.73 113.161-133.974 108.855L91.608 107.602C40.08 104.253 0 61.482 0 9.846Z"
                    fill="#007CE8"
                  ></path>
                </mask>
                <g mask="url(#a)">
                  <path
                    d="M394.274 240.769c56.942-8.607 131.375-19.858 190.987-31.654C638.51 198.577 672 151.355 672 97.073V18c0-74.006-59.994-134-134-134H122C47.994-116-12-56.006-12 18v134.052c0 92.044 90.826 156.837 180.049 134.223 74.288-18.828 149.646-33.931 226.225-45.506Z"
                    fill="#1870C9"
                  ></path>
                  <path
                    d="M-127-301.319s111.381 69.475 209.934 146.083c52.883 41.156 161.504 107.483 175.94 176.688 19.846 87.361-94.025 175.741-161.296 220.019L.11 308.018-127-301.319Z"
                    fill="#29A5FE"
                  ></path>
                </g>
              </svg>

              <svg
                viewBox="0 0 187 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[30%] transform translate-x-0 absolute top-2 right-[13.5%] opacity-30"
              >
                <path
                  d="M25.895 35.042s127.02 13.23 147.81 3.56c0 0 4.51-5.78 3.58-7.15-1.33-1.96-4.63-1.95-4.63-1.95l9.54-28.62s-6.04-.97-8.21-.87h-.02c-.35.01-.6.05-.7.14-.02.02-.06.05-.12.1l-.01.01c-.74.64-4.09 3.66-8.08 7.25-7.05 6.34-16.05 14.47-16.05 14.47-11.61-.95-117.87-9.68-117.87-9.68s-10.18-1.3-17.55 1.85c-1.35.58-2.6 1.3-3.68 2.2 0 0-1.33.3-3.02.82-2.67.83-6.26 2.2-6.8 3.73-.89 2.51 5.07 12.22 25.81 14.14Z"
                  fill="#85D6FF"
                ></path>
                <path
                  d="M143.555 42.102c14.03-.18 25.16-1.18 30.15-3.5 0 0 4.51-5.78 3.58-7.15-1.33-1.96-4.63-1.95-4.63-1.95l9.54-28.62s-8.21-1.32-8.93-.73c-.02.02-.06.05-.12.1l-.01.01c-3.08 8.74-11.39 27.41-29.58 41.84Z"
                  fill="#1BA0E2"
                ></path>
                <path
                  d="M5.922 28.932c4.06 2.71 10.46 5.23 19.96 6.11 0 0 62.55 6.52 107.05 7.05"
                  stroke="#0194F3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M43.793 24.492c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.1 1.08.72 2.04 1.8 2.12ZM54.085 25.342l2.57.21c.37.03.71-.25.74-.62l.36-4.39a.69.69 0 0 0-.62-.74l-2.57-.21a.69.69 0 0 0-.74.62l-.36 4.39c-.04.38.24.71.62.74ZM66.932 26.402c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.09 1.07.72 2.03 1.8 2.12ZM78.51 27.352c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.09 1.07.72 2.03 1.8 2.12ZM90.08 28.302c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.09 1.07.72 2.03 1.8 2.12ZM101.651 29.252c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.09 1.07.72 2.03 1.8 2.12ZM113.237 30.202c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83c-.09 1.07.72 2.03 1.8 2.12ZM124.799 31.152c1.08.09 2.04-.72 2.12-1.8l.15-1.83c.09-1.08-.72-2.04-1.8-2.12-1.08-.09-2.04.72-2.12 1.8l-.15 1.83a1.97 1.97 0 0 0 1.8 2.12ZM19.074 14.592l-2.91 3.34 2.38.2 3.32-3.31-2.79-.23ZM13.577 14.142c-1.25.58-3.17 1.31-4.18 2.22 0 0-2.35.74-3.92 1.27l8.35.11 2.91-3.34M30.122 26.662c1.64.13 3.07-1.08 3.21-2.72l.42-5.16a2.978 2.978 0 0 0-2.72-3.21 2.978 2.978 0 0 0-3.21 2.72l-.42 5.16a2.966 2.966 0 0 0 2.72 3.21ZM133.465 35.152c1.64.13 3.07-1.08 3.21-2.72l.42-5.16a2.978 2.978 0 0 0-2.72-3.21 2.978 2.978 0 0 0-3.21 2.72l-.42 5.16a2.966 2.966 0 0 0 2.72 3.21ZM81.048 47.912l1.95.16c1.53.13 2.96-1.35 3.09-2.93l-.09.3c.13-1.58-1-2.95-2.53-3.08l-1.95-.16c-1.53-.13-2.87 1.05-3 2.62-.13 1.58 1 2.96 2.53 3.09ZM59.432 39.602l-.57 6.94c-.13 1.54.99 2.9 2.48 3.02l2.42-.02c-.95-.5-1.55-1.55-1.46-2.72l.57-6.94c.1-1.17.86-2.11 1.88-2.45l-2.39-.41c-1.48-.12-2.8 1.03-2.93 2.58Z"
                  fill="#1870C9"
                ></path>
                <path
                  d="m62.87 39.882-.57 6.93c-.13 1.54.99 2.9 2.48 3.02l1.78-.02 7.08-.05 6.21-.05c1.5.12 2.81-1.03 2.94-2.57l.35-4.25c.13-1.54-.98-2.89-2.48-3.01l-6.12-1.06-6.98-1.21-1.76-.31c-1.48-.11-2.8 1.04-2.93 2.58Z"
                  fill="#85D6FF"
                ></path>
                <path
                  d="m67.57 37.622-1 12.2 7.08-.05.9-10.95-6.98-1.2Z"
                  fill="#BDE9FF"
                ></path>
                <path
                  d="m65.785 42.072 32.47 2.67c1.22.1 2.3-.81 2.4-2.03l.48-5.8a.856.856 0 0 0-.79-.93l-33.83-2.78a.856.856 0 0 0-.93.79l-.59 7.15c-.04.47.32.89.79.93Z"
                  fill="#1BA0E2"
                ></path>
                <path
                  d="m160.207 32.972 24.05 1.98c.84.07 1.58-.56 1.65-1.4l.26-3.19a.163.163 0 0 0-.16-.18l-25.41-2.09a.163.163 0 0 0-.18.16l-.37 4.55c0 .08.07.16.16.17Z"
                  fill="#1870C9"
                ></path>
              </svg>

              <div className="absolute z-10 w-full h-fit rounded-3xl top-3">
                <SearchTicketFlight
                  div1="mb-7 px-3"
                  span="text-[15px] text-white"
                  svgStroke="stroke-white size-6"
                  div2_1="w-[13%]"
                  div2="w-fit"
                  handleSearchRealFlight={handleSearchRealFlight}
                />
              </div>
            </div>

            <div
              className="relative flex items-center shadow-2xl shadow-blue-500/50 h-[55px] gap-x-2 w-full rounded-xl p-2 bg-white"
              id="one-way-ticket"
            >
              <button
                type="button"
                onClick={() =>
                  handleFilterOneWayTicket({ kindFilter: "IncreasePrice" })
                }
                className={`${filterPrice_Increase_Reduce[0] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} flex  font-medium p-2 rounded-xl border border-[#109AF4]`}
              >
                Giá
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
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
                className={`${filterPrice_Increase_Reduce[1] ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} flex font-medium p-2 rounded-xl border border-[#109AF4]`}
              >
                Giá
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
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
                className={`${filterAirlines ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} flex font-medium p-2 rounded-xl border border-[#109AF4]`}
              >
                Hãng bay
              </button>

              <button
                type="button"
                onClick={() => handleFilterOneWayTicket({ kindFilter: "All" })}
                className={`${filterPrice_Increase_Reduce[0] || filterPrice_Increase_Reduce[1] || filterAirlines ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} absolute right-3 font-medium p-2 rounded-xl border border-[#109AF4]`}
              >
                Hủy
              </button>
            </div>

            {isLoadingFlight ? (
              <span className="text-lg font-semibold text-[#0194f3] p-5">
                Đang tìm kiếm chuyến bay...
              </span>
            ) : (
              <ShowFlight
                departureFlights={isFlights.departureFlights}
                oneWayTicket={oneWayTicket}
                roundtripTicket={roundtripTicket}
                returnFlights={isFlights.returnFlights}
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
              />
            )}
          </div>
        </div>
      </div>
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
}) {
  const {
    handleChooseOpenHangVe,
    naviReload,
    convertDateToVNDate,
    bayMotChieu,
  } = useContext(CONTEXT);

  const calculateDuration = (start, end) => {
    const startDate = parse(start, "HH:mm", new Date());
    const endDate = parse(end, "HH:mm", new Date());

    const diffInMinutes = differenceInMinutes(endDate, startDate);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours} giờ ${minutes} phút`;
  };

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

  const [loadingGetOrderPeding, setLoadingGetOrderPeding] = useState(false);

  // const funcGetOrderPeding_ = async () => {

  //   try {
  //     setLoadingGetOrderPeding(true);
  //     const req = await authorizedAxiosInstance.post(
  //       "https://travrel-server.vercel.app/order/get_pending",
  //       {
  //         orderID: storage.split(" ")[1],
  //         flightID: storage.split(" ")[2],
  //       }
  //     );
  //     if (req.status === 200) {
  //       if (req.data.trangThai === "Đã hủy") {
  //         notify("Warn", `Đơn hàng ${orderID} đã bị hủy, vui lòng thử lại.`);
  //         localStorage.removeItem("payment");
  //         return;
  //       }

  //       const timeEnd = convertDateToVNDate(req.data.end);

  //       const data = {
  //         timeEndPayOrder: timeEnd,
  //         objectOrder: {
  //           priceOrder: req.data.price,
  //           dataTickets: req.data.tickets,
  //           dataFlight: req.data.flight,
  //           idDH: req.data.orderID,
  //         },
  //       };
  //       naviReload("/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan", {
  //         state: {
  //           data: data,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     if (error.response.status === 404) {
  //       if (error.response.data.message === "Account") {
  //         notify("Error", `Tài khoản không tồn tại`);
  //         return;
  //       }
  //       if (error.response.data.message === "Order") {
  //         notify("Warn", `Đơn hàng ${orderID} đã bị xóa`);
  //         return;
  //       }
  //       if (error.response.data.message === "Tickets") {
  //         notify("Warn", `Không có vé nào trong đơn hàng ${orderID}`);
  //         return;
  //       }
  //       if (error.response.data.message === "Flight") {
  //         notify("Warn", `Không có chuyến bay nào thuộc đơn hàng ${orderID}`);
  //         return;
  //       }
  //     } else {
  //       notify("Error", "Lỗi hệ thống");
  //       return;
  //     }
  //   } finally {
  //     setLoadingGetOrderPeding(false);
  //   }
  // };

  if (loadingGetOrderPeding) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col h-fit w-full mt-[2%]">
      {Array.from({ length: bayMotChieu ? 1 : 2 }).map((_, index) => {
        return oneWayTicket.length === 0 ||
          (roundtripTicket.length === 0 && !bayMotChieu) ? (
          <span
            id="one-way-ticket"
            className="p-5 text-lg font-semibold border-b border-[#444] w-[80%] m-auto text-rose-500 text-center border-dashed"
          >
            Không còn chuyến bay `${index === 0 ? " một chiều " : " khứ hồi "}`
            nào trong ngày
          </span>
        ) : (
          <>
            {index === 1 && !bayMotChieu && (
              <div
                className="flex items-center justify-center mb-3 w-[80%] m-auto"
                id="round-trip-ticket"
              >
                <div className="border-t border-gray-400 flex-grow border-dashed"></div>
                <span className="mx-4 text-[#444] uppercase">khứ hồi</span>
                <div className="border-t border-gray-400 flex-grow border-dashed"></div>
              </div>
            )}
            {(index === 0
              ? oneWayTicket
              : index === 1 && !bayMotChieu
                ? roundtripTicket
                : []
            )
              .filter((item) => {
                const itemPrice = parseInt(
                  item.gia.replace(" VND", "").replace(/,/g, ""),
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
                      }
                    >
                      <ItemFlight
                        hangBay={flight.hangBay}
                        soHieu={flight.soHieu}
                        loaiMayBay={flight.loaiMayBay}
                        gioBay={flight.gioBay}
                        diemBay={flight.diemBay}
                        gioDen={flight.gioDen}
                        diemDen={flight.diemDen}
                        gia={flight.gia}
                        ThuongGia={flight.ThuongGia}
                        PhoThong={flight.PhoThong}
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
                      selectedDepartureAirport[0]?.soHieu === flight.soHieu ? (
                        <button
                          id={flight.soHieu}
                          key={flight.gioBay + "" + flight.gioDen}
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className="bg-[#0194F3] right-3 absolute bottom-6 text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-lg"
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
                          }
                        >
                          Đã chọn
                        </button>
                      ) : stateButtonSelectDepartureAirport &&
                        selectedDepartureAirport &&
                        passengerChooseDeparture &&
                        selectedDepartureAirport[0]?.soHieu ===
                          flight.soHieu ? (
                        <button
                          key={flight.gioBay + "" + flight.gioDen}
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className="bg-red-600 right-3 absolute bottom-6 text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-lg"
                          onMouseLeave={() =>
                            setStateButtonSelectDepartureAirport(false)
                          }
                          onClick={() =>
                            hanldeOpenAdjustQuantity_SelectedAirport(
                              flight,
                              "cancelDeparture"
                            )
                          }
                        >
                          Hủy chọn
                        </button>
                      ) : (
                        <button
                          key={flight.gioBay + "" + flight.gioDen}
                          ref={(el) => (itemRefs.current[indexF] = el)}
                          className={`${passengerChooseDeparture ? "opacity-50" : ""} bg-[#0194F3] right-3 absolute bottom-6 text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-lg`}
                          onClick={() => {
                            hanldeOpenAdjustQuantity_SelectedAirport(
                              flight,
                              "departure"
                            );
                          }}
                        >
                          {passengerChooseDeparture
                            ? "Bạn đã chọn chuyến bay khác"
                            : "Chọn"}
                        </button>
                      ))}

                    {index === 1 && !bayMotChieu && (
                      <button
                        key={flight.gioBay + "" + flight.gioDen}
                        ref={(el) => (itemRefs.current[indexF] = el)}
                        className={`${!passengerChooseDeparture ? "bg-slate-600" : "bg-[#0194F3]"} right-3 absolute bottom-6 text-white w-fit h-fit px-[8px] py-[4px] md:px-[20px] md:py-[7px] mt-[30px] rounded-lg`}
                        onClick={() =>
                          hanldeOpenAdjustQuantity_SelectedAirport(
                            flight,
                            "return"
                          )
                        }
                      >
                        {!passengerChooseDeparture
                          ? "Bạn chưa chọn chuyến bay đi"
                          : "Chọn"}
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

function Function_Loc_Flight(
  pra,
  {
    isFlights,
    isLoadingFlight,
    isStateDate_Tre,
    isStateDate_Som,
    isStatePrice_Cao_to_Thap,
    isStatePrice_Thap_to_Cao,
  }
) {
  let isFlights_Before_5DateDi = [];
  let isPrice_Thap_to_Cao_Fight = [];
  let isPrice_Cao_to_Thap_Fight = [];
  let isDate_Som_to_Tre_Fight = [];
  let isDate_Tre_to_Som_Fight = [];

  if (!isLoadingFlight) {
    isFlights_Before_5DateDi = isFlights.filter((flight) => {
      const flightDate = new Date(flight.dateDi);
      const khoang_cach_2_ngay = flightDate.getTime() - new Date().getTime();
      const date = Math.ceil(khoang_cach_2_ngay / (1000 * 60 * 60 * 24));
      return date >= 5 && flightDate > new Date();
    });

    //! sort theo giá vé thấp đến cao
    if (pra === "isPrice_Thap_to_Cao_Fight") {
      isPrice_Thap_to_Cao_Fight = isFlights_Before_5DateDi.sort(
        (flight, flight_) => flight.giaVeGoc - flight_.giaVeGoc
      );

      // const flight_Price_Lowest = sortFlights[0].giaVeGoc;
      // isLoc_Price_Fight = isFlights_Before_5DateDi.filter(
      //   (flight) => flight.giaVeGoc === flight_Price_Lowest
      // );

      //! add DateDi
      if (isStateDate_Tre) {
        isPrice_Thap_to_Cao_Fight = isPrice_Thap_to_Cao_Fight.sort(
          (flight, flight_) =>
            new Date(flight_.dateDi).getTime() -
            new Date(flight.dateDi).getTime()
        );
      }
    }

    //! sort theo giá vé cao đến thấp
    if (pra === "isPrice_Cao_to_Thap_Fight" && isPrice_Cao_to_Thap_Fight) {
      isPrice_Cao_to_Thap_Fight = isFlights_Before_5DateDi.sort(
        (flight, flight_) => flight_.giaVeGoc - flight.giaVeGoc
      );

      // const flight_Price_Lowest = sortFlights[0].giaVeGoc;
      // isLoc_Price_Fight = isFlights_Before_5DateDi.filter(
      //   (flight) => flight.giaVeGoc === flight_Price_Lowest
      // );
    }

    //! sort theo ngày bay sớm nhất
    if (pra === "isDate_Som_to_Tre_Fight") {
      isDate_Som_to_Tre_Fight = isFlights_Before_5DateDi.sort(
        (flight, flight_) =>
          new Date(flight.dateDi).getTime() - new Date(flight_.dateDi).getTime()
      );
      // const flight_date_lowest = sortDateFlight[0].dateDi;
      // let convert_date = new Date(flight_date_lowest);
      // isLoc_DateDi_Fight = isFlights_Before_5DateDi.filter(
      //   (flight) => new Date(flight.dateDi).getTime() === convert_date.getTime()
      // );
    }
    //! sort theo ngày bay trễ nhất
    if (pra === "isDate_Tre_to_Som_Fight") {
      isDate_Tre_to_Som_Fight = isFlights_Before_5DateDi.sort(
        (flight, flight_) =>
          new Date(flight_.dateDi).getTime() - new Date(flight.dateDi).getTime()
      );
      // const flight_date_lowest = sortDateFlight[0].dateDi;
      // let convert_date = new Date(flight_date_lowest);
      // isLoc_DateDi_Fight = isFlights_Before_5DateDi.filter(
      //   (flight) => new Date(flight.dateDi).getTime() === convert_date.getTime()
      // );
    }
  }
  if (pra === "isPrice_Thap_to_Cao_Fight") {
    return isPrice_Thap_to_Cao_Fight;
  }
  if (pra === "isPrice_Cao_to_Thap_Fight") {
    return isPrice_Cao_to_Thap_Fight;
  }
  if (pra === "isDate_Som_to_Tre_Fight") {
    return isDate_Som_to_Tre_Fight;
  }
  if (pra === "isDate_Tre_to_Som_Fight") {
    return isDate_Tre_to_Som_Fight;
  }
  if (pra === "All") {
    return isFlights_Before_5DateDi;
  }
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
    <div className="mb-5">
      <div className="text-[#031218] font-semibold text-lg flex flex-row justify-between">
        <span>{topic}</span>
        <span>{topic_value}</span>
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
