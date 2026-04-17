import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import './Feed.css';
import CreatePostForm from "../components/CreatePostForm";
import type { User } from "../types/user";
import { getRandomCommunities, getRecentPosts, getUser } from "../api/apiClient";
import type { CommunityResponse } from "../types/community";
import { formatDate } from "../utils/formatDate";
import CommunityPage from "../components/CommunityPage";
import { FiArrowLeft } from "react-icons/fi";
import CreateCommunityForm from "../components/CreateCommunityForm";
import type { Post } from "../types/post";
import PostCard from "../components/PostCard";

function Feed() {
    const [feedDisplay, setFeedDisplay] = useState<string>("feed");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserCommunities, setCurrentUserCommunities] = useState<CommunityResponse[]>([]);
    const [currentCommunityDisplay, setCurrentCommunityDisplay] = useState<CommunityResponse | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function getProfile() {
            const user: User = await getUser();
            user.created_at = formatDate(user.created_at);
            setCurrentUser(user);
        }
        async function fetchCommunities() {
            const communities: CommunityResponse[] = await getRandomCommunities();
            setCurrentUserCommunities(communities);
        }
        async function fetchPosts() {
            const data = await getRecentPosts();
            setPosts(data);
        }
        fetchPosts();
        getProfile();
        fetchCommunities();
    }, []);

    return (
        <>
            <div className="container">
                <Navbar currentUser={currentUser} setFeedDisplay={(el: string) => setFeedDisplay(el)} />
                <main className="main-layout">
                    {(<button className="back-btn" onClick={() => setFeedDisplay("feed")}><FiArrowLeft /></button>)}
                    {feedDisplay === "feed" && (<div className="feed-posts">
                        {posts.map(post => (<PostCard key={post.id} post={post} />))}
                    </div>
                    )}
                    {feedDisplay === "create-post" && <CreatePostForm onCancel={() => setFeedDisplay("feed")} />}
                    {feedDisplay === "community" && <CommunityPage community={currentCommunityDisplay} currentUser={currentUser} />}
                    {feedDisplay === "create-community" && <CreateCommunityForm onCancel={() => setFeedDisplay("feed")} />}
                    <SideBar setFeed={(el: string) => setFeedDisplay(el)} setCurrentCommunity={(community) => setCurrentCommunityDisplay(community)} communities={currentUserCommunities} />
                </main>
            </div>
        </>
    );
}

export default Feed;