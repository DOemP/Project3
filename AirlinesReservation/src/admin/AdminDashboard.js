import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './css/AdminDashboard.css';
import FlightList from './FlightManagement/FlightList';
import AddFlight from './FlightManagement/FlightAdd';
import UpdateFlight from './FlightManagement/FlightUpdate';
import Navbar from '../components/Navbar';
import UserList from './UserManagement/UserList';
import AddUser from './UserManagement/UserAdd';
import UpdateUser from './UserManagement/UserUpdate';
import FlightTimesList from './FlightTimesManagement/FlightTimeList';
import SeatList from './SeatManagement/SeatList';
import TicketList from './TicketManagement/TicketList';
import OrderList from './OrderManagement/OrderList';
import OrderDetailsList from './OrderDetailsManagement/OrderDetailsList';
import AddFlightTime from './FlightTimesManagement/FlightTimeAdd';
import AddSeat from './SeatManagement/SeatAdd';
import AddTicket from './TicketManagement/TicketAdd';
import AddOrder from './OrderManagement/OrderAdd';
import AddOrderDetails from './OrderDetailsManagement/OrderDetailsAdd';
import UpdateOrderDetails from './OrderDetailsManagement/OrderDetailsUpdate';
import UpdateSeat from './SeatManagement/SeatUpdate';
import UpdateFlightTime from './FlightTimesManagement/FlightTimeUpdate';
import UpdateTicket from './TicketManagement/TicketUpdate';
import UpdateOrder from './OrderManagement/OrderUpdate';
const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
                <Sidebar />
            <div className="main-content">
                <Navbar/>
                <Routes>
                    {/* User */}
                    <Route path="users" element={<UserList />} />
                    <Route path="user/add" element={<AddUser />} />
                    <Route path="user/update/:userId" element={<UpdateUser />} />

                    {/* Flight */}
                    <Route path="flights" element={<FlightList />} />
                    <Route path="flight/add" element={<AddFlight />} />
                    <Route path="flight/update/:flightId" element={<UpdateFlight />} />

                    {/* Flight Times */}
                    <Route path="flightTime" element={<FlightTimesList />} />
                    <Route path="flightTime/add" element={<AddFlightTime />} />
                    <Route path="flightTime/update/:flightTimeId" element={<UpdateFlightTime />} />

                    {/* Seats */}
                    <Route path="seats" element={<SeatList />} />
                    <Route path="seat/add" element={<AddSeat />} />
                    <Route path="seat/update/:seatId" element={<UpdateSeat />} />

                    {/* Ticket */}
                    <Route path="tickets" element={<TicketList />} />
                    <Route path="ticket/add" element={<AddTicket />} />
                    <Route path="ticket/update/:ticketId" element={<UpdateTicket />} />

                    {/* Order */}
                    <Route path="orders" element={<OrderList />} />
                    <Route path="order/add" element={<AddOrder />} />
                    <Route path="order/update/:orderId" element={<UpdateOrder />} />

                    {/* OrderDetails */}
                    <Route path="orderDetails" element={<OrderDetailsList />} />
                    <Route path="orderDetails/add" element={<AddOrderDetails />} />
                    <Route path="orderDetails/update/:orderDetailsId" element={<UpdateOrderDetails />} />

                    <Route path="" element={<h1>Admin Dashboard</h1>} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
