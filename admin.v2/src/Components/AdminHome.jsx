import { Link, useNavigate } from "react-router";
import PropTypes from "prop-types";
import AccountUsers from "./AccountUsers";
import AdminChuyenBay from "./AdminChuyenBay";
import AdminPayment from "./AdminPayment";
import { useMutation } from "@tanstack/react-query";
import { Logout } from "./API/Account";
import CatchErrorAPI from "./CatchErrorAPI";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import AdminThemChuyenBay from "./AdminThemChuyenBay";
import AdminCreateFlight3M from "./AdminCreateFlight3M";
export default function AdminHome({ type }) {
  const naviLogin = useNavigate();

  const mututionLogout = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      naviLogin("/");
    },
  });

  const [isDropdownFlight, setIsDropdownFlight] = useState(false);
  return (
    <>
      <div className="flex justify-between p-5 w-full h-screen bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png')] bg-center bg-no-repeat bg-cover overflow-hidden">
        <div className="flex flex-col font-medium  w-[17%] rounded-lg h-fit overflow-hidden font-mono">
          <p className="p-4 border-b">Quản lý</p>
          <Link to="/home" className="p-4 hover:opacity-80">
            Tài Khoản người dùng
          </Link>

          <div>
            <div className="flex items-center justify-between p-4">
              <Link
                to="/home/chuyenbay"
                className="hover:opacity-80 whitespace-nowrap">
                Chuyến bay
              </Link>

              {!isDropdownFlight ? (
                <ChevronDown
                  className="cursor-pointer w-full"
                  onClick={() => setIsDropdownFlight(!isDropdownFlight)}
                />
              ) : (
                <ChevronUp
                  className="cursor-pointer w-full"
                  onClick={() => setIsDropdownFlight(!isDropdownFlight)}
                />
              )}
            </div>
            {isDropdownFlight && (
              <div className="flex flex-col gap-y-3">
                <Link
                  to="/home/chuyenbay/add"
                  className="hover:opacity-80 whitespace-nowrap ml-8 text-sm">
                  Thêm chuyến bay
                </Link>
                <Link
                  to="/home/chuyenbay/create3month"
                  className="hover:opacity-80 whitespace-nowrap ml-8 text-sm">
                  Tạo cho 3 tháng
                </Link>
              </div>
            )}
          </div>

          <Link to="/home/payment" className="p-4 hover:opacity-80">
            Payment
          </Link>

          <Link
            to="https://travfruitv4.vercel.app/"
            className="p-4 hover:opacity-80">
            Go to client
          </Link>
          <Link
            to="https://github.com/thanhlongtruong/travFruit"
            className="p-4 hover:opacity-80">
            Go to Github
          </Link>
          <button
            onClick={mututionLogout.mutate}
            className="p-4 hover:opacity-80 text-left">
            {mututionLogout.isPending ? (
              <l-bouncy size="30" speed="1.75" color="white" />
            ) : (
              "Đăng xuất"
            )}
          </button>
          {mututionLogout.isError && (
            <CatchErrorAPI error={mututionLogout.error} />
          )}
        </div>
        <div className="w-[81%] overflow-auto">
          {type === "accountuser" ? (
            <AccountUsers />
          ) : type === "chuyenbay" ? (
            <AdminChuyenBay />
          ) : type === "addchuyenbay" ? (
            <AdminThemChuyenBay />
          ) : type === "create3month" ? (
            <AdminCreateFlight3M />
          ) : type === "payment" ? (
            <AdminPayment />
          ) : (
            <AccountUsers />
          )}
        </div>
      </div>
    </>
  );
}

AdminHome.propTypes = {
  type: PropTypes.string.isRequired,
};
