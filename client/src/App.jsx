import { Route, Routes } from "react-router-dom";

import Setting from "./Components/Setting/Setting.js";
import XemDanhSachChuyenBay from "./Components/Plane/XemDanhSachChuyenBay.js";
import TrangThanhToan from "./Components/TrangThanhToan.js";
import { Notification } from "./Components/Noti/NotificationSocket.js";
import { Navigate } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Home } from "./Components/Home/Home.jsx";
import About from "./Components/About.jsx";

function App() {
  const location = useLocation();

  const isPublicRoute =
    location.pathname === "/" || location.pathname.includes("/about");

  return (
    <>
      {isPublicRoute && (
        <Helmet>
          <link
            rel="canonical"
            href={`https://travfruitv4.vercel.app${location.pathname === "/" ? "" : location.pathname}`}
          />
        </Helmet>
      )}
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/XemDanhSachChuyenBay"
          element={<XemDanhSachChuyenBay />}
        />
        <Route path="/Setting/InfoAccount" element={<Setting />} />
        <Route path="/Setting/HistoryTicket" element={<Setting />} />

        <Route
          path="/XemDanhSachChuyenbBay/ThanhToan"
          element={<TrangThanhToan />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
