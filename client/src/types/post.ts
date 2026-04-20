export interface PostResponse {
    id: string,
    title: string,
    body: string | null,
    url: string | null,
    image_url: string | null,
    author_id: string,
    community_id: string,
    votes_score: number,
    comment_count: number,
    is_deleted: boolean,
    is_pinned: boolean,
    created_at: Date,
    updated_at: Date
}

export interface Post extends PostResponse {
    author_username: string,
    community_name: string
}

export interface PostRequest {
    title: string,
    body: string | null,
    url: string | null,
    image_url: string | null
}