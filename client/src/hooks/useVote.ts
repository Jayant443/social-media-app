import { useState, useEffect } from "react";
import type { VoteValue, VoteTarget } from "../types/vote";
import { voteOnPost, voteOnComment } from "../api/apiClient";

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
    useEffect(() => {
        setScore(initialScore);
    }, [initialScore]);
    useEffect(() => {
        setCurrentVote(initialVote ?? null);
    }, [initialVote]);
    const vote = async (value: VoteValue) => {
        if (loading) return;
        setLoading(true);
        const prevScore = score;
        const prevVote = currentVote;
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
            const result = await fn(targetId, value);
            if (result && typeof result.votes_score === "number") {
                setScore(result.votes_score);
            }
        } catch (err) {
            console.log(err);
            setScore(prevScore);
            setCurrentVote(prevVote);
        } finally {
            setLoading(false);
        }
    };
    return { score, currentVote, vote, loading };
};