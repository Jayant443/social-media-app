export interface PostResponse {
    id: string,
    author_id: string,
    community_id: string,
    votes_score: number,
    comment_count: number,
    is_deleted: boolean,
    is_pinned: boolean,
    created_at: Date,
    updated_at: Date
}