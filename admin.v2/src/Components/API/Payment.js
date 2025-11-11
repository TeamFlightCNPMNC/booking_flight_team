import axios from "../axiosInstance.js";

export const GetPayment = async () => {
  return await axios.get(`/payment/get`);
};

export const DeletePayment = async ({ orderId, _id, cbId, cbIdRe }) => {
  return await axios.post(`/payment/delete`, {
    orderId,
    _id,
    cbId,
    cbIdRe,
  });
};
