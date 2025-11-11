import axios from "../axiosInstance.js";

export const getAll = async () => {
  const res = await axios.get("/user/get_all");
  return res;
};
export const Login = async (data) => {
  return await axios.post("/user/login", {
    numberPhone: data.phoneLogin,
    password: data.passwordLogin,
  });
};
export const Logout = async () => {
  return await axios.delete(`/user/logout`);
};
export const Get = async () => {
  return await axios.get("/user/get");
};
export const GetWithIDFLight = async ({ idF, trangThai }) => {
  return await axios.get(
    `/user/search/with/flight?idF=${idF}&trangThai=${trangThai}`
  );
};
export const UpdateStatus = async ({ id, status }) => {
  return await axios.post("/user/status", {
    id,
    status,
  });
};
export const GetReservaton = async ({ id, page, type }) => {
  return await axios.get(
    `/user/reservation?id=${id}&page=${page}&type=${type}`
  );
};
