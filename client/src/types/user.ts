export interface User {
    id: string,
    username: string,
    email: string,
    avatar_url: string,
    bio: string,
    is_active: boolean,
    is_admin: boolean,
    created_at: string,
    updated_at: string
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
    access_token: string,
    token_type: string
}