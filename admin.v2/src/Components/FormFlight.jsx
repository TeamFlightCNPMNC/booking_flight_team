import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Create, Update } from "./API/ChuyenBay";
import { toast } from "react-toastify";
import { useToastOptions } from "./CustomToast";
import { GetWithIDFLight } from "./API/Account";
import CatchErrorAPI from "./CatchErrorAPI";

const AirportsVN = [
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

function FormFlight({ flight, setShowDetailFlight, typeAction }) {
  const queryClient = useQueryClient();

  function convertDateFormat(dateString, formatType) {
    if (formatType === "toSlash") {
      // Chuyển đổi từ dd-mm-yyyy sang mm/dd/yyyy
      return moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else if (formatType === "toDash") {
      // Chuyển đổi từ mm/dd/yyyy sang dd-mm-yyyy
      return moment(dateString, "MM/DD/YYYY").format("DD-MM-YYYY");
    } else {
      return "";
    }
  }

  let items = {};
  if (typeAction === "update") {
    items = {
      idCB: flight._id,
      diemBay: flight.diemBay,
      diemDen: flight.diemDen,
      ngayBay: convertDateFormat(flight.ngayBay, "toSlash"),
      gioBay: flight.gioBay,
      ngayDen: convertDateFormat(flight.ngayDen, "toSlash"),
      gioDen: flight.gioDen,
      hangBay: flight.hangBay,
      loaiChuyenBay: flight.loaiChuyenBay,
      gia: flight.gia?.replace(/\./g, "").replace(" VND", ""),
      soGhePhoThong: flight.soGhePhoThong,
      soGheThuongGia: flight.soGheThuongGia,
    };
  } else if (typeAction === "add") {
    items = {
      diemBay: "",
      diemDen: "",
      ngayBay: "",
      gioBay: "",
      ngayDen: "",
      gioDen: "",
      hangBay: "",
      loaiChuyenBay: "",
      gia: "",
      soGhePhoThong: "",
      soGheThuongGia: "",
    };
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const { ngayBay, gioBay, ngayDen, gioDen } = watch("items");

  const prevNgayDenRef = useRef(ngayDen);

  const [showAirports, setShowAirports] = useState([false, false, false]);
  const [showAirline, setShowAirline] = useState(false);

  const handleShowAirports = (indexs, booleans) => {
    setShowAirports((pre) => {
      const arrStateShowAirports = [...pre];

      indexs.forEach((index, i) => {
        arrStateShowAirports[index] = booleans[i];
      });

      return arrStateShowAirports;
    });
  };

  useEffect(() => {
    if (ngayBay && gioBay && gioDen) {
      setValue("items.ngayDen", ngayBay);
      const timeBay = `${ngayBay} ${gioBay}`;
      const timeDen = `${ngayDen} ${gioDen}`;

      const converTimeBay = moment(timeBay);
      const converTimeDen = moment(timeDen);

      if (converTimeBay.isValid() && converTimeDen.isValid()) {
        const newNgayDen = converTimeBay.isAfter(converTimeDen)
          ? moment(ngayBay).add(1, "days").format("YYYY-MM-DD")
          : moment(ngayBay).format("YYYY-MM-DD");

        // Chỉ cập nhật nếu giá trị mới khác với giá trị trước đó
        if (newNgayDen !== prevNgayDenRef.current) {
          prevNgayDenRef.current = newNgayDen; // Cập nhật giá trị trước đó
          setValue("items.ngayDen", newNgayDen);
        }
      }
    }
  }, [gioBay, gioDen, ngayBay, setValue, prevNgayDenRef]);

  const mutationUpdateFlight = useMutation({
    mutationFn: Update,
    onSuccess: (response) => {
      queryClient.invalidateQueries("flights");
      setShowDetailFlight(null);
      toast.success(
        `Update thành công chuyến bay ${response?.data?.flight._id}`,
        useToastOptions
      );
    },
  });

  const mutationAddFlight = useMutation({
    mutationFn: Create,
    onSuccess: (response) => {
      reset({ items });
      toast.success(
        `${response?.data?.message} với ID: ${response?.data?.flight._id}`,
        useToastOptions
      );
    },
  });

  // Kiem tra chuyen bay da co khach hang dat hay chua
  const mutationCheckFlight = useMutation({
    mutationFn: GetWithIDFLight,
  });

  const submitFormUpdate = async (data) => {
    const response = await mutationCheckFlight.mutateAsync({
      idF: data.items.idCB,
      trangThai: "Đã thanh toán",
    });
    if (response?.data?.length > 0) {
      toast.warning(
        `Cập nhật không thành công. Chuyến bay này đã có ${response?.data?.length} khách hàng thanh toán`,
        useToastOptions
      );
      return;
    }
    await mutationUpdateFlight.mutate(data?.items);
  };

  const submitFormAddFlight = async (data) => {
    await mutationAddFlight.mutate(data?.items);
  };

  const topicUpdate = [
    "Nơi đi",
    "Nơi đến",
    "Ngày bay",
    "Giờ bay",
    "Ngày đến",
    "Giờ đến",
    "Hãng bay",
    "Loại chuyến bay",
    "Giá",
    "Số ghế phổ thông",
    "Số ghế thương gia",
  ];
  const nameRegister = [
    "items.diemBay",
    "items.diemDen",
    "items.ngayBay",
    "items.gioBay",
    "items.ngayDen",
    "items.gioDen",
    "items.hangBay",
    "items.loaiChuyenBay",
    "items.gia",
    "items.soGhePhoThong",
    "items.soGheThuongGia",
  ];

  const cities = [
    "cần thơ",
    "đà nẵng",
    "hải phòng",
    "hà nội",
    "tp.hồ chí minh",
    "huế",
    "nha trang",
    "phú quốc",
    "hạ long",
    "vinh",
    "buôn ma thuột",
    "cà mau",
    "côn đảo",
    "tam kỳ và quảng ngãi",
    "đà lạt",
    "điện biên phủ",
    "đồng hới",
    "pleiku",
    "quy nhơn",
    "rạch giá",
    "tuy hòa",
    "vũng tàu",
    "thanh hóa",
  ];

  const typeInput = [
    "text",
    "text",
    "date",
    "time",
    "date",
    "time",
    "text",
    "text",
    "number",
    "number",
    "number",
  ];
  const Airlines = [
    "VietJet",
    "VNA",
    "Pacific Airlines",
    "BamBoo",
    "Vietravel Airlines",
  ];

  const validationRules = [
    {
      required: "* Nơi đi là bắt buộc",
      validate: {
        validCity: (value) => {
          return (
            cities.includes(value.toLowerCase()) ||
            "* Giá trị phải là một trong các thành phố."
          );
        },
        duplicateCity: (value) => {
          return (
            value !== watch("items.diemDen") ||
            "* Không được trùng với nơi đến."
          );
        },
      },
    },
    {
      required: "* Nơi đến là bắt buộc",
      validate: {
        validCity: (value) => {
          return (
            cities.includes(value.toLowerCase()) ||
            "* Giá trị phải là một trong các thành phố."
          );
        },
        duplicateCity: (value) => {
          return (
            value !== watch("items.diemBay") || "* Không được trùng với nơi đi."
          );
        },
      },
    },
    {
      required: "* Ngày bay là bắt buộc.",
      validate: {
        validYear: (value) => {
          const year = value.split("-")[0];
          if (!/^\d{4}$/.test(year)) {
            return "* Năm không hợp lệ";
          }
          return true;
        },

        validMonth: (value) => {
          const date = moment(value);
          if (!date.isValid()) {
            return "* Ngày không hợp lệ.";
          }
          return true;
        },
        validDate: (value) => {
          const today = moment();
          const date = moment(value);
          return (
            date.isAfter(today) || "* Ngày bay phải hơn ngày hiện tại 1 ngày."
          );
        },
      },
    },
    { required: "* Giờ bay là bắt buộc." },
    {
      required: "* Ngày đến là bắt buộc.",
    },
    {
      required: "* Giờ đến là bắt buộc.",
      validate: {
        validTime: (value) => {
          const gioBay = watch("items.gioBay");
          const ngayBay = watch("items.ngayBay");
          const ngayDen = watch("items.ngayDen");

          if (!gioBay) return true;

          const [hoursBay, minutesBay] = gioBay.split(":").map(Number);
          const [hoursDen, minutesDen] = value.split(":").map(Number);

          const timeDiffMinutes =
            hoursDen * 60 + minutesDen - (hoursBay * 60 + minutesBay);

          const formatNgayBay = moment(ngayBay, "DD-MM-YYYY");
          const formatNgayDen = moment(ngayDen, "DD-MM-YYYY");

          if (timeDiffMinutes < 45 && formatNgayBay.isSame(formatNgayDen)) {
            return "* Thời gian đến phải cách thời gian bay ít nhất 45 phút.";
          }
          return true;
        },
      },
    },
    {
      required: "* Hãng bay là bắt buộc.",
      validate: {
        validAirline: (value) => {
          return (
            Airlines.includes(value) ||
            "* Giá trị phải là một trong các hãng bay."
          );
        },
      },
    },
    {
      required: "* Loại chuyến bay là bắt buộc.",
      validate: {
        validLoaiCB: (value) => {
          const loaiCB = ["Chuyến bay đi", "Chuyến bay khứ hồi"];
          return (
            loaiCB.includes(value.trim()) ||
            "* Giá trị phải là một trong 2 lựa chọn."
          );
        },
      },
    },
    {
      required: "* Giá chuyến bay là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return (
            (regex.test(value) && !value.endsWith(".")) ||
            "* Chỉ nhập số tương ứng với giá tiền"
          );
        },
        validCurrency: (value) => {
          const convertValue = parseInt(value, 10);
          return (
            (convertValue >= 700000 && convertValue <= 7000000) ||
            "Giá tiền nằm trong khoảng 700000 - 7000000"
          );
        },
      },
    },
    {
      required: "* Số ghế phổ thông là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return regex.test(value) || "* Chỉ nhập số";
        },
        validSeats: (value) => {
          const convertValue = parseInt(value, 10);

          return (
            (convertValue >= 100 && convertValue <= 140) ||
            "* Số ghế phổ thông phải trong khoảng 100 - 140"
          );
        },
        validTotalSeats: (value) => {
          const convertValue = parseInt(value, 10);
          const seatBussiness = parseInt(watch("items.soGheThuongGia"), 10);

          return (
            convertValue + seatBussiness === 170 ||
            "* Tổng số ghế thường và thương gia phải 170 ghế."
          );
        },
      },
    },
    {
      required: "* Số ghế thương gia là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return regex.test(value) || "* Chỉ nhập số";
        },
      },
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(
        typeAction === "add" ? submitFormAddFlight : submitFormUpdate
      )}
      onKeyDown={handleKeyDown}
      onClick={() => {
        handleShowAirports([0, 1, 2], [false, false, false]);
        setShowAirline(false);
      }}
    >
      {Array.from({ length: 11 }, (_, i) => {
        return (
          <div className="mb-6 flex gap-x-5 relative" key={i}>
            <p>{topicUpdate[i]}: </p>
            <input
              className={`outline-none bg-transparent border-b ${
                (i === 4 || i === 7) && "cursor-not-allowed"
              }`}
              type={typeInput[i]}
              required
              disabled={i === 4 || i === 7 ? true : false}
              maxLength={i === 2 && 10}
              onClick={(e) => {
                if (i === 0 || i === 1) {
                  e.stopPropagation();
                  handleShowAirports(
                    [0, 1, 2],
                    [true, i === 0 ? true : false, i === 0 ? false : true]
                  );
                }
                if (i === 6) {
                  e.stopPropagation();
                  setShowAirline(true);
                }
              }}
              {...register(nameRegister[i], validationRules[i] || {})}
            />
            {((i === 0 && showAirports[1]) || (i === 1 && showAirports[2])) && (
              <>
                <FilterAirport
                  type={i === 0 ? "diemBay" : "diemDen"}
                  diemBay={watch(`items.diemBay`)}
                  diemDen={watch(`items.diemDen`)}
                  watch={watch}
                  setValue={setValue}
                />
              </>
            )}
            {i === 6 && showAirline && (
              <FilterAirline
                airlines={Airlines}
                watch={watch}
                setValue={setValue}
              />
            )}

            {i === 7 && (
              <>
                <input
                  className="cursor-pointer"
                  type="radio"
                  id="flightOne"
                  name="flightType"
                  value="Chuyến bay đi"
                  checked={watch("items.loaiChuyenBay") === "Chuyến bay đi"}
                  onClick={(e) =>
                    setValue("items.loaiChuyenBay", e.target.value)
                  }
                />
                <label className="cursor-pointer" htmlFor="flightOne">
                  Chuyến bay đi
                </label>
                <span className="mx-1">|</span>
                <input
                  className="cursor-pointer"
                  type="radio"
                  id="flightTwo"
                  name="flightType"
                  value="Chuyến bay khứ hồi"
                  checked={
                    watch("items.loaiChuyenBay") === "Chuyến bay khứ hồi"
                  }
                  onClick={(e) =>
                    setValue("items.loaiChuyenBay", e.target.value)
                  }
                />
                <label className="cursor-pointer" htmlFor="flightTwo">
                  Chuyến bay khứ hồi
                </label>
              </>
            )}
            {i === 8 && <span>VND</span>}
            <span className="">
              {(i === 0 &&
                errors?.items?.diemBay &&
                errors?.items?.diemBay?.message) ||
                (i === 1 &&
                  errors?.items?.diemDen &&
                  errors?.items?.diemDen?.message) ||
                (i === 2 &&
                  errors?.items?.ngayBay &&
                  errors?.items?.ngayBay?.message) ||
                (i === 3 &&
                  errors?.items?.gioBay &&
                  errors?.items?.gioBay?.message) ||
                (i === 4 &&
                  errors?.items?.ngayDen &&
                  errors?.items?.ngayDen?.message) ||
                (i === 5 &&
                  errors?.items?.gioDen &&
                  errors?.items?.gioDen?.message) ||
                (i === 6 &&
                  errors?.items?.hangBay &&
                  errors?.items?.hangBay?.message) ||
                (i === 7 &&
                  errors?.items?.loaiChuyenBay &&
                  errors?.items?.loaiChuyenBay?.message) ||
                (i === 8 &&
                  errors?.items?.gia &&
                  errors?.items?.gia?.message) ||
                (i === 9 &&
                  errors?.items?.soGhePhoThong &&
                  errors?.items?.soGhePhoThong?.message) ||
                (i === 10 &&
                  errors?.items?.soGheThuongGia &&
                  errors?.items?.soGheThuongGia?.message)}
            </span>
          </div>
        );
      })}

      {mutationCheckFlight.isPending ||
      mutationUpdateFlight.isPending ||
      mutationAddFlight.isPending ? (
        <l-bouncy size="45" speed="1.75" color="white" />
      ) : (
        <>
          {mutationUpdateFlight.isError && (
            <CatchErrorAPI error={mutationUpdateFlight.error} />
          )}
          {mutationAddFlight.isError && (
            <CatchErrorAPI error={mutationAddFlight.error} />
          )}
          {mutationCheckFlight.isError && (
            <CatchErrorAPI error={mutationCheckFlight.error} />
          )}
          <button
            className="text-center uppercase tracking-widest w-fit m-auto p-1 rounded-md bg-blue-500"
            type="submit"
          >
            {typeAction === "update" ? "Update chuyến bay" : "Add chuyến bay"}
          </button>
        </>
      )}
    </form>
  );
}

FormFlight.propTypes = {
  flight: PropTypes.object,
  showAirports: PropTypes.object.isRequired,
  handleShowAirports: PropTypes.func.isRequired,
  showAirline: PropTypes.bool.isRequired,
  setShowAirline: PropTypes.func.isRequired,
  setShowDetailFlight: PropTypes.func,
  typeAction: PropTypes.string.isRequired,
};

const FilterAirport = ({ type, watch, setValue }) => {
  const handleChooseAirport = (airport, type) => {
    if (type === "diemBay") {
      setValue("items.diemBay", airport.city);
    }
    if (type === "diemDen") {
      setValue("items.diemDen", airport.city);
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  return (
    <>
      <ul
        className={`bg-black absolute z-10 left-0 top-7
           max-h-44 font-semibold w-fit tracking-wider transition-all duration-1000 overflow-y-auto`}
      >
        {AirportsVN.filter((item) => {
          const searchAirport =
            type === "diemBay"
              ? watch("items.diemBay").toLowerCase().trim()
              : watch("items.diemDen").toLowerCase().trim();
          const city = item.city.toLowerCase();
          const airport = item.airport.toLowerCase();

          return (
            (watch("items.diemBay") && city.includes(searchAirport)) ||
            removeAccents(city).includes(searchAirport) ||
            airport.includes(searchAirport)
          );
        }).map((items) => (
          <li
            className="w-fit h-fit p-2 border-b cursor-pointer whitespace-nowrap"
            key={items.IATA}
            onClick={() => handleChooseAirport(items, type)}
          >
            {items.city + ", " + items.airport}
          </li>
        ))}
      </ul>
    </>
  );
};

FilterAirport.propTypes = {
  type: PropTypes.string.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

const FilterAirline = ({ airlines, watch, setValue }) => {
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleChooseAirline = (airline) => {
    setValue("items.hangBay", airline);
  };

  return (
    <>
      <ul
        className={`bg-black absolute z-10 left-0 top-7
           max-h-44 font-semibold w-fit tracking-wider transition-all duration-1000 overflow-y-auto`}
      >
        {airlines
          .filter((airline_) => {
            const search = watch("items.hangBay").toLowerCase().trim();

            return (
              airline_.includes(search) ||
              removeAccents(airline_.toLowerCase()).includes(search)
            );
          })
          .map((airline, index) => (
            <li
              className="w-fit h-fit p-2 border-b cursor-pointer whitespace-nowrap"
              key={index}
              onClick={() => handleChooseAirline(airline)}
            >
              {airline}
            </li>
          ))}
      </ul>
    </>
  );
};
FilterAirline.propTypes = {
  airlines: PropTypes.array.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default FormFlight;
