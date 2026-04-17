import type { CommunityResponse } from "../types/community";


function SideBar({ setFeed, setCurrentCommunity, communities }: { setFeed: (el:string) => void, setCurrentCommunity: (community: CommunityResponse) => void, communities: CommunityResponse[] }) {
    return (
        <>
            <aside className="sidebar">
                <div className="side-card card">
                    <h3>Home</h3>
                    <p>Your personal Super Reddit frontpage. Come here to check in with your favorite communities.</p>
                    <button className="create-post-btn" onClick={() => setFeed("create-post")}>Create Post</button>
                </div>
                <div className="side-card card">
                    <h3>Trending Communities</h3>
                    {communities.map(community => (
                        <div className="community-btn" key={community.id} onClick={() => setCurrentCommunity(community)}>
                            <span onClick={() => setFeed("community")}>r/{community.name}</span>
                            {<button>Join</button>}
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}

export default SideBar;