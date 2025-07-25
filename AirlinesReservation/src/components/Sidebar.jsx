import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebara">
            <h2>Admin</h2>
            <ul>
                <li><Link to="/admin/users">User Management</Link></li>
                <li><Link to="/admin/flights">Flight Management</Link></li>
                <li><Link to="/admin/flightTime">FlightTime Management</Link></li>
                <li><Link to="/admin/seats">Seat Management</Link></li>
                <li><Link to="/admin/tickets">Ticket Management</Link></li>
                <li><Link to="/admin/orders">Orders Management</Link></li>
                <li><Link to="/admin/orderDetails">OrderDetails Management</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
