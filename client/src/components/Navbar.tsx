import { FiUser, FiBell, FiPlus, FiSearch, FiUsers, FiFileText, FiX, FiLogOut } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import { search } from '../api/apiClient';
import type { Community } from '../types/community';
import type { Post } from '../types/post';

function Navbar({ currentUser }: { currentUser: User | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ users: User[], posts: Post[], communities: Community[] }>({ users: [], posts: [], communities: [] });

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
    }
    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const res = await search(searchQuery);
            setSearchResults(res);
        } else {
            setSearchResults({ users: [], posts: [], communities: [] });
        }
    }
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults({ users: [], posts: [], communities: [] });
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setOpen(false); } }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <div className="logo-icon">D</div>
                        <div className="logo-text">Discuzz</div>
                    </div>
                    <div className="search-container">
                        <FiSearch className='search-icon' size={24} />
                        <input type="text" placeholder="Search posts, communities..." value={searchQuery} onChange={handleSearchChange} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} />
                        {searchQuery && <FiX className='clear-icon' onClick={clearSearch} />}

                        {(searchResults.posts.length > 0 || searchResults.communities.length > 0 || searchResults.users.length > 0) && (
                            <div className="search-results-dropdown">
                                {searchResults.communities.map(c => (
                                    <div key={c.id} className="search-result-item" onClick={() => { navigate(`/r/${c.name}`); clearSearch(); }}><FiUsers /> <span>r/{c.name}</span></div>
                                ))}
                                {searchResults.users.map(u => (
                                    <div key={u.id} className="search-result-item" onClick={() => { navigate(`/user/${u.username}`); clearSearch(); }}><FiUser /> <span>u/{u.username}</span></div>
                                ))}
                                {searchResults.posts.map(p => (
                                    <div key={p.id} className="search-result-item" onClick={() => { navigate(`/r/${p.community_name}/comments/${p.id}`); clearSearch(); }}><FiFileText /> <span>{p.title}</span></div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="nav-actions">
                        <div className="plus-dropdown" ref={dropdownRef}>
                            <button className="icon-btn" onClick={() => setOpen(prev => !prev)}><FiPlus size={24} /></button>
                            {open && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={() => { navigate('/submit'); setOpen(false); }}>Create Post</div>
                                    <div className="dropdown-item" onClick={() => { navigate('/r/create'); setOpen(false); }}>Create Community</div>
                                </div>
                            )}
                        </div>
                        <button className="icon-btn"><FiBell size={24} /></button>
                        <div className="user-profile" onClick={() => currentUser && navigate(`/user/${currentUser.username}`)}>
                            {currentUser?.avatar_url ? (<img src={currentUser.avatar_url} alt="avatar" className='avatar' />) : (<FiUser size={20} />)}
                            <span>{currentUser?.username}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout} title="Logout"><FiLogOut size={20} /></button>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;