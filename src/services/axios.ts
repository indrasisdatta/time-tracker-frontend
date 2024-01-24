import Axios from "axios";

export const axios = Axios.create({
  // baseURL: "http://localhost:5000/",
  // baseURL: "http://192.168.1.6:5000/",
  // baseURL: "https://timesheet-backend-vkj0.onrender.com/",
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const healthCheck = async () => {
  return await axios.get(`health`);
};
