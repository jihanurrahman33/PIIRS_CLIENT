import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
const axiosSecure = axios.create({
  baseURL: "https://public-infrastructure-issue-reporti-pearl.vercel.app",
});

const useAxiosSecure = () => {
  const token = localStorage.getItem("access-token");
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  useEffect(() => {
    //intercept request
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    //interceptor response
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
        const statusCode = error.status;
        if (statusCode === 401 || statusCode === 403) {
          logOut().then(() => {
            navigate("/login");
          });
        }
        return Promise.reject(error);
      }
    );

    //interceptor request
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate, token]);
  return axiosSecure;
};

export default useAxiosSecure;
