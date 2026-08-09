import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      // อย่า replace headers ทั้งก้อน — จะทำให้ FormData เสีย boundary ได้
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const errorMessage = error.response?.data?.error;
      if (
        error.response?.status === 401 &&
        typeof errorMessage === "string" &&
        errorMessage.includes("Unauthorized")
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
      }
      return Promise.reject(error);
    },
  );
}

export default jwtInterceptor;
