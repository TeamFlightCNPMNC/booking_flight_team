import { useEffect, useContext, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { CONTEXT } from "../../Context/ContextGlobal.js";
import {
  User,
  Baby,
  ArrowBigUpDash,
  ArrowBigDownDash,
  BookCopy,
  Info,
  SquareX,
  Armchair,
  Banknote,
  TextCursorInput,
  SquareArrowLeft,
  SquareArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ItemFlight from "./ItemFlight.js";
import { Create as CreateOrder } from "../../API/DonHang.js";
import { calculateDuration } from "../Utils/tinhThoiGianBay.js";

function AdjustQuantityv2({
  objDeparture,
  setSelectedDepartureAirport,
  setPassengerChooseDeparture,
  objReturn,
  countDepartureFlights,
  countReturnFlights,
}) {
  const {
    showNotification,
    handleReplacePriceAirport,
    convertDateToVNDate,
    naviReload,
    bayMotChieu,
    setBayMotChieu,
    setHideDetailItemFlight,
    setOpenAdjustQuantity,
    savedSeatState,
    setSavedSeatState,
  } = useContext(CONTEXT);

  const generateSeats = ({
    totalBusinessSeats,
    totalEconomySeats,
    bookedSeats,
  }) => {
    const seats = [];
    const maxSeatsPerRow = 6; // Số ghế tối đa mỗi hàng (3 ghế mỗi bên)
    const seatsPerSide = maxSeatsPerRow / 2; // Số ghế mỗi bên (3 ghế)

    // Tính số hàng cho mỗi loại ghế
    const businessRows = Math.ceil(totalBusinessSeats / maxSeatsPerRow);
    const economyRows = Math.ceil(totalEconomySeats / maxSeatsPerRow);
    const totalRows = businessRows + economyRows;

    let businessSeatCount = 0;
    let economySeatCount = 0;

    // Tạo tất cả các hàng ghế
    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      const isBusinessClass = row < businessRows;

      // Tạo ghế bên trái
      for (let col = 0; col < seatsPerSide; col++) {
        if (isBusinessClass && businessSeatCount < totalBusinessSeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGheThuongGia_Booked?.includes(seatId) || false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGhePhoThong_Booked?.includes(seatId) || false,
            type: "economy",
            passengerType: null,
          });
          economySeatCount++;
        } else {
          rowSeats.push(null);
        }
      }

      // Thêm lối đi ở giữa
      rowSeats.push(null);

      // Tạo ghế bên phải
      for (let col = 0; col < seatsPerSide; col++) {
        if (isBusinessClass && businessSeatCount < totalBusinessSeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGheThuongGia_Booked?.includes(seatId) || false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGhePhoThong_Booked?.includes(seatId) || false,
            type: "economy",
            passengerType: null,
          });
          economySeatCount++;
        } else {
          rowSeats.push(null);
        }
      }
      seats.push(rowSeats);
    }

    return seats;
  };

  const [seats, setSeats] = useState([]);
  const [seatsReturn, setSeatsReturn] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState(new Set());
  const [clickedSeat, setClickedSeat] = useState(null);
  const [clickedSeatReturn, setClickedSeatReturn] = useState(null);
  const [showPassengerInfo, setShowPassengerInfo] = useState(false);
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState([]);
  const [selectedSeatsReturnInfo, setSelectedSeatsReturnInfo] = useState([]);

  useEffect(() => {
    setSeats(
      generateSeats({
        totalEconomySeats: objDeparture?.[0]?.soGhePhoThong || 0,
        totalBusinessSeats: objDeparture?.[0]?.soGheThuongGia || 0,
        bookedSeats: objDeparture?.[2],
      })
    );

    setSeatsReturn(
      generateSeats({
        totalEconomySeats: objReturn?.[0]?.soGhePhoThong || 0,
        totalBusinessSeats: objReturn?.[0]?.soGheThuongGia || 0,
        bookedSeats: objReturn?.[2],
      })
    );
  }, [objDeparture, objReturn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedSeat && !event.target.closest(".seat-container")) {
        setClickedSeat(null);
      }
      if (clickedSeatReturn && !event.target.closest(".seat-container")) {
        setClickedSeatReturn(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedSeat, clickedSeatReturn]);

  useEffect(() => {
    // Khôi phục trạng thái ghế đã lưu khi component được mount
    if (savedSeatState.selectedSeats.size > 0) {
      setSelectedSeats(savedSeatState.selectedSeats);
      setSeats(savedSeatState.seats);
    }
    if (savedSeatState.selectedSeatsReturn.size > 0) {
      setSelectedSeatsReturn(savedSeatState.selectedSeatsReturn);
      setSeatsReturn(savedSeatState.seatsReturn);
    }
  }, []);

  const handlePassengerTypeSelect = (
    rowIdx,
    colIdx,
    type,
    passengerCount,
    typeFlight
  ) => {
    let newSeats = [...seats];
    let newSelectedSeats = new Set(selectedSeats);

    if (typeFlight === "return") {
      newSeats = [...seatsReturn];
      newSelectedSeats = new Set(selectedSeatsReturn);
    }

    const seat = newSeats[rowIdx][colIdx];
    if (seat) {
      const seatId = seat.id;

      const adultCount = passengerCount?.[0];
      const childCount = passengerCount?.[1];

      // Đếm số lượng người lớn và trẻ em đã chọn
      const currentAdultCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return newSeats[row][col]?.passengerType === "adult";
      }).length;

      const currentChildCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return newSeats[row][col]?.passengerType === "child";
      }).length;

      // Hàm kiểm tra xem có thể thêm trẻ em vào vị trí này không
      const canAddChild = (row, col) => {
        const rowSeats = newSeats[row];
        const currentSeat = rowSeats[col];

        // Kiểm tra xem vị trí hiện tại có phải là ô null không
        if (currentSeat === null) return false;

        // Lấy các ghế kề bên
        const leftSeat = col > 0 ? rowSeats[col - 1] : null;
        const rightSeat = col < rowSeats.length - 1 ? rowSeats[col + 1] : null;

        // Kiểm tra các trường hợp hợp lệ
        const isValidPosition = () => {
          // Kiểm tra bên trái
          if (leftSeat) {
            // Nếu bên trái là người lớn
            if (leftSeat.passengerType === "adult") {
              return true;
            }
            // Nếu bên trái là trẻ em và bên trái nữa là người lớn
            if (
              leftSeat.passengerType === "child" &&
              col > 1 &&
              rowSeats[col - 2]?.passengerType === "adult"
            ) {
              return true;
            }
          }

          // Kiểm tra bên phải
          if (rightSeat) {
            // Nếu bên phải là người lớn
            if (rightSeat.passengerType === "adult") {
              return true;
            }
            // Nếu bên phải là trẻ em và bên phải nữa là người lớn
            if (
              rightSeat.passengerType === "child" &&
              col < rowSeats.length - 2 &&
              rowSeats[col + 2]?.passengerType === "adult"
            ) {
              return true;
            }
          }

          return false;
        };

        return isValidPosition();
      };

      // Thêm hàm này vào trong handlePassengerTypeSelect, trước khi xử lý các trường hợp type
      const cancelSeatAndRelatedChildren = (row, col) => {
        setShowPassengerInfo(false);
        const seatToCancel = newSeats[row][col];
        if (seatToCancel) {
          // Hủy ghế hiện tại
          newSelectedSeats.delete(seatToCancel.id);
          newSeats[row][col] = {
            ...seatToCancel,
            booked: false,
            passengerType: null,
          };

          const rowSeats = newSeats[row];

          if (seatToCancel.passengerType === "adult") {
            // Nếu là ghế người lớn, kiểm tra và hủy các ghế trẻ em liên quan

            // Kiểm tra ghế bên trái
            if (col > 0 && rowSeats[col - 1]?.passengerType === "child") {
              // Hủy ghế trẻ em bên trái
              newSelectedSeats.delete(rowSeats[col - 1].id);
              newSeats[row][col - 1] = {
                ...rowSeats[col - 1],
                booked: false,
                passengerType: null,
              };

              // Kiểm tra ghế bên trái nữa (nếu có trẻ em ngồi cách 1 ô)
              if (col > 1 && rowSeats[col - 2]?.passengerType === "child") {
                newSelectedSeats.delete(rowSeats[col - 2].id);
                newSeats[row][col - 2] = {
                  ...rowSeats[col - 2],
                  booked: false,
                  passengerType: null,
                };
              }
            }

            // Kiểm tra ghế bên phải
            if (
              col < rowSeats.length - 1 &&
              rowSeats[col + 1]?.passengerType === "child"
            ) {
              // Hủy ghế trẻ em bên phải
              newSelectedSeats.delete(rowSeats[col + 1].id);
              newSeats[row][col + 1] = {
                ...rowSeats[col + 1],
                booked: false,
                passengerType: null,
              };

              // Kiểm tra ghế bên phải nữa (nếu có trẻ em ngồi cách 1 ô)
              if (
                col < rowSeats.length - 2 &&
                rowSeats[col + 2]?.passengerType === "child"
              ) {
                newSelectedSeats.delete(rowSeats[col + 2].id);
                newSeats[row][col + 2] = {
                  ...rowSeats[col + 2],
                  booked: false,
                  passengerType: null,
                };
              }
            }
          } else if (seatToCancel.passengerType === "child") {
            // Nếu là ghế trẻ em, kiểm tra xem có phải là trẻ em ngồi cách người lớn 1 ô không
            const isChildOneSeatAway = () => {
              // Kiểm tra bên trái
              if (col > 1 && rowSeats[col - 2]?.passengerType === "adult") {
                return true;
              }
              // Kiểm tra bên phải
              if (
                col < rowSeats.length - 2 &&
                rowSeats[col + 2]?.passengerType === "adult"
              ) {
                return true;
              }
              return false;
            };

            // Nếu là trẻ em ngồi cách người lớn 1 ô, chỉ hủy ghế hiện tại
            if (isChildOneSeatAway()) {
              return;
            }

            // Nếu không phải trẻ em ngồi cách người lớn 1 ô, kiểm tra và hủy các ghế trẻ em liên quan
            // Kiểm tra ghế bên trái
            if (col > 0 && rowSeats[col - 1]?.passengerType === "child") {
              newSelectedSeats.delete(rowSeats[col - 1].id);
              newSeats[row][col - 1] = {
                ...rowSeats[col - 1],
                booked: false,
                passengerType: null,
              };
            }

            // Kiểm tra ghế bên phải
            if (
              col < rowSeats.length - 1 &&
              rowSeats[col + 1]?.passengerType === "child"
            ) {
              newSelectedSeats.delete(rowSeats[col + 1].id);
              newSeats[row][col + 1] = {
                ...rowSeats[col + 1],
                booked: false,
                passengerType: null,
              };
            }
          }
        }
      };

      if (type === "adult") {
        // Kiểm tra số lượng người lớn
        if (currentAdultCount >= adultCount && !newSelectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng người lớn", "Warn");
          return;
        }

        // Cập nhật trạng thái ghế
        if (newSelectedSeats.has(seatId)) {
          // Hủy chọn ghế người lớn và các ghế trẻ em liên quan
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        } else {
          // Chọn ghế cho người lớn
          newSelectedSeats.add(seatId);
          newSeats[rowIdx][colIdx] = {
            ...seat,
            booked: true,
            passengerType: "adult",
            price: handleCalculatePrice({
              passengerType: "adult",
              seatType: seat.type,
              price:
                typeFlight === "return"
                  ? objReturn[0].gia
                  : objDeparture[0].gia,
            }),
          };
        }
      } else if (type === "child") {
        // Kiểm tra số lượng trẻ em
        if (currentChildCount >= childCount && !newSelectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng trẻ em", "Warn");
          return;
        }

        // Kiểm tra xem có thể thêm trẻ em vào vị trí này không
        if (!canAddChild(rowIdx, colIdx)) {
          showNotification("Không thể thêm trẻ em vào vị trí này", "Warn");
          return;
        }

        // Cập nhật trạng thái ghế
        if (newSelectedSeats.has(seatId)) {
          // Hủy chọn ghế trẻ em và các ghế trẻ em liên quan
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        } else {
          // Chọn ghế cho trẻ em
          newSelectedSeats.add(seatId);
          newSeats[rowIdx][colIdx] = {
            ...seat,
            booked: true,
            passengerType: "child",
            price: handleCalculatePrice({
              passengerType: "child",
              seatType: seat.type,
              price:
                typeFlight === "return"
                  ? objReturn[0].gia
                  : objDeparture[0].gia,
            }),
          };
        }
      } else {
        // Hủy chọn ghế
        if (newSelectedSeats.has(seatId)) {
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        }
      }

      if (typeFlight === "return") {
        setSelectedSeatsReturn(newSelectedSeats);
        setSeatsReturn(newSeats);
      } else {
        setSelectedSeats(newSelectedSeats);
        setSeats(newSeats);
      }
    }
  };

  const findSeatPosition = (seatId) => {
    for (let row = 0; row < seats.length; row++) {
      for (let col = 0; col < seats[row].length; col++) {
        if (seats[row][col]?.id === seatId) {
          return [row, col];
        }
      }
    }
    return [-1, -1];
  };

  const stypeChooseSeat = [
    {
      color: "bg-green-300",
      name: "PT",
    },
    {
      color: "bg-yellow-300",
      name: "TG",
    },
    {
      color: "bg-red-500",
      name: "Đã đặt",
    },
  ];

  const elementCroll = ["departure-flight", "return-flight"];

  const handleCalculatePrice = ({ passengerType, seatType, price }) => {
    if (passengerType === "adult") {
      if (seatType === "business") {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 1.5)
          ) + " VND"
        );
      } else {
        return objDeparture[0].gia;
      }
    } else if (passengerType === "child") {
      if (seatType === "business") {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 0.75 * 1.5)
          ) + " VND"
        );
      } else {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 0.75)
          ) + " VND"
        );
      }
    }
  };

  const checkChooseSeat = () => {
    const adultSeatsCount = Array.from(selectedSeats).filter((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      return seats[row]?.[col]?.passengerType === "adult";
    }).length;

    const childSeatsCount = Array.from(selectedSeats).filter((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      return seats[row]?.[col]?.passengerType === "child";
    }).length;

    const passengerCount = objDeparture?.[1];
    const passengerCountReturn = objReturn?.[1];

    // Kiểm tra số lượng ghế đã chọn
    if (adultSeatsCount < passengerCount[0]) {
      showNotification(
        `${passengerCount[0] - adultSeatsCount} hành khách người lớn chưa chọn ghế`,
        "Warn"
      );
      return false;
    }

    if (childSeatsCount < passengerCount[1]) {
      showNotification(
        `${passengerCount[1] - childSeatsCount} hành khách trẻ em chưa chọn ghế`,
        "Warn"
      );
      return false;
    }

    if (objReturn?.[1]) {
      const adultSeatsCountReturn = Array.from(selectedSeatsReturn).filter(
        (seatId) => {
          const [row, col] = findSeatPosition(seatId);
          return seatsReturn[row]?.[col]?.passengerType === "adult";
        }
      ).length;

      const childSeatsCountReturn = Array.from(selectedSeatsReturn).filter(
        (seatId) => {
          const [row, col] = findSeatPosition(seatId);
          return seatsReturn[row]?.[col]?.passengerType === "child";
        }
      ).length;

      if (adultSeatsCountReturn < passengerCountReturn[0]) {
        showNotification(
          `${passengerCountReturn[0] - adultSeatsCountReturn} hành khách người lớn của chuyến bay khứ hồi chưa chọn ghế`,
          "Warn"
        );
        return false;
      }

      if (childSeatsCountReturn < passengerCountReturn[1]) {
        showNotification(
          `${passengerCountReturn[1] - childSeatsCountReturn} hành khách trẻ em của chuyến bay khứ hồi chưa chọn ghế`,
          "Warn"
        );
        return false;
      }
    }
    return true;
  };

  const handleShowPassengerInfo = () => {
    if (checkChooseSeat()) {
      // Lưu thông tin ghế đã chọn cho chuyến bay đi
      const departureSeatsInfo = Array.from(selectedSeats).map((seatId) => {
        const [row, col] = findSeatPosition(seatId);
        const seat = seats[row][col];
        return {
          seatId: seat.id,
          passengerType: seat.passengerType,
          seatType: seat.type,
          price: handleCalculatePrice({
            passengerType: seat.passengerType,
            seatType: seat.type,
            price: objDeparture[0].gia,
          }),
        };
      });
      setSelectedSeatsInfo(departureSeatsInfo);

      // Lưu thông tin ghế đã chọn cho chuyến bay về (nếu có)
      if (objReturn) {
        const returnSeatsInfo = Array.from(selectedSeatsReturn).map(
          (seatId) => {
            const [row, col] = findSeatPosition(seatId);
            const seat = seatsReturn[row][col];
            return {
              seatId: seat.id,
              passengerType: seat.passengerType,
              seatType: seat.type,
              price: handleCalculatePrice({
                passengerType: seat.passengerType,
                seatType: seat.type,
                price: objReturn[0].gia,
              }),
            };
          }
        );
        setSelectedSeatsReturnInfo(returnSeatsInfo);
      }

      // Nếu đã chọn đủ số ghế, hiển thị form nhập thông tin
      setShowPassengerInfo(!showPassengerInfo);
    }
  };

  // Thêm hàm tính tổng tiền
  const calculateTotalPrice = (type) => {
    let total = 0;
    Array.from(
      type === "departure" ? selectedSeats : selectedSeatsReturn
    ).forEach((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      const seat = (type === "departure" ? seats : seatsReturn)[row]?.[col];
      if (seat) {
        const price = handleReplacePriceAirport(
          type === "departure" ? objDeparture[0].gia : objReturn[0].gia
        );
        if (seat.passengerType === "adult") {
          if (seat.type === "business") {
            total += Math.floor(price * 1.5);
          } else {
            total += price;
          }
        } else if (seat.passengerType === "child") {
          if (seat.type === "business") {
            total += Math.floor(price * 0.75 * 1.5);
          } else {
            total += Math.floor(price * 0.75);
          }
        }
      }
    });
    return new Intl.NumberFormat("vi-VN").format(total) + " VND";
  };

  const chooseFlightReturn = () => {
    if (checkChooseSeat()) {
      // Lưu trạng thái ghế vào context trước khi đóng component
      setSavedSeatState({
        selectedSeats: selectedSeats,
        selectedSeatsReturn: selectedSeatsReturn,
        seats: seats,
        seatsReturn: seatsReturn,
      });

      setPassengerChooseDeparture(true);
      setOpenAdjustQuantity(false);
      setHideDetailItemFlight(true);
    }
  };

  const navBar = [
    {
      icon: <TextCursorInput size={16} />,
      name: "Nhập thông tin",
      id: "box-information-passenger",
    },
    {
      icon: <Armchair size={16} />,
      name: "Chọn ghế",
      id: "box-choose-seat",
    },
    {
      icon: <Banknote size={16} />,
      name: "Thông tin đặt chỗ",
      id: "box-information-booking",
    },
  ];

  const [isShowNavBar, setIsShowNavBar] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-7 left-1/2 flex z-[102] w-fit h-fit -translate-x-1/2 gap-x-3 items-center transition-all duration-500 ease-linear">
        <div
          className={`w-fit h-fit p-1 md:p-2 gap-x-2 md:gap-x-3 backdrop-blur-3xl shadow-zinc-900 shadow-md rounded-lg flex flex-col md:flex-row transition-all duration-500 ease-linear
      ${isShowNavBar ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-3 pointer-events-none"}`}
        >
          {navBar.map((item, index) => {
            if (!showPassengerInfo && item.id === "box-information-passenger") {
              return;
            }
            return (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  const element = document?.getElementById(item?.id);
                  element?.scrollIntoView({ behavior: "smooth" });
                  setIsShowNavBar(false);
                }}
              >
                {item.icon}
                <span className="text-sm md:text-base font-mono whitespace-nowrap tracking-wider">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-1 backdrop-blur-3xl rounded">
          {!isShowNavBar ? (
            <SquareArrowLeft
              className="cursor-pointer size-6 md:size-7 stroke-2 stroke-[#ff5e1f]"
              onClick={() => setIsShowNavBar(true)}
            />
          ) : (
            <SquareArrowRight
              className="cursor-pointer size-7 stroke-2 stroke-[#ff5e1f]"
              onClick={() => setIsShowNavBar(false)}
            />
          )}
        </div>
      </div>

      <div className="font-mono overflow-x-auto fixed inset-0 z-[101] flex stroke-blue-500 lg:justify-start justify-between p-3 md:p-5 gap-5 w-full h-full bg-white/10 backdrop-brightness-75">
        <AnimatePresence>
          {showPassengerInfo && (
            <motion.div
              id="box-information-passenger"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white rounded-md min-w-fit"
            >
              <div className="rounded-scrollbar h-full">
                <div className="p-5 text-center  ">
                  <h2 className="text-xl font-bold uppercase">
                    Thông tin hành khách
                  </h2>

                  <ComponentInputInformationPassenger
                    airportDeparture={objDeparture[0]}
                    airportReturn={objReturn?.[0]}
                    oneWayFlight={false}
                    selectedSeatsInfo={selectedSeatsInfo}
                    selectedSeatsReturnInfo={selectedSeatsReturnInfo}
                    convertDateToVNDate={convertDateToVNDate}
                    naviReload={naviReload}
                    handleReplacePriceAirport={handleReplacePriceAirport}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="h-full min-w-fit bg-white overflow-hidden rounded-md"
          id="box-choose-seat"
        >
          <div className="rounded-scrollbar h-full flex-col flex">
            {objReturn && (
              <div className="sticky top-1/2 left-1/2 z-[500] transform -translate-y-1/2 -translate-x-1/2 flex flex-col w-fit h-0">
                {Array.from({ length: elementCroll.length }, (_, i) => (
                  <>
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const elements = document.getElementsByClassName(
                          elementCroll[i]
                        );
                        if (elements.length > 0) {
                          // Scroll to each element with a small delay between them
                          Array.from(elements).forEach((element, index) => {
                            setTimeout(() => {
                              element.scrollIntoView({ behavior: "smooth" });
                            }, index * 500); // 500ms delay between each scroll
                          });
                        }
                      }}
                      className="h-fit w-fit p-2 rounded-full transition-colors duration-200 hover:bg-black/10 active:bg-black/20"
                    >
                      {i === 0 ? (
                        <NotifySheet
                          content={`Di chuyển đến chuyến bay đi`}
                          icon={<ArrowBigUpDash size={20} />}
                        />
                      ) : (
                        <NotifySheet
                          content={`Di chuyển đến chuyến bay khứ hồi`}
                          icon={<ArrowBigDownDash size={20} />}
                        />
                      )}
                    </motion.button>
                  </>
                ))}
              </div>
            )}
            <div className="relative h-full flex-1">
              <div className="text-center p-5">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onClick={() => {
                      setOpenAdjustQuantity(false);
                      setHideDetailItemFlight(true);
                    }}
                    className="absolute right-0 top-0 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <SquareX
                      size={24}
                      className="text-gray-600 hover:stroke-red-500"
                    />
                  </motion.button>
                  {Array.from({ length: objReturn ? 2 : 1 }, (_, i) => (
                    <>
                      <h1 className="text-2xl font-bold uppercase">
                        Sơ đồ ghế máy bay
                      </h1>
                      <p
                        className={`pt-1 ${i === 0 ? "departure-flight" : "return-flight"}`}
                      >
                        (Chuyến bay {i === 0 ? "đi" : "khứ hồi"})
                      </p>

                      <div className="h-5 flex gap-5 justify-center m-auto my-5 p-5 w-fit bg-white">
                        {stypeChooseSeat.map((item, index) => (
                          <div className="flex items-center gap-2" key={index}>
                            <span
                              className={`w-5 h-5 ${item.color} inline-block`}
                            ></span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-fit mx-auto mb-5">
                        <div className="flex flex-col gap-2">
                          {(i === 0 ? seats : seatsReturn).map(
                            (row, rowIdx) => (
                              <div
                                key={rowIdx}
                                className="flex justify-center gap-2"
                              >
                                {row.map((seat, colIdx) =>
                                  seat ? (
                                    <div
                                      key={seat.id}
                                      className="relative seat-container"
                                      onClick={() => {
                                        // Chỉ cho phép click nếu ghế không nằm trong danh sách đã đặt
                                        if (
                                          !(
                                            i === 0 ? objDeparture : objReturn
                                          )?.[2]?.soGhePhoThong_Booked?.includes(
                                            seat.id
                                          ) &&
                                          !(
                                            i === 0 ? objDeparture : objReturn
                                          )?.[2]?.soGheThuongGia_Booked?.includes(
                                            seat.id
                                          )
                                        ) {
                                          if (i === 0) {
                                            setClickedSeat(
                                              clickedSeat === seat.id
                                                ? null
                                                : seat.id
                                            );
                                          } else if (i === 1) {
                                            setClickedSeatReturn(
                                              clickedSeatReturn === seat.id
                                                ? null
                                                : seat.id
                                            );
                                          }
                                        }
                                      }}
                                    >
                                      <AnimatePresence>
                                        {(i === 0
                                          ? clickedSeat
                                          : clickedSeatReturn) === seat.id &&
                                          !(
                                            i === 0 ? objDeparture : objReturn
                                          )?.[2]?.soGhePhoThong_Booked?.includes(
                                            seat.id
                                          ) &&
                                          !(
                                            i === 0 ? objDeparture : objReturn
                                          )?.[2]?.soGheThuongGia_Booked?.includes(
                                            seat.id
                                          ) && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 10 }}
                                              className="absolute -left-2/3 bottom-full -translate-x-1/2 mb-1 bg-white p-0 overflow-hidden rounded-lg shadow-lg z-30 border border-gray-200"
                                            >
                                              {!seat.booked ? (
                                                <div className="flex w-[90px]">
                                                  <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handlePassengerTypeSelect(
                                                        rowIdx,
                                                        colIdx,
                                                        "adult",
                                                        i === 0
                                                          ? objDeparture?.[1]
                                                          : objReturn?.[1],
                                                        i === 0
                                                          ? "departure"
                                                          : "return"
                                                      );
                                                      i === 0
                                                        ? setClickedSeat(null)
                                                        : setClickedSeatReturn(
                                                            null
                                                          );
                                                    }}
                                                    className="w-1/2 h-8 hover:bg-gray-100 transition-colors flex items-center justify-center"
                                                  >
                                                    <User size={18} />
                                                  </motion.button>
                                                  <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handlePassengerTypeSelect(
                                                        rowIdx,
                                                        colIdx,
                                                        "child",
                                                        i === 0
                                                          ? objDeparture?.[1]
                                                          : objReturn?.[1],
                                                        i === 0
                                                          ? "departure"
                                                          : "return"
                                                      );
                                                      i === 0
                                                        ? setClickedSeat(null)
                                                        : setClickedSeatReturn(
                                                            null
                                                          );
                                                    }}
                                                    className="w-1/2 h-8 hover:bg-gray-100 transition-colors flex items-center justify-center"
                                                  >
                                                    <Baby size={18} />
                                                  </motion.button>
                                                </div>
                                              ) : (
                                                <div className="flex w-[90px]">
                                                  <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handlePassengerTypeSelect(
                                                        rowIdx,
                                                        colIdx,
                                                        "adult",
                                                        i === 0
                                                          ? objDeparture?.[1]
                                                          : objReturn?.[1],
                                                        i === 0
                                                          ? "departure"
                                                          : "return"
                                                      );
                                                      i === 0
                                                        ? setClickedSeat(null)
                                                        : setClickedSeatReturn(
                                                            null
                                                          );
                                                    }}
                                                    className={`w-1/2 h-8 transition-colors flex items-center justify-center ${
                                                      seat.passengerType ===
                                                      "adult"
                                                        ? "bg-blue-100"
                                                        : "hover:bg-gray-100"
                                                    }`}
                                                  >
                                                    <User size={18} />
                                                  </motion.button>
                                                  <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handlePassengerTypeSelect(
                                                        rowIdx,
                                                        colIdx,
                                                        "child",
                                                        i === 0
                                                          ? objDeparture?.[1]
                                                          : objReturn?.[1],
                                                        i === 0
                                                          ? "departure"
                                                          : "return"
                                                      );
                                                      i === 0
                                                        ? setClickedSeat(null)
                                                        : setClickedSeatReturn(
                                                            null
                                                          );
                                                    }}
                                                    className={`w-1/2 h-8 transition-colors flex items-center justify-center ${
                                                      seat.passengerType ===
                                                      "child"
                                                        ? "bg-blue-100"
                                                        : "hover:bg-gray-100"
                                                    }`}
                                                  >
                                                    <Baby size={18} />
                                                  </motion.button>
                                                </div>
                                              )}
                                            </motion.div>
                                          )}
                                      </AnimatePresence>
                                      <motion.div
                                        whileHover={{
                                          scale:
                                            (i === 0
                                              ? objDeparture
                                              : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                              seat.id
                                            ) ||
                                            (i === 0
                                              ? objDeparture
                                              : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                              seat.id
                                            )
                                              ? 1
                                              : 1.05,
                                        }}
                                        className={`w-10 h-10 flex items-center justify-center border rounded text-sm transition-all duration-200 select-none
                              ${
                                (i === 0
                                  ? objDeparture
                                  : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                  seat.id
                                ) ||
                                (i === 0
                                  ? objDeparture
                                  : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                  seat.id
                                )
                                  ? "bg-red-500 text-white cursor-not-allowed opacity-80"
                                  : seat.booked
                                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                    : seat.type === "business"
                                      ? "bg-yellow-300 hover:bg-yellow-400 cursor-pointer"
                                      : "bg-green-300 hover:bg-green-400 cursor-pointer"
                              }`}
                                      >
                                        {(i === 0
                                          ? objDeparture
                                          : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                          seat.id
                                        ) ||
                                        (i === 0
                                          ? objDeparture
                                          : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                          seat.id
                                        ) ? (
                                          seat.id
                                        ) : seat.booked ? (
                                          seat.passengerType === "adult" ? (
                                            <User size={20} />
                                          ) : (
                                            <Baby size={20} />
                                          )
                                        ) : (
                                          seat.id
                                        )}
                                      </motion.div>
                                    </div>
                                  ) : (
                                    <div
                                      key={`aisle-${rowIdx}-${colIdx}`}
                                      className="w-10 h-10 bg-gray-100"
                                    ></div>
                                  )
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden min-w-96 lg:max-w-md h-full bg-white rounded-md"
          id="box-information-booking"
        >
          <div className="rounded-scrollbar h-full w-fit">
            {Array.from({ length: objReturn ? 2 : 1 }, (_, i) => (
              <>
                <div className="p-5">
                  <h2 className="text-xl text-center font-bold uppercase">
                    Thông tin đặt chỗ
                  </h2>
                  <p
                    className={`pt-1 text-center text-sm ${i === 0 ? "departure-flight" : "return-flight"}`}
                  >
                    (Chuyến bay {i === 0 ? "đi" : "khứ hồi"})
                  </p>

                  <div className="h-fit bg-transparent rounded-2xl shadow-md w-full overflow-hidden">
                    <ItemFlight
                      loaiMayBay={`${(i === 0 ? objDeparture : objReturn)?.[0]?.loaiMayBay}`}
                      gioBay={`${(i === 0 ? objDeparture : objReturn)?.[0]?.gioBay}`}
                      gioDen={`${(i === 0 ? objDeparture : objReturn)?.[0]?.gioDen}`}
                      gia={`${(i === 0 ? objDeparture : objReturn)?.[0]?.gia}`}
                      soGheThuongGia={`${(i === 0 ? objDeparture : objReturn)?.[0]?.soGheThuongGia}`}
                      soGhePhoThong={`${(i === 0 ? objDeparture : objReturn)?.[0]?.soGhePhoThong}`}
                      thoigianBay={calculateDuration(
                        (i === 0 ? objDeparture : objReturn)?.[0]?.gioBay,
                        (i === 0 ? objDeparture : objReturn)?.[0]?.gioDen
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Hành khách</h3>

                      <NotifySheet
                        content={`Giá thương gia người lớn tăng 150% so với giá gốc. Giá trẻ em tính 75% giá người lớn.`}
                        icon={<Info size={18} stroke="#0194F3" />}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={20} className="text-blue-500" />
                        <span>
                          Người lớn:{" "}
                          {i === 0
                            ? objDeparture?.[1]?.[0]
                            : objReturn?.[1]?.[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Baby size={20} className="text-blue-500" />
                        <span>
                          Trẻ em:{" "}
                          {i === 0
                            ? objDeparture?.[1]?.[1]
                            : objReturn?.[1]?.[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Ghế đã chọn</h3>
                      <NotifySheet
                        content={`Chọn ở dưới để biết thông tin hành khách cụ thể khi điền thông tin hành khách`}
                        icon={<Info size={18} stroke="#0194F3" />}
                      />
                    </div>
                    <div className="space-y-2 ">
                      {(i === 0 ? selectedSeats : selectedSeatsReturn).size ===
                      0 ? (
                        <div className="flex items-center justify-center p-2 rounded ">
                          <span className="text-gray-500">Trống</span>
                        </div>
                      ) : (
                        Array.from(
                          i === 0 ? selectedSeats : selectedSeatsReturn
                        ).map((seatId) => {
                          const [row, col] = findSeatPosition(seatId);
                          const seat = (i === 0 ? seats : seatsReturn)[row]?.[
                            col
                          ];
                          return (
                            <div
                              key={seatId}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded cursor-pointer"
                              onClick={() => {
                                const element = document.getElementById(
                                  seatId + (i === 0 ? "departure" : "return")
                                );
                                if (element) {
                                  element.scrollIntoView({
                                    behavior: "smooth",
                                  });
                                  element.style.boxShadow =
                                    "0 0 10px 0 rgba(0,0,0,0.5)";
                                  element.style.transition =
                                    "box-shadow 0.5s ease";
                                  setTimeout(() => {
                                    element.style.boxShadow = "";
                                  }, 500);
                                }
                              }}
                            >
                              <span className="font-medium">{seatId}</span>
                              <span className="font-medium">
                                {seat?.price}

                                <span className="text-xs text-gray-600">
                                  {seat?.type === "business"
                                    ? "(Thương gia)"
                                    : "(Phổ thông)"}
                                </span>
                              </span>
                              <span className="text-sm text-gray-600">
                                {seat?.passengerType === "adult"
                                  ? "Người lớn"
                                  : "Trẻ em"}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Tổng số tiền cần thanh toán
                    </h3>
                    <p className="text-xl font-bold text-[#FF5E1F]">
                      {(i === 0 ? selectedSeats : selectedSeatsReturn).size > 0
                        ? calculateTotalPrice(i === 0 ? "departure" : "return")
                        : "0 VND"}
                    </p>
                  </div>
                </div>
              </>
            ))}

            <div className="flex justify-center gap-3 flex-wrap items-center w-fit p-5">
              {!bayMotChieu && !objReturn && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={chooseFlightReturn}
                  className="p-2 bg-[#0194F3] text-white w-fit font-semibold rounded-md transition-all duration-200 hover:bg-[#0184d9] hover:shadow-lg active:shadow-md"
                >
                  Chọn chuyến bay khứ hồi
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShowPassengerInfo}
                className="p-2 bg-[#0194F3] text-white w-fit font-semibold rounded-md transition-all duration-200 hover:bg-[#0184d9] hover:shadow-lg active:shadow-md"
              >
                Tiếp tục & Nhập thông tin hành khách
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ComponentInputInformationPassenger = ({
  airportDeparture,
  airportReturn,
  oneWayFlight,
  selectedSeatsInfo,
  selectedSeatsReturnInfo,
  convertDateToVNDate,
  naviReload,
  handleReplacePriceAirport,
}) => {
  const { showNotification } = useContext(CONTEXT);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: Array(selectedSeatsInfo.length).fill({
        loaiTuoi: "",
        Ten: "",
        ngaySinh: "",
        hangVe: "",
        giaVe: 0,
        maChuyenBay: airportDeparture._id,
        maSoGhe: "",
        flightType: "departure",
      }),
      ...(oneWayFlight
        ? {}
        : {
            itemsB: Array(selectedSeatsReturnInfo.length).fill({
              loaiTuoi: "",
              Ten: "",
              ngaySinh: "",
              hangVe: "",
              giaVe: 0,
              maChuyenBay: airportReturn?._id,
              maSoGhe: "",
              flightType: "return",
            }),
          }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: fieldsB } = useFieldArray({
    control,
    name: "itemsB",
  });

  const handleCopyPassengerAirportDepartureToReturn = () => {
    fieldsB.forEach((item, index) => {
      setValue(`itemsB.${index}.Ten`, watch(`items.${index}.Ten`));
      setValue(`itemsB.${index}.ngaySinh`, watch(`items.${index}.ngaySinh`));
    });
  };

  const mutationCreateOrder = useMutation({
    mutationFn: CreateOrder,
    onSuccess: (response) => {
      const timeEnd = convertDateToVNDate(response.data.expiredAt);
      const data = {
        timeEndPayOrder: timeEnd,
        objectOrder: response.data,
        airportDeparture: airportDeparture,
        airportReturn: oneWayFlight ? {} : airportReturn,
      };

      localStorage.setItem(
        "payment",
        JSON.stringify(`${response.data.idDH} ${response.data.expiredAt}`)
      );
      naviReload("/XemDanhSachChuyenbBay/ThanhToan", {
        state: {
          data: data,
        },
      });
    },
    onError: (error) => {
      const payment = error?.response?.data?.payment || null;
      if (payment) {
        localStorage.setItem("payment", JSON.stringify(payment));
      }
      showNotification(
        error?.response?.data?.message || "Lỗi khi đặt vé",
        "Warn"
      );
    },
  });

  const submitFormInfo = async (data) => {
    const totalPriceTickets =
      new Intl.NumberFormat("vi-VN").format(
        data.items.reduce((acc, item) => {
          const giaVeSo = handleReplacePriceAirport(item?.giaVe);

          return acc + giaVeSo;
        }, 0) +
          (data.itemsB || []).reduce((acc, item) => {
            const giaVeSo = handleReplacePriceAirport(item?.giaVe);

            return acc + giaVeSo;
          }, 0)
      ) + " VND";

    const payload = {
      airportDeparture: data.items,
      airportReturn: data?.itemsB || [],
      totalQuantityTickets: data.items.length + (data.itemsB?.length || 0),
      totalPriceTickets: totalPriceTickets,
    };
    await mutationCreateOrder.mutate(payload);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitFormInfo)} className="">
        {!oneWayFlight && (
          <h1 className="pt-1 text-center w-full text-base uppercase mb-3 departure-flight">
            -------Chuyến bay đi-------
          </h1>
        )}

        {fields.map((item, index) => (
          <div
            key={airportDeparture._id + index}
            className={`w-full flex justify-between mb-6 transition-all duration-500`}
          >
            <ThongTinHanhKhach
              register={register}
              index={index}
              item="items"
              selectedSeatsInfo={selectedSeatsInfo}
              errors={errors}
              setValue={setValue}
              watch={watch}
              airport={airportDeparture}
            />
          </div>
        ))}

        {!oneWayFlight && fieldsB.length > 0 && (
          <>
            <h1 className="pt-1 text-center w-full text-base uppercase  return-flight">
              -------Chuyến bay khứ hồi-------
            </h1>
            <div className="flex justify-center w-full h-fit mb-3 pt-1">
              <NotifySheet
                content={`Sao chép thông tin chuyến bay đi`}
                icon={
                  <BookCopy
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCopyPassengerAirportDepartureToReturn}
                  />
                }
              />
            </div>
            {fieldsB.map((item, index) => (
              <div
                key={airportReturn._id + index}
                className={`flex justify-between mb-6 transition-all duration-500`}
              >
                <ThongTinHanhKhach
                  register={register}
                  index={index}
                  item="itemsB"
                  selectedSeatsInfo={selectedSeatsReturnInfo}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  airport={airportReturn}
                />
              </div>
            ))}
          </>
        )}

        <motion.button
          type={mutationCreateOrder.isPending ? "button" : "submit"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex p-2 bg-[#0194F3] mb-5 text-white mt-3 mx-auto font-semibold rounded-md gap-x-3 items-center justify-center transition-all duration-200 hover:bg-[#0184d9] hover:shadow-lg active:shadow-md"
        >
          {mutationCreateOrder.isPending ? (
            <l-bouncy size="30" speed="1.75" color="white" />
          ) : (
            <>
              Xác nhận & sang trang thanh toán
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                />
              </svg>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

function ThongTinHanhKhach({
  register,
  index,
  item,
  errors,
  setValue,
  watch,
  airport,
  passenger,
  selectedSeatsInfo,
}) {
  const { handleReplacePriceAirport } = useContext(CONTEXT);

  useEffect(() => {
    setValue(
      `${item}.${index}.hangVe`,
      selectedSeatsInfo[index].seatType === "business"
        ? "Vé thương gia"
        : "Vé phổ thông",

      { shouldValidate: true }
    );

    setValue(`${item}.${index}.maSoGhe`, selectedSeatsInfo[index].seatId, {
      shouldValidate: true,
    });
    setValue(
      `${item}.${index}.loaiTuoi`,
      selectedSeatsInfo[index].passengerType === "adult"
        ? "Người lớn"
        : "Trẻ em",
      {
        shouldValidate: true,
      }
    );
    setValue(`${item}.${index}.giaVe`, selectedSeatsInfo[index].price, {
      shouldValidate: true,
    });
  }, [
    index,
    setValue,
    passenger,
    airport,
    watch,
    handleReplacePriceAirport,
    item,
    selectedSeatsInfo,
  ]);

  return (
    <div
      id={
        watch(`${item}.${index}.maSoGhe`) + watch(`${item}.${index}.flightType`)
      }
      className="bg-white shadow-lg rounded-md p-5 w-full"
    >
      <h3 className="text-sm font-bold mb-6 text-left">
        Thông tin vé ghế {watch(`${item}.${index}.maSoGhe`)}{" "}
      </h3>

      <div className="flex flex-col gap-x-5 mb-6 text-base font-semibold">
        <div className="inputBox w-full mb-6">
          <input
            className={`${errors?.[item]?.[index]?.Ten ? "inputTagBug" : "inputTag"}`}
            type="text"
            required
            {...register(`${item}.${index}.Ten`, {
              required: "full name",
              minLength: {
                value: 2,
                message: "Ít nhất 2 kí tự",
              },
              maxLength: {
                value: 50,
                message: "Nhiều nhất 50 kí tự",
              },
              pattern: {
                value: /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
                message: "Nhập chữ",
              },
            })}
          />
          <span className={`spanTag`}>
            {errors?.[item]?.[index]?.Ten
              ? errors?.[item]?.[index].Ten.message
              : `HỌ TÊN [${watch(`${item}.${index}.Ten`).length}/70]`}
          </span>
        </div>
        <div className="mb-6 inputBox w-full">
          <input
            className={`${errors[item]?.[index]?.ngaySinh ? "inputTagBug" : "inputExist"}`}
            type="date"
            // defaultValue={airport.da?.birthday}
            required
            {...register(`${item}.${index}.ngaySinh`, {
              required: "birthday",
              validate: {
                validAge: (value) => {
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  const dayDiff = today.getDate() - birthDate.getDate();

                  const adjustedAge =
                    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                      ? age - 1
                      : age;

                  const passengerType = watch(`${item}.${index}.loaiTuoi`);

                  if (passengerType === "Người lớn") {
                    return (
                      (adjustedAge >= 12 && adjustedAge <= 80) ||
                      "Người lớn từ 12 đến 80 tuổi"
                    );
                  }
                  if (passengerType === "Trẻ em") {
                    return (
                      (adjustedAge < 12 && adjustedAge >= 2) ||
                      "Trẻ em dưới 12 và trên 2 tuổi"
                    );
                  }
                  if (passengerType === "Em bé") {
                    return (
                      adjustedAge < 2 ||
                      "Em bé dưới 2 tuổi và không quá hiện tại"
                    );
                  }

                  return true;
                },
              },
            })}
          />
          <span className={`spanTag whitespace-nowrap`}>
            {errors[item]?.[index]?.ngaySinh
              ? errors[item]?.[index]?.ngaySinh.message
              : "Ngày sinh"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NotifySheet({ content, icon }) {
  return (
    <>
      <div className="relative">
        <div className="flex items-center w-fit">
          <div
            className="cursor-pointer transition-transform duration-200 hover:scale-110"
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              tooltip.style.opacity = "1";
              tooltip.style.transform = "translate(-50%, 0) scale(1)";
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              tooltip.style.opacity = "0";
              tooltip.style.transform = "translate(-50%, 0) scale(0.95)";
            }}
          >
            {icon}
          </div>
          <div
            className="absolute font-medium overflow-hidden -top-10 left-1/2 -translate-x-1/2 z-10 max-w-48 min-w-28 text-sm text-white bg-gray-800/95 rounded-lg shadow-lg transition-all duration-200 opacity-0 scale-95 pointer-events-none"
            style={{ transform: "translate(-50%, 0) scale(0.95)" }}
          >
            <div className="p-1">
              <p className="text-center">{content}</p>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800/95 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdjustQuantityv2;
