import Axios from "axios";

export const axios = Axios.create({
  // baseURL: "http://localhost:5000/",
  baseURL: "http://192.168.1.6:5000/",
});
