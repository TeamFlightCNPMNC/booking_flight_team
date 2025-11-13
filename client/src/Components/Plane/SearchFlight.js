import { CONTEXT } from "../../Context/ContextGlobal.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Lunar } from "lunar-javascript";
import { Info } from "lucide-react";
import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { NotifySheet } from "./AdjustQuantityv2.js";
import { registerLocale } from "react-datepicker";
registerLocale("vi", vi);

export default function ComponentSearchFlight() {
  const {
    handleShowAirports,
    showAirports,
    choosePassenger,
    setChoosePassenger,
    handleInputAirport,
    AirportFrom,
    AirportTo,
    invalid_AirportFrom_AirportTo,
    handleChooseAirport,
    handleSwapPlaceAirport,
    handleEditQuantityPassenger,
    editQuantityPassenger,
    bayMotChieu,
    Departure_Return_Date,
    setDeparture_Return_Date,
    setBayMotChieu,
    existUser,
    setShowInterfaceLogin,
    AirportsVN,
    convertDateToVNDate,
    setInvalid_AirportFrom_AirportTo,
  } = useContext(CONTEXT);
  const navigate = useNavigate();

  // State để lưu trạng thái chuyến bay một chiều hay không, để hiển thị lên UI
  const [oneWayTicket, setOneWayTicket] = useState(bayMotChieu);

  useEffect(() => {
    setOneWayTicket(bayMotChieu);
  }, [bayMotChieu]);

  const handleCheckAllInformationBeforeSearch = ({
    departure,
    arrival,
    dateDeparture,
    dateReturn,
  }) => {
    const check_departure = AirportsVN.some((items) =>
      departure.trim().includes(`${items.city} (${items.IATA})`)
    );

    const check_arrival = AirportsVN.some((items) =>
      arrival.trim().includes(`${items.city} (${items.IATA})`)
    );

    const IATA_departure = departure.match(/\(([^)]+)\)/);
    const IATA_arrival = arrival.match(/\(([^)]+)\)/);

    const Date_departure = convertDateToVNDate(dateDeparture).split(" ")[1];
    const Date_return = convertDateToVNDate(dateReturn).split(" ")[1];
    const [dayDeparture, monthDeparture, yearDeparture] =
      Date_departure.split("/");
    const [dayReturn, monthReturn, yearReturn] = Date_return.split("/");

    const formatDate_departure = `${dayDeparture}-${monthDeparture}-${yearDeparture}`;
    const formatDate_return = `${dayReturn}-${monthReturn}-${yearReturn}`;

    return {
      IATA_departure,
      IATA_arrival,
      formatDate_departure,
      formatDate_return,
      check_departure,
      check_arrival,
    };
  };

  const handleInvalid_AirportFrom_AirportTo = (index, status) => {
    setInvalid_AirportFrom_AirportTo((pre) => {
      return pre.map((item, idx) => {
        if (idx === index) {
          return { ...item, status };
        }
        return item;
      });
    });
  };

  const resultCheck = handleCheckAllInformationBeforeSearch({
    departure: AirportFrom,
    arrival: AirportTo,
    dateDeparture: Departure_Return_Date[0],
    dateReturn: Departure_Return_Date[1],
  });

  const handleSearch = () => {
    if (!existUser) {
      setShowInterfaceLogin(true);
      return;
    }

    if (!resultCheck.check_departure || !resultCheck.check_arrival) {
      handleInvalid_AirportFrom_AirportTo(
        1,
        true,
        setInvalid_AirportFrom_AirportTo
      );
      return;
    }
    if (invalid_AirportFrom_AirportTo[0].status) {
      return;
    }

    if (!AirportFrom || !AirportTo || !resultCheck.formatDate_departure) {
      throw new Error("Missing required search parameters");
    }

    const params = new URLSearchParams({
      departure: AirportFrom,
      arrival: AirportTo,
      departureIATA: resultCheck.IATA_departure[1],
      arrivalIATA: resultCheck.IATA_arrival[1],
      departureDate: resultCheck.formatDate_departure,
      oneWayTicket: oneWayTicket,
      ...(oneWayTicket
        ? {}
        : {
            returnDate: resultCheck.formatDate_return,
          }),
      passengers: editQuantityPassenger,
    }).toString();

    navigate(`/XemDanhSachChuyenBay?${params}`, { replace: true });
  };

  const compareDateSkipTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handlePickDeparture_Return_Date = (date, index) => {
    const date_ = date ?? new Date();

    setDeparture_Return_Date((pre) => {
      const preDeparture_Return_Date = [...pre];

      if (
        index === 0 &&
        compareDateSkipTime(date_).valueOf() >
          compareDateSkipTime(new Date(preDeparture_Return_Date[1])).valueOf()
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      } else if (
        compareDateSkipTime(
          new Date(date_.getTime() + 1 * 24 * 60 * 60 * 1000)
        ).valueOf() ===
          compareDateSkipTime(
            new Date(preDeparture_Return_Date[1])
          ).valueOf() &&
        index === 0
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      } else if (
        compareDateSkipTime(date_).valueOf() ===
          compareDateSkipTime(preDeparture_Return_Date[1]).valueOf() &&
        index === 0
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      }
      preDeparture_Return_Date[index] = date_;

      return preDeparture_Return_Date;
    });
  };

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row flex-wrap md:gap-y-4 gap-y-1 w-full h-fit p-5 items-start lg:items-center justify-center`}>
        <div className="flex-1 relative w-fit">
          <div className="flex items-center gap-x-5 w-fit">
            <span
              className={`font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg`}>
              Nơi đi
            </span>
            <NotifySheet
              content={`Có thể tìm kiếm theo: thành phố, sân bay, IATA. Vui lòng chọn địa điểm từ danh sách đề xuất`}
              icon={<Info size={17} stroke="#0194F3" />}
            />
          </div>
          <div
            className={`absolute -mb-5 text-sm font-semibold text-white transition-all duration-300 transform -translate-x-1/2 bg-gray-700 rounded whitespace-nowrap left-1/2 bottom-full  ${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "w-fit p-2" : "w-0 overflow-hidden"}`}>
            <p>{`${invalid_AirportFrom_AirportTo[0].status ? invalid_AirportFrom_AirportTo[0].noti : invalid_AirportFrom_AirportTo[1].status ? invalid_AirportFrom_AirportTo[1].noti : ""}`}</p>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
          </div>
          <div className="w-fit flex items-center border-[#cdd0d1] border-b gap-x-3 p-2">
            <label htmlFor="Origin">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`stroke-[#0194f3] size-6 lg:size-8 cursor-pointer`}>
                <path
                  d="M3 21H21"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path
                  d="M12 9L15.1924 7.93585C17.317 7.22767 19.6563 7.95843 21 9.75L7.44513 14.0629C5.86627 14.5653 4.1791 13.6926 3.67674 12.1137C3.66772 12.0854 3.65912 12.0569 3.65094 12.0283L3 9.75L5.25 10.875L9 9.75L4.5 3H5.25L12 9Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
              </svg>
            </label>

            <input
              id="Origin"
              type="text"
              placeholder="Tên thành phố, sân bay, IATA"
              className={`h-full text-base text-white lg:text-lg bg-transparent outline-none -tracking-tighter`}
              value={AirportFrom}
              onClick={(e) => {
                e.stopPropagation();
                handleShowAirports([0, 1, 2], [true, true, false]);
              }}
              onChange={(event) => {
                handleInputAirport(event, "From");
              }}
            />
          </div>

          {showAirports[0] && showAirports[1] && (
            <FilterAirport
              showAirports={showAirports}
              Airport={AirportFrom}
              filteredAirports={AirportsVN}
              handleChooseAirport={handleChooseAirport}
              type={"Origin"}
              AirportsVN={AirportsVN}
              AirportFrom={AirportFrom}
              AirportTo={AirportTo}
            />
          )}
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          className={`stroke-[#0194f3] flex-1 size-6 lg:size-8 cursor-pointer m-auto my-4 md:my-0`}
          onClick={handleSwapPlaceAirport}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>

        <div className="w-fit relative flex-1">
          <div className="flex items-center gap-x-3">
            <span
              className={`font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg`}>
              Nơi đến
            </span>
            <NotifySheet
              content={`Có thể tìm kiếm theo: thành phố, sân bay, IATA. Vui lòng chọn địa điểm từ danh sách đề xuất`}
              icon={<Info size={17} stroke="#0194F3" />}
            />
          </div>
          <div
            className={`absolute -mb-5 text-sm font-semibold text-white transition-all duration-300 transform -translate-x-1/2 bg-gray-700 rounded whitespace-nowrap left-1/2 bottom-full  ${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "w-fit p-2" : "w-0 overflow-hidden"}`}>
            <p>{`${invalid_AirportFrom_AirportTo[0].status ? invalid_AirportFrom_AirportTo[0].noti : invalid_AirportFrom_AirportTo[1].status ? invalid_AirportFrom_AirportTo[1].noti : ""}`}</p>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
          </div>
          <div className="flex items-center w-fit p-2 border-[#cdd0d1] border-b gap-x-3">
            <label htmlFor="Destination">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`stroke-[#0194f3] size-6 lg:size-8 cursor-pointer`}>
                <path
                  d="M3 21H21"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path
                  d="M12 9L15.1924 7.93585C17.317 7.22767 19.6563 7.95843 21 9.75L7.44513 14.0629C5.86627 14.5653 4.1791 13.6926 3.67674 12.1137C3.66772 12.0854 3.65912 12.0569 3.65094 12.0283L3 9.75L5.25 10.875L9 9.75L4.5 3H5.25L12 9Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(28 10 10)"></path>
              </svg>
            </label>
            <input
              id="Destination"
              type="text"
              placeholder="Tên thành phố, sân bay, IATA"
              className={`h-full text-base text-white lg:text-lg bg-transparent outline-none -tracking-tighter`}
              value={AirportTo}
              onClick={(e) => {
                e.stopPropagation();
                handleShowAirports([0, 1, 2], [true, false, true]);
              }}
              onChange={(event) => handleInputAirport(event, "To")}
            />
          </div>
          {showAirports[0] && showAirports[2] && (
            <FilterAirport
              showAirports={showAirports}
              Airport={AirportFrom}
              filteredAirports={AirportsVN}
              handleChooseAirport={handleChooseAirport}
              type={"Destination"}
              AirportsVN={AirportsVN}
              AirportFrom={AirportFrom}
              AirportTo={AirportTo}
            />
          )}
        </div>
      </div>

      <div className="p-5 w-full flex flex-col justify-end items-center h-fit">
        <button
          className="w-fit font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg flex items-center gap-x-2"
          onClick={(e) => {
            e.stopPropagation();
            setOneWayTicket(!oneWayTicket);
          }}>
          {oneWayTicket ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              className="stroke-[#0194f3] size-4 md:size-5 lg:size-6 cursor-pointer">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              className="stroke-[#0194f3] size-4 md:size-5 lg:size-6 cursor-pointer">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
          khứ hồi
        </button>
        <div
          className={`flex flex-col md:flex-row md:flex-wrap w-full h-fit items-start gap-5`}>
          <div
            className={`flex flex-col border-[#cdd0d1] border-b gap-x-3 justify-center md:mr-20`}>
            <span
              className={`font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg`}>
              Ngày đi
            </span>
            <div style={{ position: "relative" }}>
              <DatePicker
                selected={Departure_Return_Date[0]}
                onChange={(date) => handlePickDeparture_Return_Date(date, 0)}
                dateFormat={"dd/MM/yyyy"}
                minDate={(() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return tomorrow;
                })()}
                maxDate={new Date("2030-01-01")}
                locale={"vi"}
                renderDayContents={(day, date) => {
                  const lunarDate = Lunar.fromDate(date, 0);
                  return (
                    <span>
                      {day} <br />
                      <small className="" style={{ fontSize: "0.7em" }}>
                        {lunarDate.getDay()}/{lunarDate.getMonth()}
                      </small>
                    </span>
                  );
                }}
                className={`text-center text-base text-white lg:text-lg bg-transparent outline-none -tracking-tighter`}
                portalId="date-picker-portal"
              />
            </div>
          </div>

          <div
            className={`flex flex-col border-[#cdd0d1] border-b gap-x-3 justify-center transition-all duration-700 ease-linear ${oneWayTicket ? "opacity-0 select-none pointer-events-none h-0 w-0" : ""}`}>
            <span
              className={`font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg`}>
              Ngày về
            </span>
            <div style={{ position: "relative" }}>
              <DatePicker
                selected={Departure_Return_Date[1]}
                onChange={(date) => handlePickDeparture_Return_Date(date, 1)}
                dateFormat={"dd/MM/yyyy"}
                minDate={
                  new Date(
                    Departure_Return_Date[0].getTime() + 2 * 24 * 60 * 60 * 1000
                  )
                }
                maxDate={new Date("2030-01-01")}
                locale={"vi"}
                renderDayContents={(day, date) => {
                  const lunarDate = Lunar.fromDate(date);
                  return (
                    <span>
                      {day} <br />
                      <small style={{ fontSize: "0.7em" }}>
                        {lunarDate.getDay()}/{lunarDate.getMonth()}
                      </small>
                    </span>
                  );
                }}
                className={`text-center text-base text-white lg:text-lg bg-transparent outline-none -tracking-tighter`}
                portalId="date-picker-portal"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex gap-5 h-fit w-full p-5 md:items-center flex-wrap justify-between`}>
        <div className={`relative flex items-end gap-x-10 h-fit gap-5`}>
          <div className="flex flex-col h-fit w-fit">
            <span
              className={`font-semibold uppercase text-sm tracking-wider text-white md:text-base lg:text-lg`}>
              Hành khách
            </span>
            <div
              onClick={() => {
                setChoosePassenger(!choosePassenger);
                handleShowAirports([0, 1, 2], [false, false, false]);
              }}
              className="flex items-center text-white border-b cursor-pointer gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className={`stroke-[#0194f3] size-6 lg:size-8 cursor-pointer`}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>

              <span
                className={`h-full text-base text-white lg:text-lg bg-transparent outline-none -tracking-tighter whitespace-normal`}>
                {editQuantityPassenger[0]} Người lớn, {editQuantityPassenger[1]}{" "}
                Trẻ em, {editQuantityPassenger[2]} Em bé
              </span>

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
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
          {choosePassenger && (
            <ul
              className={`absolute p-2 bg-white bottom-full w-fit rounded`}
              onClick={(e) => e.stopPropagation()}>
              <li className="flex text-[#0194f3] gap-x-1 flex-col text-sm lg:text-base md:flex-row font-semibold justify-center md:justify-between mb-2 items-center">
                <span className="select-none whitespace-nowrap">
                  Người lớn (Trên 12 tuổi)
                </span>
                <div className="flex w-fit gap-x-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(0, "Reduce")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="select-none h-fit text-center w-6">
                    {editQuantityPassenger[0]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(0, "Increase")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
              </li>
              <li className="items-center gap-x-1 flex text-[#0194f3] text-sm lg:text-base font-semibold flex-col md:flex-row justify-center md:justify-between mb-2">
                <span className="select-none">Trẻ em (Dưới 12 tuổi)</span>
                <div className="flex w-fit gap-x-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(1, "Reduce")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="select-none h-fit text-center w-6">
                    {editQuantityPassenger[1]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(1, "Increase")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
              </li>
              <li className="items-center gap-x-1 flex text-[#0194f3] text-sm lg:text-base font-semibold flex-col md:flex-row justify-center md:justify-between">
                <span className="select-none">Em bé (Dưới 2 tuổi)</span>
                <div className="flex w-fit gap-x-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(2, "Reduce")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="select-none h-fit text-center w-6">
                    {editQuantityPassenger[2]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="cursor-pointer size-6 lg:size-7"
                    onClick={() => handleEditQuantityPassenger(2, "Increase")}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
              </li>
            </ul>
          )}
        </div>

        <button
          className={`${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "bg-slate-500 cursor-not-allowed" : "bg-[#ff5e1f] cursor-pointer"} p-3 md:p-5 m-auto rounded-2xl border-4 border-[rgba(205,208,209,0.50)] w-fit h-fit`}
          type="button"
          onClick={handleSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="size-6 stroke-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

const FilterAirport = ({
  showAirports,
  filteredAirports,
  handleChooseAirport,
  type,
  AirportFrom,
  AirportTo,
}) => {
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Chuyển đổi sang dạng chuẩn
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu
  };

  return (
    <>
      <ul
        className={`${showAirports[0] && filteredAirports.length !== 0 ? "min-h-0 max-h-60 overflow-y-auto w-full" : "w-0 h-0 overflow-hidden p-0"} absolute z-10 font-semibold bg-white w-fit tracking-wider transition-all duration-700 ease-linear rounded-b-[4px] rounded-bl-[4px]`}>
        {filteredAirports
          .filter((item) => {
            const searchAirport =
              type === "Origin"
                ? AirportFrom.toLowerCase().trim()
                : AirportTo.toLowerCase().trim();
            const city = item.city.toLowerCase();
            const airport = item.airport.toLowerCase();
            const IATA = item.IATA.toLowerCase();
            const city_IATA =
              item.city.toLowerCase() + " (" + item.IATA.toLowerCase() + ")";

            return (
              (AirportFrom && city.includes(searchAirport)) ||
              removeAccents(city).includes(searchAirport) ||
              airport.includes(searchAirport) ||
              IATA.includes(searchAirport) ||
              city_IATA.includes(searchAirport)
            );
          })
          .map((items) => (
            <li
              className="w-full h-full p-2 border-b cursor-pointer hover:bg-slate-100"
              key={items.IATA}
              onClick={() => handleChooseAirport(items, type)}>
              {items.city + ", " + items.airport + " (" + items.IATA + ")"}
            </li>
          ))}
      </ul>
    </>
  );
};
