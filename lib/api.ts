import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://freelancer-server-9l9n.onrender.com",
  withCredentials: true,
});

export default instance;
