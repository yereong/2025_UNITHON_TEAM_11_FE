import { ParamValue } from "next/dist/server/request/params";
import axiosInstance from "@/api/axiosInstance";
import axios, { AxiosResponse } from "axios";


export const PostRefresh = async (
  refreshToken: string
): Promise<any> => {
  console.log("전송 데이터", refreshToken);

  try {
    const accessToken = localStorage.getItem('accessToken'); // 또는 쿠키 등에서 꺼낼 수도 있음

    const response: AxiosResponse<any> = await axiosInstance.post(
      `api/auth/refresh`,
      {
        refreshToken: refreshToken
        }
     
    );

    console.log(response.data);
    console.log(response.headers);

    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
