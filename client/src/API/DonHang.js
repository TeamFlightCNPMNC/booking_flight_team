import axios from "../Components/Utils/authAxios.js";

export const Create = async (payload) => {
  return await axios.post("/order/create", payload);
};

export const UpdatepdateStatus = async ({ status, orderID, flight, type }) => {
  return await axios.post("/order/update_status", {
    status: status,
    orderID: orderID,
    flight,
    type: type || "",
  });
};
export const Pay = async ({ orderId }) => {
  return await axios.post("/payment/pending", {
    orderId,
  });
};
