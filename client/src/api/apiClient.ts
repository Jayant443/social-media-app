import axios from "axios";
import { authRoute, communityRoute, userRoute } from "./routes";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/user";
import type { Community, CommunityResponse } from "../types/community";

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
        `${authRoute}/register`,
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
    const res = await axios.post(`${authRoute}/login`,
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return res.data;
}

export const getUserJoinedCommunities = async (): Promise<Community[]> => {
    const res = await axios.get(`${userRoute}/me/communities`, getConfig());
    return res.data;
}

export const getCommunityMemberCount = async (communityId: string | null): Promise<number> => {
    const res = await axios.get<number>(`${communityRoute}/${communityId}/members/count`, getConfig());
    return res.data;
}

export const getCommunityPostCount = async (communityId: string | null): Promise<number> => {
    const res = await axios.get<number>(`${communityRoute}/${communityId}/posts/count`, getConfig());
    return res.data;
}

export const createCommunity = async (formData: FormData): Promise<CommunityResponse> => {
    const res = await axios.post(`${communityRoute}/create`, formData, getConfig());
    return res.data;
}