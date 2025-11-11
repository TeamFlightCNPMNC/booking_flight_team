import { OptionSetting } from "./OptionSetting";
import "../../style/navbar.css";
import { LogOut, UserRoundPen, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
export function LoginSuccess() {
  // return (
  //   <div className="absolute z-50 bg-white rounded-lg right-5 h-fit w-fit nav">
  //     <OptionSetting />
  //   </div>
  // );
  const {
    handleSetStateLogin_Logout,
    setShowOptionSetting_LoginSuccess,
    isShowOptionSetting_LoginSuccess,
  } = useContext(CONTEXT);
  const items = [
    {
      name: "Xem thông tin tài khoản",
      icon: <UserRoundPen size={16} />,
      link: "/Setting/InfoAccount",
    },
    {
      name: "Xem lịch sử đơn hàng",
      icon: <History size={16} />,
      link: "/Setting/HistoryTicket",
    },
    {
      name: "Đăng xuất",
      icon: <LogOut size={16} />,
    },
  ];
  return (
    <nav className="absolute z-50 right-5 top-12 md:top-20 h-fit ">
      <ul className="">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              setShowOptionSetting_LoginSuccess(false);
              if (!item?.link) {
                handleSetStateLogin_Logout();
              }
            }}>
            <Link to={item?.link}>
              {item?.icon} {item?.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
