export interface CommunityResponse {
    id: string,
    name: string,
    description: string,
    banner_url: string,
    icon_url: string,
    created_by: string,
    is_private: boolean,
    is_restricted: boolean,
    created_at: string
}

export interface Community extends CommunityResponse {
    member_count: number,
    post_count: number,
}

export interface CommunityMember {
    id: string,
    user_id: string,
    community_id: string,
    role: string,
    joined_at: Date
}