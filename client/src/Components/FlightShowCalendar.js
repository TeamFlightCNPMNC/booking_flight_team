import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "../Components/Utils/authAxios.js";
import { memo, useEffect, useRef, useState } from "react";

function FlightShowCalendar() {
  const FullCalendar_ref = useRef(null);
  const [dataFlightShowCalendar, setDataFlightShowCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
  );

  useEffect(() => {
    const calendarElement = FullCalendar_ref.current?.elRef?.current;

    if (calendarElement && calendarElement.children[1]) {
      calendarElement.children[1].style.height = "400px";
    }
    getFlightShowCalendar({ date: currentMonth });
  }, [FullCalendar_ref, currentMonth]);

  const getFlightShowCalendar = async ({ date }) => {
    try {
      const res = await axios.get(`/flights/show/calendar?date=${date}`);
      if (res.status === 200) {
        const events = res.data.flights?.map((flight) => ({
          title: `${flight.loaiChuyenBay}: ${flight.diemBay}-${flight.diemDen}`,
          date: flight.ngayBay.split("-").reverse().join("-"),
          backgroundColor: "lightblue",
          borderColor: "#000",
          textColor: "black",
        }));

        setDataFlightShowCalendar(events);
      }
    } catch (error) {}
  };

  const handleDatesSet = (dateInfo) => {
    const month = dateInfo.view.currentStart.getMonth() + 1;
    const year = dateInfo.view.currentStart.getFullYear();
    setCurrentMonth(`${month}/${year}`);
  };

  return (
    <div className="w-fit h-fit fixed z-[500] bg-white p-4 transform -translate-x-1/2 -translate-y-1/2 top-[55%] left-1/2 rounded-md">
      <FullCalendar
        ref={FullCalendar_ref}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        locale="vi"
        events={dataFlightShowCalendar}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
      />
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default memo(FlightShowCalendar);
