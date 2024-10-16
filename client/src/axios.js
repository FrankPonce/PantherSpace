// axios.js
import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api", // Removed trailing slash
  withCredentials: true,
  timeout: 20000, // Set timeout to 20 seconds (20000 ms)
});
