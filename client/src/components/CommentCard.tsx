import { FiArrowUp, FiArrowDown, FiMessageSquare, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import type { Comment } from "../types/comment";
import { Link, useOutletContext } from "react-router-dom";
import { useVote } from "../hooks/useVote";
import { getCommentReplies, postReply, deleteComment } from "../api/apiClient";
import { formatDate } from "../utils/formatDate";
import type { LayoutContext } from "../App";
import { useState, useEffect } from "react";
import './CommentCard.css';

type Props = {
    comment: Comment;
};

function CommentCard({ comment }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies || []);
    const [hasFetchedReplies, setHasFetchedReplies] = useState(!!comment.replies && comment.replies.length > 0);

    const [showOptions, setShowOptions] = useState(false);
    const { currentUser } = useOutletContext<LayoutContext>();
    const isAuthor = currentUser?.id === comment.author_id;

    const { score, currentVote, vote, loading } = useVote({
        targetId: comment.id,
        targetType: "comment",
        initialScore: comment.votes_score || 0,
    });

    const countReplies = (replies?: Comment[]): number => {
        if (!replies || replies.length === 0) return 0;
        return replies.length + replies.reduce((acc, r) => acc + countReplies(r.replies), 0);
    };

    const totalReplies = countReplies(localReplies);

    useEffect(() => {
        let active = true;
        async function fetchReplies() {
            if (hasFetchedReplies) return;
            try {
                const fetchedReplies = await getCommentReplies(comment.id);
                if (active) {
                    const formatted = fetchedReplies.map(c => ({ ...c, created_at: formatDate(c.created_at) }));
                    setLocalReplies(formatted);
                    setHasFetchedReplies(true);
                }
            } catch (err) {
                console.error("Failed to load replies", err);
            }
        }
        fetchReplies();
        return () => { active = false; };
    }, [comment.id, hasFetchedReplies]);

    const handleReplySubmit = async () => {
        if (!replyText.trim() || !comment.post_id) return;
        try {
            const newReply = await postReply(comment.post_id, comment.id, replyText);
            newReply.created_at = formatDate(newReply.created_at);
            newReply.replies = [];
            setLocalReplies([...localReplies, newReply]);
            setReplyText("");
            setShowReplyBox(false);
            setCollapsed(false);
            setCollapsed(false);
        } catch (err) {
            console.error("Failed to post reply", err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteComment(comment.id);
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    return (
        <div className="comment-node">
            <div className="comment-main">
                <div className="comment-side">
                    {comment.author_avatar_url ? (
                        <img src={comment.author_avatar_url} alt="avatar" className="comment-avatar" />
                    ) : (
                        <div className="comment-avatar-fallback">
                            {comment.author_username?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                    {totalReplies > 0 && (
                        <div className={`thread-vertical-line ${collapsed ? 'collapsed' : ''}`} onClick={() => setCollapsed(!collapsed)} />
                    )}
                </div>
                <div className="comment-content-area">
                    <div className="comment-header">
                        <Link to={`/user/${comment.author_username}`} className="comment-author clickable">
                            <span className="author-name">{comment.author_username}</span>
                        </Link>
                        <span className="comment-meta">• {comment.created_at}</span>
                    </div>
                    <div className="comment-text">
                        {comment.body}
                    </div>
                    <div className="comment-actions">
                        <button onClick={() => vote(1)} disabled={loading} style={{ color: currentVote === 1 ? "orange" : "inherit" }} className="vote-btn"><FiArrowUp /></button>
                        <span className="vote-score">{score}</span>
                        <button onClick={() => vote(-1)} disabled={loading} style={{ color: currentVote === -1 ? "blue" : "inherit" }} className="vote-btn"><FiArrowDown /></button>
                        <button className="action-btn" onClick={() => setShowReplyBox(!showReplyBox)}>
                            <FiMessageSquare /> Reply
                        </button>
                        <div className="comment-more-options">
                            <button className="action-btn" onClick={() => setShowOptions(!showOptions)}>
                                <FiMoreHorizontal />
                            </button>
                            {showOptions && (
                                <div className="options-menu comment-menu">
                                    {isAuthor && (
                                        <div className="option-item danger" onClick={handleDelete}>
                                            <FiTrash2 />
                                            <span>Delete</span>
                                        </div>
                                    )}
                                    <div className="option-item"><span>Report</span></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showReplyBox && (
                        <div className="reply-box-container">
                            <textarea
                                className="reply-textarea"
                                placeholder="What are your thoughts?"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                            />
                            <div className="reply-actions">
                                <button className="cancel-btn" onClick={() => setShowReplyBox(false)}>Cancel</button>
                                <button className="post-btn" onClick={handleReplySubmit} disabled={!replyText.trim()}>Reply</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {totalReplies > 0 && (
                <div className="comment-replies-container">
                    {collapsed ? (
                        <div className="collapsed-replies-indicator">
                            <div className="curved-elbow"></div>
                            <button className="expand-replies-btn" onClick={() => setCollapsed(false)}>
                                + {totalReplies} more repl{totalReplies === 1 ? 'y' : 'ies'}
                            </button>
                        </div>
                    ) : (
                        <div className="comment-replies-list">
                            {localReplies.map((reply, index) => {
                                const isLast = index === localReplies.length - 1;
                                return (
                                    <div key={reply.id} className="reply-wrapper">
                                        <div className={`curved-elbow ${isLast ? 'last' : ''}`}></div>
                                        <CommentCard comment={reply} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentCard;
