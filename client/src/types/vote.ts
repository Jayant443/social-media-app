export type VoteTarget = "post" | "comment";
export type VoteValue = 1 | -1;

export interface Vote {
  target_id: string;
  target_type: VoteTarget;
  value: VoteValue;
}

export interface VoteResponse {
  id: string;
  vote_score: number;
}

export interface VoteResponse {
    id: string,
    user_id: string,
    target_id: string,
    target_type: VoteTarget,
    value: VoteValue,
    created_at: Date
}
