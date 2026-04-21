import { FiUser, FiBell, FiPlus, FiSearch } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';

function Navbar({ currentUser }: { currentUser: User | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
                        <div className="logo-icon">SR</div>
                        <div className="logo-text">Super Reddit</div>
                    </div>
                    <div className="search-container">
                        <FiSearch className='search-icon' size={24} />
                        <input type="text" placeholder="Search posts, communities..." />
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
                            {currentUser?.avatar_url ? (
                                <img src={currentUser.avatar_url} alt="avatar" className='avatar'/>
                            ) : (
                                <FiUser size={20} />
                            )}
                            <span>{currentUser?.username}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;