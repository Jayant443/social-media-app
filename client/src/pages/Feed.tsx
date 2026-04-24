import { useEffect, useState } from "react";
import './Feed.css';
import { getRecentPosts } from "../api/apiClient";
import type { Post } from "../types/post";
import PostCard from "../components/PostCard";

function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await getRecentPosts();
                setPosts(data);
            } catch (err) {
                console.error("Failed to fetch posts", err);
            }
        }
        fetchPosts();
    }, []);

    return (
        <div className="feed-posts">{posts.map(post => (<PostCard key={post.id} post={post} />))}</div>
    );
}

export default Feed;