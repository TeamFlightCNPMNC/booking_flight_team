import axios from "../axiosInstance.js";
import moment from "moment";

export const Get = async ({ value, type }) => {
  return await axios.get(`/flights/search?value=${value}&type=${type}`);
};
export const GetAll = async ({ page, type }) => {
  return await axios.get(`/flights/get_all?page=${page}&type=${type}`);
};

const converFormatDate = (date) => {
  return moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
};

export const Update = async (data) => {
  return await axios.post(`/flights/update`, {
    id: data.idCB,
    diemBay: data.diemBay,
    diemDen: data.diemDen,
    ngayBay: converFormatDate(data.ngayBay),
    gioBay: data.gioBay,
    ngayDen: converFormatDate(data.ngayDen),
    gioDen: data.gioDen,
    hangBay: data.hangBay,
    loaiChuyenBay: data.loaiChuyenBay,
    gia: data.gia,
    soGhePhoThong: parseInt(data.soGhePhoThong, 10),
    soGheThuongGia: parseInt(data.soGheThuongGia, 10),
  });
};

export const Create = async (data) => {
  return await axios.post(`/flights/create`, {
    diemBay: data.diemBay,
    diemDen: data.diemDen,
    ngayBay: converFormatDate(data.ngayBay),
    gioBay: data.gioBay,
    ngayDen: converFormatDate(data.ngayDen),
    gioDen: data.gioDen,
    hangBay: data.hangBay,
    loaiChuyenBay: data.loaiChuyenBay,
    gia: data.gia,
    soGhePhoThong: parseInt(data.soGhePhoThong, 10),
    soGheThuongGia: parseInt(data.soGheThuongGia, 10),
  });
};

export const Create3M = async ({ verify }) => {
  return await axios.get(`/flights/create/three-months?verify=${verify}`);
};

export const Create3MVerify = async () => {
  return await axios.get(`/flights/create/three-months/send-verify`);
};

export const GetOldestNewest = async () => {
  return await axios.get(`/flights/get/oldest-newest`);
};
