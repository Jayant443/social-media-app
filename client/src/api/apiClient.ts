import axios from "axios";
import { authRoute, communityRoute, postRoute, userRoute, voteRoute, commentRoute } from "./routes";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/user";
import type { Community, CommunityMember, CommunityResponse } from "../types/community";
import type { Post, PostResponse } from "../types/post";
import type { VoteResponse, VoteValue } from "../types/vote";
import type { Comment } from "../types/comment";

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

export const updateUser = async (formData: FormData): Promise<User> => {
    const res = await axios.patch(`${userRoute}/update`, formData, getConfig());
    return res.data;
}

export const getRandomCommunities = async (): Promise<Community[]> => {
    const res = await axios.get(`${communityRoute}/discover/random`, getConfig());
    return res.data;
}

export const getCommunityMemberCount = async (communityId: string | null): Promise<number> => {
    const res = await axios.get<number>(`${communityRoute}/${communityId}/members/count`, getConfig());
    return res.data;
}

export const getCommunityById = async (communityId: string): Promise<CommunityResponse> => {
    const res = await axios.get(`${communityRoute}/${communityId}`, getConfig());
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

export const getCommunityPosts = async (id: string): Promise<PostResponse[]> => {
    const res = await axios.get(`${communityRoute}/${id}/posts`, getConfig());
    return res.data;
}

export const getCommunityMembers = async (communityId: string): Promise<CommunityMember[]> => {
    const res = await axios.get(`${communityRoute}/${communityId}/members`, getConfig());
    return res.data;
}

export const getUserById = async (id: string): Promise<User> => {
    const res = await axios.get(`${userRoute}/${id}/get`, getConfig());
    return res.data;
}

export const getRecentPosts = async (): Promise<Post[]> => {
    const res = await axios.get(`${postRoute}/recent`, getConfig());
    return res.data;
};

export const getUserByUsername = async (username: string): Promise<User> => {
    const res = await axios.get(`${userRoute}/${username}`, getConfig());
    return res.data;
};

export const getUserPosts = async (userId: string): Promise<PostResponse[]> => {
    const res = await axios.get(`${userRoute}/${userId}/posts`, getConfig());
    return res.data;
};

export const getCommunityByName = async (name: string): Promise<CommunityResponse> => {
    const res = await axios.get(`${communityRoute}/name/${name}`, getConfig());
    return res.data;
}

export const createPost = async (communityId: string, formData: FormData): Promise<PostResponse> => {
    const res = await axios.post(`${postRoute}/${communityId}/create`, formData, getConfig());
    return res.data;
}

export const joinCommunity = async (communityId: string): Promise<CommunityMember> => {
    const res = await axios.post(`${communityRoute}/${communityId}/join`, null, getConfig());
    return res.data;
}

export const leaveCommunity = async (communityId: string): Promise<boolean> => {
    const res = await axios.post(`${communityRoute}/${communityId}/leave`, null, getConfig());
    return res.data;
}

export const voteOnPost = async (postId: string, value: VoteValue): Promise<VoteResponse> => {
    const response = await axios.post(`${voteRoute}/post/${postId}/vote`, null, { ...getConfig(), params: { value } },);
    return response.data;
};

export const voteOnComment = async (commentId: string, value: VoteValue): Promise<VoteResponse> => {
    const response = await axios.post(`${voteRoute}/comment/${commentId}/vote`, null, { ...getConfig(), params: { value } });
    return response.data;
};

export const getPostById = async (postId: string): Promise<Post> => {
    const res = await axios.get(`${postRoute}/${postId}`, getConfig());
    return res.data;
}

export const getTopComments = async (postId: string): Promise<Comment[]> => {
    const res = await axios.get(`${commentRoute}/post/${postId}`, getConfig());
    return res.data;
}

export const getCommentReplies = async (commentId: string): Promise<Comment[]> => {
    const res = await axios.get(`${commentRoute}/${commentId}/replies`, getConfig());
    return res.data;
}

export const postComment = async (postId: string, body: string): Promise<Comment> => {
    const res = await axios.post(`${commentRoute}/${postId}/comment`, null, { ...getConfig(), params: { body } });
    return res.data;
}

export const postReply = async (postId: string, commentId: string, reply: string): Promise<Comment> => {
    const res = await axios.post(`${commentRoute}/${postId}/comment/${commentId}/reply`, null, { ...getConfig(), params: { reply } });
    return res.data;
}

export const savePost = async (postId: string): Promise<any> => {
    const res = await axios.post(`${postRoute}/save`, { post_id: postId }, getConfig());
    return res.data;
}

export const unsavePost = async (postId: string): Promise<any> => {
    const res = await axios.delete(`${postRoute}/unsave/${postId}`, getConfig());
    return res.data;
}

export const getSavedPostIds = async (): Promise<string[]> => {
    const res = await axios.get(`${postRoute}/saved-ids`, getConfig());
    return res.data;
}

export const getSavedPosts = async (): Promise<Post[]> => {
    const res = await axios.get(`${postRoute}/saved_posts`, getConfig());
    return res.data;
}

export const deletePost = async (postId: string): Promise<PostResponse> => {
    const res = await axios.delete(`${postRoute}/${postId}`, getConfig());
    return res.data;
}

export const deleteComment = async (commentId: string): Promise<boolean> => {
    const res = await axios.delete(`${commentRoute}/${commentId}`, getConfig());
    return res.data;
}

export const search = async (query: string): Promise<{ users: User[], posts: Post[], communities: Community[] }> => {
    const res = await axios.get(`${userRoute}/search`, { params: { query } });
    return res.data;
} 