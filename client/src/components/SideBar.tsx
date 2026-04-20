import { useState, useEffect } from "react";
import type { CommunityResponse } from "../types/community";
import { joinCommunity } from "../api/apiClient";


function SideBar({ setFeed, setCurrentCommunity, communities, joinedCommunityIds }: { setFeed: (el:string) => void, setCurrentCommunity: (community: CommunityResponse) => void, communities: CommunityResponse[], joinedCommunityIds: Set<string> }) {
    const [joinedIds, setJoinedIds] = useState<Set<string>>(joinedCommunityIds);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        setJoinedIds(joinedCommunityIds);
    }, [joinedCommunityIds]);

    const handleJoin = async (communityId: string) => {
        if (loadingId) return;
        setLoadingId(communityId);
        try {
            await joinCommunity(communityId);
            setJoinedIds(prev => new Set(prev).add(communityId));
        } catch (err) {
            console.error("Failed to join community", err);
        } finally {
            setLoadingId(null);
        }
    };

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
                            {joinedIds.has(community.id) ? (
                                <button disabled className="joined-btn">Joined</button>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); handleJoin(community.id); }} disabled={loadingId === community.id}>
                                    {loadingId === community.id ? "Joining..." : "Join"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}

export default SideBar;