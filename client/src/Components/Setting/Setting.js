import { memo } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { OptionSetting } from "./OptionSetting";
import History from "./HistoryTicket";
import { useLocation } from "react-router-dom";
import InterFaceLogin from "../Home/InterFaceLogin";
import { ToastContainer } from "react-toastify";
import CountdownTimer from "../Utils/CountdownTimer";
import { useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import { Helmet } from "react-helmet-async";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { LoginSuccess } from "./StateLoginSucces";

function Setting() {
  const location = useLocation();
  const isInfoAccount = location.pathname === "/Setting/InfoAccount";

  const {
    QR_VietQR,
    setQR_VietQR,
    timeExpired_VietQR,
    orderId_VietQR,
    isShowOptionSetting_LoginSuccess,
  } = useContext(CONTEXT);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ToastContainer />
      <Header />
      {QR_VietQR && timeExpired_VietQR && (
        <div
          className="w-full h-full bg-white/50 backdrop-brightness-75 fixed z-[100]"
          onClick={() => setQR_VietQR(null)}>
          <div className="w-96 h-96 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={QR_VietQR} alt="QR-VietQR" />
            <CountdownTimer
              targetTime={timeExpired_VietQR}
              orderId={orderId_VietQR}
            />
          </div>
        </div>
      )}
      {isShowOptionSetting_LoginSuccess && <LoginSuccess />}

      <div
        className={`md:p-5 md:w-full lg:w-[85%] overflow-hidden min-h-screen md:flex md:gap-x-3 md:m-auto md:justify-between`}>
        <div className="w-0 h-0 md:w-[33%] md:h-fit overflow-hidden rounded-lg border bg-white border-[#0194F3] shadow-2xl shadow-blue-500/50">
          <OptionSetting />
        </div>

        <div className="w-full md:w-[65%] h-fit rounded-scrollbar md:border md:bg-white md:shadow-2xl md:shadow-blue-500/50 md:border-[#0194F3]">
          {isInfoAccount ? <InterFaceLogin registerTrue={true} /> : <History />}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default memo(Setting);
