import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import './Feed.css';
function Feed() {
    return (
        <>
            <div className="container">
                <Navbar />
                <main className="main-layout">
                    <div className="feed-posts">

                    </div>
                    <SideBar />
                </main>
            </div>
        </>
    )
}

export default Feed;