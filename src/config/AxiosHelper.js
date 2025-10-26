import axios from "axios";

// Use VITE_ environment variable from .env
export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log("Backend URL:", BASE_URL); // Debugging: should log correctly

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "text/plain",
  },
});
