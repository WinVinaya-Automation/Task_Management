import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000",
  // baseURL: "http://192.168.1.20:5000",
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000`,
});

export default api;
