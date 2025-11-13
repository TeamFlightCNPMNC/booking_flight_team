import moment from "moment";
import axios from "../Utils/authAxios.js";
//
class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  handleWorldHandler = () => {
    const message = this.createChatBotMessage("Hello. I'm Fruit");
    this.setChatbotMessage(message);
  };

  sendMessage = (m) => {
    const message = this.createChatBotMessage(m);
    this.setChatbotMessage(message);
  };

  handleError = (errorMessage) => {
    const message = this.createChatBotMessage(errorMessage);
    this.setChatbotMessage(message);
  };

  fetchFlights = async (date, city, loaiChuyenBay, type) => {
    try {
      let res;
      if (type === "date") {
        res = await axios.get(`/bot/flights/search/?date=${date}&type=${type}`);
      } else if (type === "city") {
        res = await axios.get(
          `/bot/flights/search/?from=${city?.from}&to=${city?.to}&type=${type}`
        );
      } else if (type === "citydate") {
        res = await axios.get(
          `/bot/flights/search/?from=${city?.from}&to=${city?.to}&date=${date}&type=${type}`
        );
      } else if (type === "cityloaicb") {
        res = await axios.get(
          `/bot/flights/search/?from=${city?.from}&to=${city?.to}&loaiChuyenBay=${loaiChuyenBay}&type=${type}`
        );
      } else if (type === "citydateloaicb") {
        res = await axios.get(
          `/bot/flights/search/?from=${city?.from}&to=${city?.to}&date=${date}&loaiChuyenBay=${loaiChuyenBay}&type=${type}`
        );
      } else if (type === "dateloaicb") {
        res = await axios.get(
          `/bot/flights/search/?date=${date}&loaiChuyenBay=${loaiChuyenBay}&type=${type}`
        );
      }

      const flights = res?.data?.flights || [];
      this.setState((state) => ({
        ...state,
        flights: flights,
      }));
      if (flights.length > 0) {
        const message = this.createChatBotMessage(
          `Đang tìm chuyến bay ${type === "date" ? `vào ngày ${date}` : type === "city" ? `từ ${city.from} đến ${city.to}` : type === "citydate" ? `từ ${city.from} đến ${city.to} vào ngày ${date}` : type === "cityloaicb" ? `từ ${city.from} đến ${city.to} ${loaiChuyenBay}` : type === "citydateloaicb" ? `từ ${city.from} đến ${city.to} vào ngày ${date} ${loaiChuyenBay}` : type === "dateloaicb" ? `vào ngày ${date} ${loaiChuyenBay}` : "..."}`,
          {
            widget: "flights",
            payload: { flights },
          }
        );
        this.setChatbotMessage(message);
      }
    } catch (error) {
      if (error?.message === "Network Error") {
        this.handleError("Connect server fail");
      } else {
        this.handleError(error?.response?.data.message || "Đã xảy ra lỗi.");
      }
      return;
    }
  };

  flightsHandler = (m, type) => {
    const message_split = m.split("bay")[1];
    const date = this.extractDate(m);
    const city = this.extractCities(m);
    const loaiChuyenBay = this.checkFlightType(m);

    if (
      city.from &&
      city.to &&
      moment(date, "DD-MM-YYYY", true).isValid() &&
      loaiChuyenBay
    ) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));

      this.fetchFlights(date, city, loaiChuyenBay, "citydateloaicb");
    } else if (
      city.from &&
      city.to &&
      moment(date, "DD-MM-YYYY", true).isValid()
    ) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        fights: "",
      }));

      this.fetchFlights(date, city, "", "citydate");
    } else if (moment(date, "DD-MM-YYYY", true).isValid() && loaiChuyenBay) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));
      this.fetchFlights(date, "", loaiChuyenBay, "dateloaicb");
    } else if (city.from && city.to && loaiChuyenBay) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));

      this.fetchFlights("", city, loaiChuyenBay, "cityloaicb");
    } else if (message_split.includes("ngày mai")) {
      const tomorrow = moment().add(1, "days");
      const formattedDate = tomorrow.format("DD-MM-YYYY");

      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type, flights: "" }]
            : state.messages,
        // lastMessage: formattedDate,
      }));

      this.fetchFlights(formattedDate, "", "", "date");
    } else if (moment(date, "DD-MM-YYYY", true).isValid()) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));

      this.fetchFlights(date, "", "", "date");
    } else if (city.from && city.to) {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));

      this.fetchFlights("", city, "", "city");
    } else {
      this.setState((state) => ({
        ...state,
        messages:
          type === "user"
            ? [...state.messages, { message: m, type: type }]
            : state.messages,
        // lastMessage: date,
      }));
      const message = this.createChatBotMessage(`Cú pháp không hợp lệ.`);
      this.setChatbotMessage(message);
    }
  };

  extractDate = (text) => {
    const currentYear = new Date().getFullYear();

    // Regex tìm ngày có thể là DD-MM-YYYY, DD-MM hoặc DD-M
    const regex =
      /\b(0[1-9]|[12][0-9]|3[01]|[1-9])-(0[1-9]|1[0-2]|[1-9])(-\d{4})?\b/g;
    const matches = text.match(regex);
    if (!matches) return false;
    return matches.map((date) => {
      const parts = date.split("-");
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts.length === 3 ? parts[2] : currentYear;

      return `${day}-${month}-${year}`;
    })[0];
  };

  extractCities = (text) => {
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

    const normalizedInput = text.toLowerCase();
    const parts = normalizedInput.split(/ đến | - /);
    if (parts.length !== 2) {
      return { from: null, to: null };
    }

    const normalize = (name) =>
      name
        .toLowerCase()
        .replace(/^tp[.\s]/gi, "")
        .trim();

    const fromCityName = normalize(parts[0].trim());
    const toCityName = normalize(parts[1].trim());

    const fromCity = AirportVN.find((airport) =>
      fromCityName.includes(normalize(airport.city))
    );
    const toCity = AirportVN.find((airport) =>
      toCityName.includes(normalize(airport.city))
    );

    return {
      from: fromCity ? fromCity.city : null,
      to: toCity ? toCity.city : null,
    };
  };

  checkFlightType = (text) => {
    const loaiChuyenBay = ["Chuyến bay đi", "Chuyến bay khứ hồi"];
    const normalizedText = text.toLowerCase();

    for (const type of loaiChuyenBay) {
      if (normalizedText.includes(type.toLowerCase())) {
        return type;
      }
    }

    return null;
  };

  showOptions = () => {
    const message = this.createChatBotMessage(
      "Thông tin bạn nhập không hợp lệ. Bạn muốn làm gì tiếp theo?",
      {
        widget: "options", // Tên widget hiển thị lựa chọn
      }
    );
    this.setChatbotMessage(message);
  };

  supportHandler = () => {
    const message = this.createChatBotMessage("Bạn cần hỗ trợ gì?", {
      widget: "options", // Tạo một widget hỗ trợ nếu cần
    });
    this.setChatbotMessage(message);
  };
  userManualHandler = () => {
    const message = this.createChatBotMessage("Những câu bạn có thể hỏi: ", {
      widget: "usermanual",
    });
    this.setChatbotMessage(message);
  };

  goBack = () => {
    const message = this.createChatBotMessage("Bạn đã quay lại menu chính.");
    this.setChatbotMessage(message);
  };

  setChatbotMessage = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  };
}

export default ActionProvider;
