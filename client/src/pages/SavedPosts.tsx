import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";
import { getSavedPosts } from "../api/apiClient";

function SavedPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSaved() {
            try {
                const fetched = await getSavedPosts();
                setPosts(fetched);
            } catch (err) {
                console.error("Failed to fetch saved posts", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSaved();
    }, []);

    if (loading) return <div className="card">Loading saved posts...</div>;

    return (
        <div className="feed-posts">
            <h2 style={{ alignSelf: 'flex-start', marginBottom: '20px', fontSize: '18px' }}>Saved Posts</h2>
            {posts.length === 0 ? (
                <div className="card" style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                    <p>You haven't saved any posts yet.</p>
                </div>
            ) : (posts.map(post => <PostCard key={post.id} post={post} />))}
        </div>
    );
}

export default SavedPosts;
