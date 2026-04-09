import "dotenv/config";
import axios from "axios";

export const api = axios.create({
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
