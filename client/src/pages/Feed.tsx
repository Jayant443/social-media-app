import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import './Feed.css';
import CreatePostForm from "../components/CreatePostForm";
import type { User } from "../types/user";
import { getCommunityByName, getRandomCommunities, getRecentPosts, getUser, getUserJoinedCommunities } from "../api/apiClient";
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
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set());

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
        async function fetchJoinedCommunities() {
            try {
                const joined = await getUserJoinedCommunities();
                setJoinedCommunityIds(new Set(joined.map(c => c.id)));
            } catch (err) {
                console.error(err);
            }
        }
        fetchPosts();
        getProfile();
        fetchCommunities();
        fetchJoinedCommunities();
    }, []);

    const handleCommunityClick = async (name: string) => {
        const community = await getCommunityByName(name);

        if (community) {
            setCurrentCommunityDisplay(community);
            setFeedDisplay("community");
        }
    };

    return (
        <>
            <div className="container">
                <Navbar currentUser={currentUser} setFeedDisplay={(el: string) => setFeedDisplay(el)} />
                <main className="main-layout">
                    {(<button className="back-btn" onClick={() => setFeedDisplay("feed")}><FiArrowLeft /></button>)}
                    {feedDisplay === "feed" && (<div className="feed-posts">
                        {posts.map(post => (<PostCard key={post.id} post={post} onCommunityClick={handleCommunityClick}/>))}
                    </div>
                    )}
                    {feedDisplay === "create-post" && <CreatePostForm onCancel={() => setFeedDisplay("feed")} />}
                    {feedDisplay === "community" && <CommunityPage community={currentCommunityDisplay} currentUser={currentUser} />}
                    {feedDisplay === "create-community" && <CreateCommunityForm onCancel={() => setFeedDisplay("feed")} />}
                    <SideBar setFeed={(el: string) => setFeedDisplay(el)} setCurrentCommunity={(community) => setCurrentCommunityDisplay(community)} communities={currentUserCommunities} joinedCommunityIds={joinedCommunityIds} />
                </main>
            </div>
        </>
    );
}

export default Feed;