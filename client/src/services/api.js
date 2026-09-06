import axios from "axios";

const API = axios.create({
  baseURL: "https://product-management-system-crj6.onrender.com/api",
});

export default API;