import axios from "axios";
import { jwtDecode } from "jwt-decode";
import showNotification from "./showNotification";

const instance = axios.create({
  // baseURL: "http://localhost:4001",
  baseURL: "https://travfruitv4-server.vercel.app",
  timeout: 1000 * 60 * 5,
});

const EXCLUDED_ENDPOINTS = ["/user/login"];
const ENDPOINT_LOGOUT = "/user/logout";

instance.interceptors.request.use(
  function (config) {
    if (EXCLUDED_ENDPOINTS.some((endpoint) => config.url.includes(endpoint))) {
      return config;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      showNotification("authorization", "Không có token.");
      window.location.href = "/";
      return Promise.reject(new Error("Không có token"));
    }
    try {
      // Kiểm tra token đã hết hạn chưa
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        showNotification("authorization", "Token đã hết hạn.");
        localStorage.removeItem("accessToken");
        return Promise.reject(new Error("Token hết hạn"));
      }
    } catch (error) {
      showNotification("authorization", `Token không hợp lệ. ${error}`);
      localStorage.removeItem("accessToken");
      return Promise.reject(new Error("Token không hợp lệ"));
    }
    config.headers["Cache-Control"] = "no-cache"; // Ngăn trình duyệt cache request
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 410) {
      console.warn("Token hết hạn, chuyển hướng đến trang đăng nhập...");
      localStorage.removeItem("accessToken");
      window.location.href = "/"; // Redirect đến trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default instance;
