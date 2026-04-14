import axios from "axios";
import { authRoutes, userRoute } from "./routes";
import type { AuthResponse, RegisterRequest, User } from "../types/user";

const getConfig = () => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return config;
}

export const getUser = async (): Promise<User> => {
    const res = await axios.get(`${userRoute}/me`, getConfig());
    return res.data;
}

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    const res = await axios.post(
        `${authRoutes}/register`,
        formData,
        {
            headers: {},
        });
    return res.data;
}