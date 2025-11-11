import FormFlight from "./FormFlight";
import { ToastContainer } from "react-toastify";

function AdminThemChuyenBay() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl">THÊM CHUYẾN BAY</h1>
      </div>
      <FormFlight typeAction="add" />
    </>
  );
}

export default AdminThemChuyenBay;
