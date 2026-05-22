import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CommunityResponse } from "../types/community";
import { joinCommunity } from "../api/apiClient";
import './Sidebar.css';

type SideBarProps = {
    communities: CommunityResponse[];
    joinedCommunityIds: Set<string>;
    isOpen?: boolean;
    onClose?: () => void;
};

function SideBar({ communities, joinedCommunityIds, isOpen = false, onClose }: SideBarProps) {
    const [joinedIds, setJoinedIds] = useState<Set<string>>(joinedCommunityIds);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const navigate = useNavigate();

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
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="side-card card">
                    <h3>Home</h3>
                    <p>Your personal Super Reddit frontpage. Come here to check in with your favorite communities.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="create-post-btn" onClick={() => { navigate('/write'); onClose?.(); }}>Create Post</button>
                        <button className="create-post-btn" onClick={() => { navigate('/r/create'); onClose?.(); }}>Create Community</button>
                        <button className="save-btn" style={{ width: '100%', height: '40px' }} onClick={() => { navigate('/saved'); onClose?.(); }}>Saved Posts</button>
                    </div>
                </div>
                <div className="side-card card">
                    <h3>Trending Communities</h3>
                    {communities.map(community => (
                        <div className="community-btn" key={community.id}>
                            <Link to={`/r/${community.name}`} onClick={onClose} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500, fontSize: '14px' }}>r/{community.name}</Link>
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
