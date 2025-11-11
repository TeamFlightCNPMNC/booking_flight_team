import axios from "../Components/Utils/authAxios.js";

export const MoMo = async (payload) => {
  return await axios.post("/payment-momo", payload);
};

export const Paypal = async (payload) => {
  return await axios.post("/paypal/pay", {
    amount: payload.amount,
    orderId: payload.orderId,
  });
};

export const UpdatePayUrl = async ({ orderId, payUrl, typePay }) => {
  return await axios.post("/payment/update/payurl", {
    orderId,
    payUrl,
    typePay,
  });
};

export const TransactionMoMo = async ({ orderId }) => {
  return await axios.get(`/transaction-status/${orderId}`);
};

export const TransactionPaypal = async ({ orderId, token }) => {
  return await axios.get(
    `/paypal/pay/success?orderId=${orderId}&token=${token}`
  );
};

export const CheckPaidVietQR = async ({ orderId }) => {
  return await axios.post("/vietqr/google-sheet", { orderId });
};
