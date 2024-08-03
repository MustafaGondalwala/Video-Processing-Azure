import axiosInstance from "./axiosConfig";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  return axiosInstance.post("/users/register", data);
};

export const loginUser = async (data: LoginData) => {
  return axiosInstance.post("/users/login", data);
};

export const getUser = async (token: string) => {
  return axiosInstance.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
