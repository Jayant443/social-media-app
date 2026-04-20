import { useState } from "react";
import type { VoteValue, VoteTarget } from "../types/vote";
import { voteOnComment, voteOnPost } from "../api/apiClient";

interface UseVoteProps {
    targetId: string;
    targetType: VoteTarget;
    initialScore: number;
    initialVote?: VoteValue | null;
}

export const useVote = ({ targetId, targetType, initialScore, initialVote = null }: UseVoteProps) => {
    const [score, setScore] = useState(initialScore);
    const [currentVote, setCurrentVote] = useState<VoteValue | null>(initialVote);
    const [loading, setLoading] = useState(false);
    const vote = async (value: VoteValue) => {
        if (loading) return;
        setLoading(true);
        if (currentVote === value) {
            setScore(prev => prev - value);
            setCurrentVote(null);
        } else if (currentVote !== null) {
            setScore(prev => prev + (value - currentVote));
            setCurrentVote(value);
        } else {
            setScore(prev => prev + value);
            setCurrentVote(value);
        }
        try {
            const fn = targetType === "post" ? voteOnPost : voteOnComment;
            await fn(targetId, value);
        } catch (err) {
            console.log(err);
            setScore(initialScore);
            setCurrentVote(initialVote);
        } finally {
            setLoading(false);
        }
    };
    return { score, currentVote, vote, loading };
};