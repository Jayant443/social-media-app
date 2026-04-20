export type VoteTarget = "post" | "comment";
export type VoteValue = 1 | -1;

export interface Vote {
  target_id: string;
  target_type: VoteTarget;
  value: VoteValue;
}

export interface VoteResponse {
  id: string;
  votes_score: number;
  [key: string]: any;
}
