import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './layouts/header/Header';
import Footer from './layouts/footer/Footer';
import AdminDashboard from './admin/AdminDashboard';
import LoginForm from './admin/login/login';
import Test1 from './pages/Seats/Test';
import SeatSelection from './pages/Seats/testModal';
import Test from './pages/Seats/Test';
import Home from './pages/Home/Home';
import FlightDetail from './pages/Detail/FlightDetail';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Flightblog from './pages/Blog/Flight_blog';
// import SeatSelection from './pages/Seats/Seats';
import FlightList from './pages/FlightList/FlightList';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';


function MainApp() {

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const isLoginRoute = location.pathname === '/loginAdmin';
    const isLoggedIn = localStorage.getItem('token') !== null;
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot';
    return (
        <div>
            {!isAdminRoute && !isAuthRoute && !isLoginRoute && <Header />}
            <div className="content">
                <Routes>
                    {/* User Interface */}

                    <Route path="/" element={<Home />} />
                    {/* <Route path="/seat" element={<Seats />} /> */}
                    <Route path="/flight_Details" element={<FlightDetail />} />
                    <Route path="/flight_List" element={<FlightList />} />
                    <Route path="/Blogs" element={<Flightblog />} />
                    <Route path="/SeatSelect/:flightID" element={<SeatSelection />} />
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/seat" element={<Seats />} /> */}
                    <Route path="/flight_Details" element={<FlightDetail />} />
                    <Route path="/flight_List" element={<FlightList />} />
                    <Route path="/Blogs" element={<Flightblog />} />
                    <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                    <Route path="/PaymentError" element={<PaymentError />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    {/* Admin Dashboard */}
                    <Route path="/admin/*" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/loginAdmin" />} />

                    <Route path="/loginAdmin" element={<LoginForm />} />
                </Routes>
            </div>
            {!isAdminRoute && isAuthRoute && !isLoginRoute && <Footer />}
        </div>
    )
}

export default MainApp;
