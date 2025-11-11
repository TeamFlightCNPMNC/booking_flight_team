import React, { useState, useEffect, useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import { CheckPaidVietQR } from "../../API/Payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatepdateStatus } from "../../API/DonHang.js";
import { useLocation } from "react-router-dom";

const CountdownTimer = ({ targetTime, orderId }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    isExpired,
    setIsExpired,
    QR_VietQR,
    showNotification,
    setQR_VietQR,
    setTimeExpired_VietQR,
  } = useContext(CONTEXT);

  const mutationUpdateStatus = useMutation({
    mutationFn: UpdatepdateStatus,
    mutationKey: ["updateStatus"],
    onSuccess: (data) => {
      localStorage.removeItem("payment");

      const currentUrl =
        location.pathname === "/XemDanhSachChuyenbBay/ThanhToan";

      if (currentUrl) {
        window.location.href = `/`;
      }
      queryClient.invalidateQueries("updateStatus");
      setQR_VietQR(null);
      setIsExpired(true);
      setTimeExpired_VietQR(null);
      showNotification(data.data.message, "Success");
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với paypal",
        "Warn"
      );
    },
  });

  const mutationCheckPaidVietQR = useMutation({
    mutationFn: CheckPaidVietQR,
    onSuccess: (data) => {
      console.log(data);
      if (data.data.message === "SUCCESS") {
        mutationUpdateStatus.mutate({
          status: "200",
          orderID: data.data.data.orderId,
          type: data.data.data.typePay,
        });
      }
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.message ||
          "Lỗi khi kiểm tra trạng thái thanh toán VietQR",
        "Warn"
      );
    },
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const format_targetTime = new Date(targetTime).getTime();
      const difference = format_targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(interval);
      }
    }, 1000);

    const checkPaidVietQR = setInterval(() => {
      if (QR_VietQR && !isExpired) {
        mutationCheckPaidVietQR.mutate({ orderId });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(checkPaidVietQR);
    };
  }, [targetTime, QR_VietQR, isExpired]);

  return (
    <div className="text-center font-bold text-lg font-mono bg-black">
      {isExpired ? (
        <p className="text-red-500">Thời gian thanh toán đã hết!</p>
      ) : (
        <p className="text-white">
          Thời gian còn lại: {timeLeft.minutes}:{timeLeft.seconds}
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
