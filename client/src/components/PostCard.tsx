import { FiArrowUp, FiArrowDown, FiMessageSquare, FiShare, FiMoreHorizontal, FiBookmark, FiEyeOff, FiFlag, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { Post } from "../types/post";
import { formatDate } from "../utils/formatDate";
import { useVote } from "../hooks/useVote";
import { useNavigate } from "react-router-dom";
import { savePost, unsavePost, deletePost } from "../api/apiClient";
import type { LayoutContext } from "../App";

type Props = {
    post: Post;
};

function PostCard({ post }: Props) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { currentUser, savedPostIds, setSavedPostIds } = useOutletContext<LayoutContext>();
    const isSaved = savedPostIds.has(post.id);
    const isAuthor = currentUser?.id === post.author_id;

    const { score, currentVote, vote, loading } = useVote({
        targetId: post.id,
        targetType: "post",
        initialScore: post.votes_score,
    });

    const handlePostClick = () => {
        navigate(`/r/${post.community_name}/comments/${post.id}`);
    };

    const handleSaveToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isSaved) {
                await unsavePost(post.id);
                setSavedPostIds(prev => {
                    const next = new Set(prev);
                    next.delete(post.id);
                    return next;
                });
            } else {
                await savePost(post.id);
                setSavedPostIds(prev => new Set(prev).add(post.id));
            }
            setOpen(false);
        } catch (err) {
            console.error("Failed to toggle save", err);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deletePost(post.id);
            window.location.reload(); // Simple way to refresh the feed
        } catch (err) {
            console.error("Failed to delete post", err);
        }
    };

    return (
        <>
            <div className="post-card" >
                <div className="post-content">
                    <div className="post-options">
                        <button className="options-btn" onClick={() => setOpen(!open)}><FiMoreHorizontal /></button>
                        {open && (
                            <div className="options-menu">
                                <div className="option-item" onClick={handleSaveToggle}>
                                    <FiBookmark style={{ fill: isSaved ? "black" : "none" }} />
                                    <span>{isSaved ? "Unsave" : "Save"}</span>
                                </div>
                                {isAuthor && (
                                    <div className="option-item danger" onClick={handleDelete}>
                                        <FiTrash2 />
                                        <span>Delete</span>
                                    </div>
                                )}
                                <div className="option-item"><FiEyeOff /><span>Hide</span></div>
                                <div className="option-item danger"><FiFlag /><span>Report</span></div>
                            </div>
                        )}
                    </div>
                    <div className="post-meta">
                        <Link to={`/r/${post.community_name}`} className="subreddit clickable" style={{ textDecoration: 'none', color: '#333' }}>r/{post.community_name}</Link>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Posted by
                            <Link to={`/user/${post.author_username}`} className="clickable" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#888' }}>
                                {post.author_avatar_url ? (
                                    <img src={post.author_avatar_url} alt="avatar" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ff5100', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                        {post.author_username?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                u/{post.author_username}
                            </Link>
                            • {formatDate(post.created_at.toString())}
                        </span>
                    </div>
                    <div className="post-clickable-area" onClick={handlePostClick} style={{ cursor: "pointer" }}>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-body">{post.body}</p>
                    </div>
                    <div className="post-actions">
                        <div className="vote-box">
                            <button onClick={() => vote(1)} disabled={loading} style={{ color: currentVote === 1 ? "orange" : "inherit", background: "none", border: "none", cursor: "pointer" }}><FiArrowUp /></button>
                            <span>{score}</span>
                            <button onClick={() => vote(-1)} disabled={loading} style={{ color: currentVote === -1 ? "blue" : "inherit", background: "none", border: "none", cursor: "pointer" }}><FiArrowDown /></button>
                        </div>
                        <div className="action" onClick={handlePostClick} style={{ cursor: "pointer" }}>
                            <FiMessageSquare /><span>{post.comment_count} Comments</span>
                        </div>
                        <div className="action"><FiShare /><span>Share</span></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostCard;