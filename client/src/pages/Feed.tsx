import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import './Feed.css';
import CreatePostForm from "../components/CreatePostForm";
import type { User } from "../types/user";
import { getUser } from "../api/apiClient";

function Feed() {
    const [feedDisplay, setFeedDisplay] = useState<boolean>(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        function formatDate(joinDate: string): string {
            const d = new Date(joinDate);
            return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
        }

        async function getProfile() {
                const user: User = await getUser();
                user.created_at = formatDate(user.created_at);
                setCurrentUser(user);
        }

        getProfile();
    }, []);

    return (
        <>
            <div className="container">
                <Navbar currentUser={currentUser}/>
                <main className="main-layout">
                    {feedDisplay && (<div className="feed-posts">
                        <PostCard />
                        <PostCard />
                    </div>
                    )}
                    {!feedDisplay && <CreatePostForm onCancel={() => setFeedDisplay(true)}/>}
                    <SideBar setFeed={() => setFeedDisplay(false)} />
                </main>
            </div>
        </>
    );
}

export default Feed;