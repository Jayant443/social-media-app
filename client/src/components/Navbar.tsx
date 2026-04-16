import { FiUser, FiBell, FiPlus, FiSearch } from 'react-icons/fi';
import type { User } from '../types/user';

function Navbar({ currentUser }: { currentUser: User | null }) {
    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
                        <div className="logo-icon">SR</div>
                        <div className="logo-text">Super Reddit</div>
                    </div>
                    <div className="search-container">
                        <FiSearch className='search-icon' size={24} /><input type="text" placeholder="Search posts, communities..."/>
                    </div>
                    <div className="nav-actions">
                        <button className="icon-btn"><FiPlus size={24} /></button>
                        <button className="icon-btn"><FiBell size={24}/></button>
                        <div className="user-profile"><span><FiUser size={24}/></span><span>{currentUser?.username}</span></div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;