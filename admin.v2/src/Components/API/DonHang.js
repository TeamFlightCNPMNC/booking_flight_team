import axios from "../axiosInstance.js";

export const Get = async ({ id }) => {
  return await axios.get(`/order/get?orderID=${id}`);
};
