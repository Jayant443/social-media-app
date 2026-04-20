import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import type { Community, CommunityResponse } from "../types/community";
import type { Post, PostResponse } from "../types/post";
import { formatDate } from "../utils/formatDate";
import { getCommunityByName, getCommunityMemberCount, getCommunityMembers, getCommunityPostCount, getCommunityPosts, getUserById, joinCommunity, leaveCommunity } from "../api/apiClient";
import PostCard from "../components/PostCard";
import type { LayoutContext } from "../App";

function CommunityPage() {
    const { communityName } = useParams<{ communityName: string }>();
    const { currentUser } = useOutletContext<LayoutContext>();

    const [community, setCommunity] = useState<CommunityResponse | null>(null);
    const [communityDetails, setCommunityDetails] = useState<Community | null>(null);
    const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [joinLoading, setJoinLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const isOwner: boolean = community?.created_by === currentUser?.id;
    useEffect(() => {
        let isActive = true;
        async function fetchCommunity() {
            if (!communityName) return;
            setLoading(true);
            try {
                const data = await getCommunityByName(communityName);
                if (isActive) setCommunity(data);
            } catch (err) {
                console.error("Community not found", err);
                if (isActive) setCommunity(null);
            } finally {
                if (isActive) setLoading(false);
            }
        }
        fetchCommunity();
        return () => { isActive = false; };
    }, [communityName]);
    useEffect(() => {
        let isActive = true;
        if (!community?.id) return;

        async function getFullCommunityData(id: string) {
            try {
                const [memberCount, postCount] = await Promise.all([
                    getCommunityMemberCount(id),
                    getCommunityPostCount(id)
                ]);
                if (!isActive) return;
                const fullCommunity: Community = {
                    ...community!,
                    member_count: memberCount,
                    post_count: postCount,
                };
                setCommunityDetails(fullCommunity);
            } catch (err) {
                console.error(err);
                if (isActive) setCommunityDetails(null);
            }
        }

        async function fetchCommunityPosts(communityId: string) {
            try {
                const posts: PostResponse[] = await getCommunityPosts(communityId);
                const fullPosts: Post[] = await Promise.all(
                    posts.map(async (post) => {
                        const user = await getUserById(post.author_id);
                        return {
                            ...post,
                            author_username: user.username,
                            community_name: community?.name || ""
                        };
                    })
                );
                if (isActive) setCommunityPosts(fullPosts);
            } catch (err) {
                console.error(err);
                if (isActive) setCommunityPosts([]);
            }
        }
        async function checkMembership(communityId: string) {
            try {
                const members = await getCommunityMembers(communityId);
                const found = members.some((m) => m.user_id === currentUser?.id);
                if (isActive) setIsMember(found);
            } catch {
                if (isActive) setIsMember(false);
            }
        }
        getFullCommunityData(community.id);
        fetchCommunityPosts(community.id);
        if (currentUser) checkMembership(community.id);

        return () => { isActive = false; };
    }, [community, currentUser]);

    const handleJoin = async () => {
        if (!community?.id || joinLoading) return;
        setJoinLoading(true);
        try {
            await joinCommunity(community.id);
            setIsMember(true);
            setCommunityDetails(prev => prev ? { ...prev, member_count: prev.member_count + 1 } : prev);
        } catch (err) {
            console.error("Failed to join community", err);
        } finally {
            setJoinLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!community?.id || joinLoading) return;
        setJoinLoading(true);
        try {
            await leaveCommunity(community.id);
            setIsMember(false);
            setCommunityDetails(prev => prev ? { ...prev, member_count: Math.max(0, prev.member_count - 1) } : prev);
        } catch (err) {
            console.error("Failed to leave community", err);
        } finally {
            setJoinLoading(false);
        }
    };

    if (loading) {
        return <div className="community-page"><p>Loading...</p></div>;
    }

    if (!community) {
        return <div className="community-page"><p>Community not found.</p></div>;
    }

    return (
        <div className="community-page">
            <div className="community-header card">
                <div className="community-banner" style={{ backgroundImage: `url(${community?.banner_url})` }}></div>
                <div className="community-info">
                    <div className="community-avatar" style={{ backgroundImage: `url(${community?.icon_url})` }}>{!community?.icon_url && `r/`}</div>
                    <div><h2>r/{community?.name}</h2></div>
                </div>
                <div className="community-actions">{isOwner ? (
                    <>
                        <button className="edit-btn">Edit</button>
                        <button className="leave-btn" onClick={handleLeave} disabled={joinLoading}>Leave</button>
                    </>
                ) : (
                    isMember ? (
                        <button className="leave-btn" onClick={handleLeave} disabled={joinLoading}>{joinLoading ? "Leaving..." : "Leave"}</button>
                    ) : (
                        <button className="join-btn" onClick={handleJoin} disabled={joinLoading}>{joinLoading ? "Joining..." : "Join"}</button>
                    )
                )}</div>
            </div>
            <div className="community-stats card">
                <div><strong>{communityDetails?.member_count ? communityDetails?.member_count : 0}</strong><span>Members</span></div>
                <div><strong>{communityDetails?.post_count ? communityDetails?.post_count : 0}</strong><span>Posts</span></div>
                <div><strong>{community?.created_at ? formatDate(community?.created_at) : "Unknown"}</strong><span>Created</span></div>
            </div>
            <div className="community-about card">
                <h3>About Community</h3>
                <p>{community?.description}</p>
            </div>
            <div className="community-posts">
                {communityPosts.map(post => (<PostCard key={post.id} post={post} />))}
            </div>
        </div>
    );
}

export default CommunityPage;
