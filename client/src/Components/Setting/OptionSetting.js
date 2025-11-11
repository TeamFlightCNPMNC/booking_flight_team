import { useEffect, useRef, useState, useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import { Link } from "react-router-dom";

export function OptionSetting() {
  const {
    handleSetStateLogin_Logout,
    setShowOptionSetting_LoginSuccess,
    isShowOptionSetting_LoginSuccess,
    naviReload,
  } = useContext(CONTEXT);
  const ref = useRef();
  const [isTextBg, setTextBg] = useState("bg-[#c79971] text-white");
  let place = window.location.href.includes("Setting/") ? true : false;
  let placeHistoryTicket = window.location.href.includes(
    "Setting/HistoryTicket"
  );
  let placeInfoAccount = window.location.href.includes("Setting/InfoAccount")
    ? true
    : false;
  useEffect(() => {
    const tagCurrent = ref.current;
    const tagChildren = tagCurrent.children;

    for (let i = 0; i < tagChildren.length; i++) {
      tagChildren[i].classList.remove("bg-sky-200");
    }

    if (placeInfoAccount) {
      tagChildren[1].classList.add("bg-sky-200");
    } else {
    }
    if (placeHistoryTicket) {
      tagChildren[2].classList.add("bg-sky-200");
    } else {
    }

    if (!place) {
      setTextBg("bg-[#c79971] text-white");
    } else {
      setTextBg("bg-white text-black");
    }
  }, [place, placeInfoAccount, placeHistoryTicket]);

  return (
    <>
      <p
        className={`select-none flex items-center border-b px-5 py-7 justify-start h-[20%] w-full text-xl font-bold rounded-t-lg rounded-tr-lg ${isTextBg}`}>
        Tài khoản của tôi
      </p>
      <div className={`h-fit w-full`} ref={ref}>
        <Link
          className="flex items-center justify-start px-5 py-7 optionWhenLoginSuccess"
          onClick={() => naviReload(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#0369a1"
            className="w-6 h-6 mr-3 size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          Quay lại
        </Link>

        <Link
          to="/Setting/InfoAccount"
          className="flex items-center justify-start px-5 py-7 optionWhenLoginSuccess">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#0369a1"
            className="w-6 h-6 mr-3 size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Xem thông tin tài khoản
        </Link>

        <Link
          to="/Setting/HistoryTicket"
          className="flex items-center justify-start px-5 py-7 optionWhenLoginSuccess">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#0369a1"
            className="w-6 h-6 mr-3">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
            />
          </svg>
          Xem lịch sử đơn hàng
        </Link>

        <button
          onClick={handleSetStateLogin_Logout}
          className="flex items-center justify-start px-5 py-7 optionWhenLoginSuccess">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#0369a1"
            className="w-6 h-6 mr-3">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
          Đăng xuất
        </button>
      </div>
    </>
  );
}
