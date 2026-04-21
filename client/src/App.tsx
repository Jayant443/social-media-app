import './App.css';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CommunityPage from './pages/CommunityPage';
import CreatePost from './pages/CreatePost';
import CreateCommunity from './pages/CreateCommunity';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { getRandomCommunities, getUser, getUserJoinedCommunities } from './api/apiClient';
import type { User } from './types/user';
import type { CommunityResponse } from './types/community';
import { formatDate } from './utils/formatDate';
import './pages/Feed.css';
import ProtectedRoute from './ProtectedRoute';

export interface LayoutContext {
    currentUser: User | null;
    communities: CommunityResponse[];
    joinedCommunityIds: Set<string>;
}

function Layout() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [communities, setCommunities] = useState<CommunityResponse[]>([]);
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchData() {
            try {
                const [user, randomCommunities, joined] = await Promise.all([
                    getUser(),
                    getRandomCommunities(),
                    getUserJoinedCommunities()
                ]);
                user.created_at = formatDate(user.created_at);
                setCurrentUser(user);
                setCommunities(randomCommunities);
                setJoinedCommunityIds(new Set(joined.map(c => c.id)));
            } catch (err) {
                console.error("Failed to load layout data", err);
            }
        }
        fetchData();
    }, []);

    const ctx: LayoutContext = { currentUser, communities, joinedCommunityIds };

    return (
        <div className="container">
            <Navbar currentUser={currentUser} />
            <main className="main-layout">
                <Outlet context={ctx} />
                <SideBar communities={communities} joinedCommunityIds={joinedCommunityIds} />
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
                        <Route path='/submit' element={<CreatePost />} />
                        <Route path='/r/create' element={<CreateCommunity />} />
                        <Route path='/r/:communityName' element={<CommunityPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
