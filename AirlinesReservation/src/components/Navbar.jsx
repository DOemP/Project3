import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const adminName = localStorage.getItem('adminName') || 'Admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminName');

        navigate('/loginAdmin');
    };

    return (
        <div className="navbar">
            {/* <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div> */}
            <div className="admin-info">
                <span>Admin: {adminName}</span>
            </div>
            <button className="buttona" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
    );
};

export default Navbar;
