export interface Comment {
    id: string;
    post_id: string;
    parent_id: string | null;
    author_id: string;
    author_username: string;
    author_avatar_url: string | null;
    body: string;
    votes_score: number;
    created_at: string;
    updated_at: string;
    replies?: Comment[];
}
