import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  useEffect(() => {
    //intercept request
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`;
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
  }, [user, logOut, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
