import { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../../Context/SocketContext";
import { TriangleAlert, CircleCheckBig, CloudAlert } from "lucide-react";
import { CONTEXT } from "../../Context/ContextGlobal";

function NotificationSocket() {
  const { operatingStatus } = useContext(SocketContext);

  return (
    <div
      className={`fixed items-start h-2/3 overflow-hidden z-50 flex justify-center w-1/3 bg-white right-3 top-24 rounded-md`}>
      <div className="flex flex-col border-b w-full p-4">
        <h1 className="uppercase font-semibold text-lg tracking-wider">
          Thông báo
        </h1>
        <div className="flex items-center gap-x-3">
          <div
            className={`${operatingStatus === "Online" ? "bg-green-500" : "bg-red-600"} rounded-full w-3 h-3 text-center text-white text-xs font-semibold`}></div>
          <h4 className="text-sm">{operatingStatus}</h4>
        </div>
      </div>
    </div>
  );
}
export function Notification() {
  const { notification, setNotification } = useContext(CONTEXT);
  const DURATION = 3000; // 3 giây

  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const elapsedTimeRef = useRef(0);
  const timeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(progressIntervalRef.current);
  };

  const startTimers = (remainingTime) => {
    clearTimers();

    progressIntervalRef.current = setInterval(() => {
      const elapsed =
        Date.now() - startTimeRef.current + elapsedTimeRef.current;
      const newProgress = Math.max(0, ((DURATION - elapsed) / DURATION) * 100);
      setProgress(newProgress);

      if (newProgress <= 0) {
        clearTimers();
        setNotification(null); // Ẩn thông báo
      }
    }, 16);

    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setNotification(null);
    }, remainingTime);
  };

  useEffect(() => {
    if (notification) {
      // Reset thời gian nếu có thông báo mới
      elapsedTimeRef.current = 0;
      startTimeRef.current = Date.now();
      setProgress(100);
      setIsPaused(false);
      startTimers(DURATION);
    }

    return () => clearTimers();
  }, [notification]);

  const handleMouseEnter = () => {
    if (!isPaused) {
      setIsPaused(true);
      elapsedTimeRef.current += Date.now() - startTimeRef.current;
      clearTimers();
    }
  };

  const handleMouseLeave = () => {
    if (isPaused) {
      setIsPaused(false);
      startTimeRef.current = Date.now();
      startTimers(DURATION - elapsedTimeRef.current);
    }
  };

  if (!notification) return null;

  const { message, type } = notification;
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-fit w-64 md:w-80 overflow-hidden fixed top-12 lg:top-[5.3rem] right-5 md:right-[50px] z-[999] duration-700 transition-all cursor-pointer flex items-center bg-white shadow-lg border rounded-md ${
        type === "Warn"
          ? "border-yellow-400"
          : type === "Success"
            ? "border-green-400"
            : "border-red-400"
      }`}>
      <div className="flex items-center w-full p-1">
        {type === "Warn" ? (
          <TriangleAlert className="stroke-yellow-400 size-5 md:size-6 flex-shrink-0" />
        ) : type === "Success" ? (
          <CircleCheckBig className="stroke-green-400 size-5 md:size-6 flex-shrink-0" />
        ) : (
          <CloudAlert className="stroke-red-400 size-5 md:size-6 flex-shrink-0" />
        )}
        <p
          className={`ml-3 font-normal text-sm md:text-base font-mono ${
            type === "Warn"
              ? "text-yellow-400"
              : type === "Success"
                ? "text-green-400"
                : "text-red-400"
          }`}>
          {message}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div
          className={`h-full ${
            type === "Warn"
              ? "bg-yellow-400"
              : type === "Success"
                ? "bg-green-400"
                : "bg-red-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default NotificationSocket;
