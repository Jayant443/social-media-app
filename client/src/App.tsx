import './App.css';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CommunityPage from './pages/CommunityPage';
import CreatePost from './pages/CreatePost';
import CreateCommunity from './pages/CreateCommunity';
import UserProfile from './pages/UserProfile';
import PostPage from './pages/PostPage';
import SavedPosts from './pages/SavedPosts';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { getRandomCommunities, getUser, getUserJoinedCommunities, getSavedPostIds } from './api/apiClient';
import type { User } from './types/user';
import type { CommunityResponse } from './types/community';
import { formatDate } from './utils/formatDate';
import ProtectedRoute from './ProtectedRoute';

export interface LayoutContext {
    currentUser: User | null;
    communities: CommunityResponse[];
    joinedCommunityIds: Set<string>;
    savedPostIds: Set<string>;
    setSavedPostIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function Layout() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [communities, setCommunities] = useState<CommunityResponse[]>([]);
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set());
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [user, randomCommunities, joined, savedIds] = await Promise.all([
                    getUser(),
                    getRandomCommunities(),
                    getUserJoinedCommunities(),
                    getSavedPostIds()
                ]);
                user.created_at = formatDate(user.created_at);
                setCurrentUser(user);
                setCommunities(randomCommunities);
                setJoinedCommunityIds(new Set(joined.map(c => c.id)));
                setSavedPostIds(new Set(savedIds));
            } catch (err) {
                console.error("Failed to load layout data", err);
            }
        }
        fetchData();
    }, []);

    const ctx: LayoutContext = { currentUser, communities, joinedCommunityIds, savedPostIds, setSavedPostIds };

    return (
        <div className="container">
            <Navbar currentUser={currentUser} onOpenSidebar={() => setSidebarOpen(true)} />
            <main className="main-layout">
                <SideBar communities={communities} joinedCommunityIds={joinedCommunityIds} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Outlet context={ctx} />
                <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)}></div>
            </main>
        </div>
    );
}

function App() {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path='/' element={<Feed />} />
                        <Route path='/write' element={<CreatePost />} />
                        <Route path='/r/create' element={<CreateCommunity />} />
                        <Route path='/r/:communityName' element={<CommunityPage />} />
                        <Route path='/r/:communityName/comments/:postId' element={<PostPage />} />
                        <Route path='/user/:username' element={<UserProfile />} />
                        <Route path='/saved' element={<SavedPosts />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
