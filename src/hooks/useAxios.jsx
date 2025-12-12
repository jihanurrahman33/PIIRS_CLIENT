import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: "https://public-infrastructure-issue-reporti-pearl.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
