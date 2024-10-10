import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
  timeout: 20000, // Set timeout to 10 seconds (10000 ms)
});
