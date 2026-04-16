

function SideBar({ setFeed }: { setFeed: () => void }) {
    return (
        <>
            <aside className="sidebar">
                <div className="side-card card">
                    <h3>Home</h3>
                    <p>Your personal Super Reddit frontpage. Come here to check in with your favorite communities.</p>
                    <button className="create-post-btn" onClick={setFeed}>Create Post</button>
                </div>
                <div className="side-card card">
                    <h3>Trending Communities</h3>
                    <div className="community-btn">
                        <span>r/Technology</span>
                        <button>Join</button>
                    </div>
                    <div className="community-btn">
                        <span>r/Computer Science</span>
                        <button>Join</button>
                    </div>
                    <div className="community-btn">
                        <span>r/Gaming</span>
                        <button>Join</button>
                    </div>
                    <div className="community-btn">
                        <span>r/Science</span>
                        <button>Join</button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default SideBar;