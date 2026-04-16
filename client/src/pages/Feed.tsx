import { useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import './Feed.css';
import CreatePostForm from "../components/CreatePostForm";
function Feed() {
    const [feedDisplay, setFeedDisplay] = useState<boolean>(true);

    return (
        <>
            <div className="container">
                <Navbar />
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