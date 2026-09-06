import axios from "axios";

const API = axios.create({
  baseURL: "https://product-management-system-zl7f.onrender.com/api",
});

export default API;