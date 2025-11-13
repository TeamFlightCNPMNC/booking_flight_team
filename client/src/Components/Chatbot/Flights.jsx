import React from "react";

const Flights = ({ payload }) => {
  const flights = payload?.flights || [];

  const renderFlights = () => {
    return (
      <div>
        <p className="text-sm text-rose-600 font-semibold">
          [Loại chuyến bay] [nơi đi-nơi đến] - [ngày bay] - [giờ bay]
        </p>
        {flights.map((flight) => {
          return (
            <li className="border-b mb-3" key={flight._id}>
              {`${flight.loaiChuyenBay} ${flight.diemBay} - ${flight.diemDen} ${flight.ngayBay} ${flight.gioBay}`}
            </li>
          );
        })}
      </div>
    );
  };

  return <div>{renderFlights()}</div>;
};

export default Flights;
