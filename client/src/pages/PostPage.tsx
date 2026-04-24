import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";
import { getPostById, getTopComments, postComment, getCommunityById } from "../api/apiClient";
import { formatDate } from "../utils/formatDate";

function PostPage() {
    const { communityName, postId } = useParams<{ communityName?: string, postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [topLevelReplyText, setTopLevelReplyText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        async function loadPostData() {
            if (!postId) return;
            setLoading(true);
            try {
                const fetchedPost = await getPostById(postId);
                let resolvedCommunityName = fetchedPost.community_name;
                if (!resolvedCommunityName && fetchedPost.community_id) {
                    if (communityName) {
                        resolvedCommunityName = communityName;
                    } else {
                        const community = await getCommunityById(fetchedPost.community_id);
                        resolvedCommunityName = community.name;
                    }
                }
                if (!isActive) return;
                setPost({
                    ...fetchedPost,
                    community_name: resolvedCommunityName || "",
                });
                const topComments = await getTopComments(postId);
                const formattedComments = topComments.map(c => ({ ...c, created_at: formatDate(c.created_at) }));
                if (isActive) {
                    setComments(formattedComments);
                }
            } catch (err) {
                console.error("Failed to load post data:", err);
            } finally {
                if (isActive) setLoading(false);
            }
        }
        loadPostData();
        return () => { isActive = false; };
    }, [postId, communityName]);

    const handleTopLevelSubmit = async () => {
        if (!topLevelReplyText.trim() || !postId) return;
        try {
            const newComment = await postComment(postId, topLevelReplyText);
            newComment.created_at = formatDate(newComment.created_at);
            newComment.replies = [];
            setComments([newComment, ...comments]);
            setTopLevelReplyText("");
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };
    if (loading) return <div className="card">Loading post...</div>;
    if (!post) return <div className="card">Post not found.</div>;

    return (
        <div className="post-page">
            <div className="post-container mb-4"><PostCard post={post} /></div>
            <div className="comments-section card">
                <h3>Comments</h3>
                <div className="top-level-reply-box">
                    <textarea className="reply-textarea" placeholder="Add a comment..." rows={3} value={topLevelReplyText} onChange={(e) => setTopLevelReplyText(e.target.value)} />
                    <div className="reply-actions mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="post-btn" onClick={handleTopLevelSubmit} disabled={!topLevelReplyText.trim()}>Comment</button>
                    </div>
                </div>
                <div className="comments-tree">
                    {comments.map(comment => (<CommentCard key={comment.id} comment={comment} />))}
                </div>
            </div>
        </div>
    );
}

export default PostPage;
