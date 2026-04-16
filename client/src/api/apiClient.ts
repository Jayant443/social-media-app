import axios from "axios";
import { authRoutes, userRoute } from "./routes";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/user";
import type { Community } from "../types/community";

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

export const getUserJoinedCommunities = async (): Promise<Community[]> => {
    const res = await axios.get(`${userRoute}/me/communities`, getConfig());
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

export const login = async (userData: LoginRequest): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('username', userData.username);
    params.append('password', userData.password);
    const res = await axios.post(`${authRoutes}/login`,
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return res.data;
}