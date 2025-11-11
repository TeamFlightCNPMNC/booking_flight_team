import { GetPayment, DeletePayment } from "../Components/API/Payment.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bouncy } from "ldrs";
import CatchErrorAPI from "./CatchErrorAPI.jsx";
import { convertDateToVNDate } from "./convertDateToVN.js";
import { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useToastOptions } from "./CustomToast.js";
import { UpdateStatus } from "./API/Account.js";

function AdminPayment() {
  const queryClient = useQueryClient();

  bouncy.register();

  const {
    isLoading,
    error,
    data: payment,
  } = useQuery({
    queryKey: ["payment"],
    queryFn: GetPayment,
    refetchOnWindowFocus: false,
  });

  const statusPayment = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes > 15 ? "Đã hết hạn" : "Chưa hết hạn";
  };

  const [isShowDetailPayment, setShowDetailPayment] = useState(null);
  const handleShowDetailPayment = useCallback(
    (index) => {
      setShowDetailPayment(isShowDetailPayment === index ? null : index);
    },

    [isShowDetailPayment]
  );

  const mutationDeletePayment = useMutation({
    mutationFn: DeletePayment,
    onSuccess: (response) => {
      queryClient.invalidateQueries("payment");
      setShowDetailPayment(null);
      toast.success(response.data.message, useToastOptions);
    },
  });

  const mutationUpdateStatus = useMutation({
    mutationFn: UpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setShowDetailPayment(null);
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <l-bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }
  if (error) {
    return <CatchErrorAPI error={error} />;
  }
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
        <h1 className="font-bold text-2xl">DANH SÁCH GIAO DỊCH</h1>
      </div>
      <div className="flex w-full">
        <table className="w-11/12 m-auto bg-transparent">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="">
            {payment.data.payment?.length > 0 ? (
              payment.data.payment.map((p, index) => (
                <>
                  <tr className="text-center" key={p._id}>
                    <td>{index + 1}</td>
                    <td>{convertDateToVNDate(p.createdAt)}</td>

                    <td
                      className={`${
                        statusPayment(p.createdAt) === "Đã hết hạn"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {statusPayment(p.createdAt)}
                    </td>
                    <td className="">
                      <div>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => handleShowDetailPayment(index)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isShowDetailPayment === index && (
                    <>
                      <tr className="h-fit mb-4">
                        <td className="col-span-4" colSpan={5}>
                          <div className="mb-3 flex">
                            <p>Thông tin payment : {p._id}</p>
                          </div>

                          <div className=" w-full">
                            <ul className="list-disc list-inside">
                              {statusPayment(p.createdAt) !== "Đã hết hạn" && (
                                <li>Mã đơn hàng : {p.orderId}</li>
                              )}
                              <li>Mã người dùng : {p.userId}</li>
                              <li>Mã chuyến bay đi : {p.cbId}</li>
                              {p.cbIdRe && (
                                <li>Mã chuyến bay khứ hồi : {p.cbIdRe}</li>
                              )}
                              <li>URL thanh toán : {p.payUrl}</li>
                            </ul>
                          </div>
                          <div
                            className={`flex gap-x-3 mt-4 w-fit ${
                              statusPayment(p.createdAt) !== "Đã hết hạn" &&
                              "select-none opacity-50 pointer-events-none"
                            }`}
                          >
                            <button
                              type="button"
                              className={`cursor-pointer ${
                                mutationDeletePayment.isPending &&
                                "select-none opacity-50 pointer-events-none"
                              }`}
                              onClick={() =>
                                mutationDeletePayment.mutate({
                                  orderId: p.orderId,
                                  _id: p._id,
                                  cbId: p.cbId,
                                  cbIdRe: p.cbIdRe,
                                })
                              }
                            >
                              {mutationDeletePayment.isPending ? (
                                <l-bouncy
                                  size="35"
                                  speed="1.75"
                                  color="white"
                                />
                              ) : (
                                "Cập nhật chuyến bay"
                              )}
                            </button>
                            <span className="mx-1">|</span>
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() =>
                                mutationUpdateStatus.mutate({
                                  id: p.userId,
                                  status: "lock",
                                })
                              }
                            >
                              {mutationUpdateStatus.isPending ? (
                                <l-bouncy
                                  size="35"
                                  speed="1.75"
                                  color="white"
                                />
                              ) : (
                                "Khóa tài khoản người dùng"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </>
              ))
            ) : (
              <p className="mt-4 uppercase tracking-widest text-center w-full">
                Trống
              </p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminPayment;
