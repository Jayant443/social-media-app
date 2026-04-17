import { FiUser, FiBell, FiPlus, FiSearch } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import type { User } from '../types/user';

function Navbar({ currentUser, setFeedDisplay }: { currentUser: User | null, setFeedDisplay: (el:string) => void }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setOpen(false); } }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
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
                                    <div className="dropdown-item">Create Post</div>
                                    <div className="dropdown-item" onClick={() => setFeedDisplay("create-community")}>Create Community</div>
                                </div>
                            )}
                        </div>
                        <button className="icon-btn"><FiBell size={24} /></button>
                        <div className="user-profile">
                            <span><FiUser size={24} /></span>
                            <span>{currentUser?.username}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;