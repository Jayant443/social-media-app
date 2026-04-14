export interface User {
    id: string,
    username: string,
    email: string,
    avatarUrl: string,
    bio: string,
    isActive: boolean,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string
}

export interface LoginRequest {
    username: string,
    password: string
}

export interface AuthResponse {
    accessToken: string,
    tokenType: string
}