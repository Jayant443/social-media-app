import { FiArrowUp, FiArrowDown, FiMessageSquare, FiShare, FiMoreHorizontal, FiBookmark, FiEyeOff, FiFlag } from "react-icons/fi";
import { useState } from "react";
import type { Post } from "../types/post";
import { formatDate } from "../utils/formatDate";

function PostCard({ post }: {post: Post}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="post-card" >
            <div className="post-content">
                <div className="post-options">
                    <button className="options-btn" onClick={() => setOpen(!open)}><FiMoreHorizontal /></button>
                    {open && (
                        <div className="options-menu">
                            <div className="option-item"><FiBookmark /><span>Save</span></div>
                            <div className="option-item"><FiEyeOff /><span>Hide</span></div>
                            <div className="option-item danger"><FiFlag /><span>Report</span></div>
                        </div>
                    )}
                </div>
                <div className="post-meta">
                    <span className="subreddit">r/{post.community_name}</span>
                    <span> Posted by u/{post.author_username} • {formatDate(post.created_at.toString())}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <div className="post-actions">
                    <div className="vote-box">
                        <FiArrowUp />
                        <span>{post.votes_score}</span>
                        <FiArrowDown />
                    </div>
                    <div className="action"><FiMessageSquare /><span>{post.comment_count} Comments</span></div>
                    <div className="action"><FiShare /><span>Share</span></div>
                </div>
            </div>
        </div>
    );
}

export default PostCard;