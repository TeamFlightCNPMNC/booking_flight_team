const express = require("express");
const moment = require("moment");
const router = express.Router();
const Flight = require("../models/Flight.js");

router.get("/search", async (req, res) => {
  try {
    const { date, from, to, type, loaiChuyenBay } = req.query;
    let departureFlights = [];
    let returnFlights = [];

    const AirportVN = [
      {
        city: "Cần Thơ",
        ICAO: "VVCT",
        IATA: "VCA",
        airport: "Can Tho International Airport",
        location: "10°05′07″N 105°42′43″E",
      },
      {
        city: "Đà Nẵng",
        ICAO: "VVDN",
        IATA: "DAD",
        airport: "Da Nang International Airport",
        location: "16°02′38″N 108°11′58″E",
      },
      {
        city: "Hải Phòng",
        ICAO: "VVCI",
        IATA: "HPH",
        airport: "Cat Bi International Airport",
        location: "20°49′09″N 106°43′29″E",
      },
      {
        city: "Hà Nội",
        ICAO: "VVNB",
        IATA: "HAN",
        airport: "Noi Bai International Airport",
        location: "21°13′16″N 105°48′26″E",
      },
      {
        city: "TP.Hồ Chí Minh",
        ICAO: "VVTS",
        IATA: "SGN",
        airport: "Tan Son Nhat International Airport",
        location: "10°49′08″N 106°39′07″E",
      },
      {
        city: "Huế",
        ICAO: "VVPB",
        IATA: "HUI",
        airport: "Phu Bai International Airport",
        location: "16°24′06″N 107°42′10″E",
      },
      {
        city: "Nha Trang",
        ICAO: "VVCR",
        IATA: "CXR",
        airport: "Cam Ranh International Airport",
        location: "11°59′53″N 109°13′10″E",
      },
      {
        city: "Phú Quốc",
        ICAO: "VVPQ",
        IATA: "PQC",
        airport: "Phu Quoc International Airport",
        location: "10°10′18″N 103°59′28″E",
      },
      {
        city: "Hạ Long",
        ICAO: "VVVD",
        IATA: "VDO",
        airport: "Van Don International Airport",
        location: "21°07′04″N 107°24′51″E",
      },
      {
        city: "Vinh",
        ICAO: "VVVH",
        IATA: "VII",
        airport: "Vinh International Airport",
        location: "18°44′12.21″N 105°40′15.17″E",
      },
      {
        city: "Buôn Ma Thuột",
        ICAO: "VVBM",
        IATA: "BMV",
        airport: "Buon Ma Thuot Airport",
        location: "12°40′05″N 108°07′12″E",
      },
      {
        city: "Cà Mau",
        ICAO: "VVCM",
        IATA: "CAH",
        airport: "Ca Mau Airport",
        location: "09°10′32″N 105°10′46″E",
      },
      {
        city: "Côn Đảo",
        ICAO: "VVCS",
        IATA: "VCS",
        airport: "Con Dao Airport",
        location: "08°43′57″N 106°37′44″E",
      },
      {
        city: "Tam Kỳ và Quảng Ngãi",
        ICAO: "VVCA",
        IATA: "VCL",
        airport: "Chu Lai Airport",
        location: "15°24′22″N 108°42′20″E",
      },
      {
        city: "Đà Lạt",
        ICAO: "VVDL",
        IATA: "DLI",
        airport: "Lien Khuong Airport",
        location: "11°45′02″N 108°22′25″E",
      },
      {
        city: "Điện Biên Phủ",
        ICAO: "VVDB",
        IATA: "DIN",
        airport: "Dien Bien Airport",
        location: "21°23′50″N 103°00′28″E",
      },
      {
        city: "Đồng Hới",
        ICAO: "VVDH",
        IATA: "VDH",
        airport: "Dong Hoi Airport",
        location: "17°30′54″N 106°35′26″E",
      },
      {
        city: "Pleiku",
        ICAO: "VVPK",
        IATA: "PXU",
        airport: "Pleiku Airport",
        location: "14°00′16″N 108°01′02″E",
      },
      {
        city: "Quy Nhơn",
        ICAO: "VVPC",
        IATA: "UIH",
        airport: "Phu Cat Airport",
        location: "13°57′18″N 109°02′32″E",
      },
      {
        city: "Rạch Giá",
        ICAO: "VVRG",
        IATA: "VKG",
        airport: "Rach Gia Airport",
        location: "09°57′35″N 105°08′02″E",
      },
      {
        city: "Tuy Hòa",
        ICAO: "VVTH",
        IATA: "TBB",
        airport: "Tuy Hoa Airport",
        location: "13°02′58″N 109°20′01″E",
      },
      {
        city: "Vũng Tàu",
        ICAO: "VVVT",
        IATA: "VTG",
        airport: "Vung Tau Airport",
        location: "10°22′00″N 107°05′00″E",
      },
      {
        city: "Thanh Hóa",
        ICAO: "VVTX",
        IATA: "THD",
        airport: "Tho Xuan Airport",
        location: "19°54′06″N 105°28′04″E",
      },
    ];

    const fromCity = AirportVN.find(
      (airport) => airport.city.toLowerCase() === from?.toLowerCase().trim()
    );
    const toCity = AirportVN.find(
      (airport) => airport.city.toLowerCase() === to?.toLowerCase().trim()
    );

    if (type === "date" && moment(date, "DD-MM-YYYY", true).isValid()) {
      departureFlights = await Flight.find({
        ngayBay: date,
        loaiChuyenBay: "Chuyến bay đi",
      });

      returnFlights = await Flight.find({
        ngayBay: date,
        loaiChuyenBay: "Chuyến bay khứ hồi",
      });
    } else if (type === "city") {
      if (fromCity && toCity) {
        departureFlights = await Flight.find({
          diemBay: fromCity.city,
          diemDen: toCity.city,
          loaiChuyenBay: "Chuyến bay đi",
        });

        returnFlights = await Flight.find({
          diemBay: toCity.city,
          diemDen: fromCity.city,
          loaiChuyenBay: "Chuyến bay khứ hồi",
        });

      } else {
        return res.status(400).json({
          message: "Một hoặc cả hai thành phố không hợp lệ.",
          fromValid: !!fromCity,
          toValid: !!toCity,
        });
      }
    } else if (
      type === "citydate" &&
      fromCity &&
      toCity &&
      moment(date, "DD-MM-YYYY", true).isValid()
    ) {
      departureFlights = await Flight.find({
        ngayBay: date,
        diemBay: fromCity.city,
        diemDen: toCity.city,
        loaiChuyenBay: "Chuyến bay đi",
      });

      returnFlights = await Flight.find({
        ngayBay: date,
        diemBay: fromCity.city,
        diemDen: toCity.city,
        loaiChuyenBay: "Chuyến bay khứ hồi",
      });
    } else if (type === "cityloaicb" && loaiChuyenBay && from && to) {
      if (loaiChuyenBay.toLowerCase() === "chuyến bay đi") {
        departureFlights = await Flight.find({
          diemBay: fromCity.city,
          diemDen: toCity.city,
          loaiChuyenBay: "Chuyến bay đi",
        });
      } else {
        returnFlights = await Flight.find({
          diemBay: fromCity.city,
          diemDen: toCity.city,
          loaiChuyenBay: "Chuyến bay khứ hồi",
        });
      }
    } else if (
      type === "citydateloaicb" &&
      fromCity &&
      toCity &&
      moment(date, "DD-MM-YYYY", true).isValid() &&
      loaiChuyenBay
    ) {
      if (loaiChuyenBay.toLowerCase() === "chuyến bay đi") {
        departureFlights = await Flight.find({
          diemBay: fromCity.city,
          diemDen: toCity.city,
          ngayBay: date,
          loaiChuyenBay: "Chuyến bay đi",
        });
      } else {
        returnFlights = await Flight.find({
          diemBay: fromCity.city,
          diemDen: toCity.city,
          ngayBay: date,
          loaiChuyenBay: "Chuyến bay khứ hồi",
        });
      }
    } else if (type === "dateloaicb" && moment(date, "DD-MM-YYYY", true).isValid() && loaiChuyenBay) {
      if (loaiChuyenBay.toLowerCase() === "chuyến bay đi") {
        departureFlights = await Flight.find({
          ngayBay: date,
          loaiChuyenBay: "Chuyến bay đi",
        });
      } else {
        returnFlights = await Flight.find({
          ngayBay: date,
          loaiChuyenBay: "Chuyến bay khứ hồi",
        });
      }
    }

    const flights = departureFlights.concat(returnFlights);

    if (departureFlights.length <= 0 && returnFlights.length <= 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chuyến bay nào", flights });
    }

    res.status(200).json({
      message: `Chuyến bay đi: ${
        departureFlights.length
      }, Chuyến bay khứ hồi: ${
        returnFlights.length
      }, Tổng chuyến bay tìm được là: ${
        departureFlights.length + returnFlights.length
      }`,
      flights,
    });
    return;
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tìm chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi xem chuyến bay",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
