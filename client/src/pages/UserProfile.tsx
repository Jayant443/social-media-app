import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import type { User } from "../types/user";
import type { Post, PostResponse } from "../types/post";
import { getUserByUsername, getUserPosts, getCommunityById } from "../api/apiClient";
import { formatDate } from "../utils/formatDate";
import PostCard from "../components/PostCard";
import EditProfile from "../components/EditProfile";
import type { LayoutContext } from "../App";

function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const { currentUser } = useOutletContext<LayoutContext>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [redditAge, setRedditAge] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        let isActive = true;
        async function fetchUserData() {
            if (!username) return;
            setLoading(true);
            try {
                const userData = await getUserByUsername(username);
                if (!isActive) return;
                const created = new Date(userData.created_at);
                const now = new Date();
                const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
                setRedditAge(months < 0 ? 0 : months);
                userData.created_at = formatDate(userData.created_at);
                setUser(userData);
                try {
                    const userPosts: PostResponse[] = await getUserPosts(userData.id);
                    const totalVotes = userPosts.reduce((sum, post) => sum + post.votes_score, 0);
                    setTotalVotes(totalVotes);
                    const uniqueCommunityIds = [...new Set(userPosts.map(p => p.community_id))];
                    const communityMap = new Map<string, string>();
                    await Promise.all(uniqueCommunityIds.map(async (cid) => {
                        try {
                            const community = await getCommunityById(cid);
                            communityMap.set(cid, community.name);
                        } catch {
                            communityMap.set(cid, "unknown");
                        }
                    }));
                    const fullPosts: Post[] = userPosts.map((post) => ({
                        ...post,
                        author_username: userData.username,
                        author_avatar_url: userData.avatar_url,
                        community_name: communityMap.get(post.community_id) || ""
                    }));
                    if (isActive) setPosts(fullPosts);
                } catch {
                    if (isActive) setPosts([]);
                }
            } catch (err) {
                console.error("User not found", err);
                if (isActive) setUser(null);
            } finally {
                if (isActive) setLoading(false);
            }
        }
        fetchUserData();
        return () => { isActive = false; };
    }, [username]);
    if (loading) return <div className="profile-page"><p>Loading...</p></div>;
    if (!user) return <div className="profile-page"><p>User not found.</p></div>;
    return (
        <>

            <div className="profile-page">
                <div className="profile-header card">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {user.avatar_url ? (<img src={user.avatar_url} alt="avatar" />) : (<span>{user.username[0].toUpperCase()}</span>)}
                        </div>
                        <div className="profile-meta">
                            <h2>{user.username}</h2>
                            {user.bio && <p className="bio">{user.bio}</p>}
                        </div>
                        {isOwnProfile && (
                            <button className="edit-profile-btn" onClick={() => setShowEdit(true)}><FiEdit /> Edit</button>
                        )}
                    </div>
                </div>
                <div className="profile-stats card">
                    <div>
                        <strong>{posts.length}</strong>
                        <span>Posts</span>
                    </div>
                    <div>
                        <strong>{totalVotes}</strong>
                        <span>Votes</span>
                    </div>
                    <div>
                        <strong>{redditAge}m</strong>
                        <span>Super Reddit Age</span>
                    </div>
                </div>
                <div className="profile-posts">
                    <h3>Posts</h3>
                    {posts.length > 0 ? (
                        posts.map(post => (<PostCard key={post.id} post={post} />))
                    ) : (
                        <div className="empty-state card">No posts yet.</div>
                    )}
                </div>
            </div>
            {showEdit && user && (
                <EditProfile
                    user={user}
                    onClose={() => setShowEdit(false)}
                    onSave={(updatedUser) => {
                        updatedUser.created_at = formatDate(updatedUser.created_at);
                        setUser(updatedUser);
                    }}
                />
            )}
        </>
    );
}

export default UserProfile;