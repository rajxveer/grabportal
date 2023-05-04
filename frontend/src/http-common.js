import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:1000/api",
  headers: {
    "Content-type": "application/json"
  },
  timeout: 15000 // 5
});
