import React, { useEffect, useState } from "react";
import './Header.css';
import logo from '../../assets/image/logo_web.svg';
import { Link } from "react-router-dom";
import { Container } from 'react-bootstrap';
// index.js or App.js
import { useLocation } from 'react-router-dom';

const Header = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem('tokenUser');
        const storedUsername = localStorage.getItem('username');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (token && storedIsLoggedIn) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    return (
        <header>
            <Container>
                <div className="row">
                    <div className="header_h">
                        <div className="col-2">
                            <div className="logo_web">
                                <img src={logo} alt='Logo' />

                            </div>
                        </div>
                        <div className="col-6">
                            <div className="header_menu">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/flight_List">Flight List</Link></li>
                                    <li><Link to="/Blogs">Blogs</Link></li>

                                    {/* <li><a href="#">Contact</a></li> */}
                                </ul>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="header_open">
                                <div className="open1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon_search" height="20" width="20" viewBox="0 0 512 512"><path fill="#c1c7d2" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                                    {(location.pathname === '/flight_List' || location.pathname === '/flight_Details') && (
                                        <button className="btn_login_signup">
                                            <Link to="/flight_Details">Cart</Link>
                                        </button>
                                    )}
                                    {isLoggedIn ? (
                                        <>
                                            <p style={{ marginTop: "10px" }}>{username}</p>
                                            <button className="btn_login_signup" onClick={() => setIsLoggedIn(false)}>Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn_login_signup"><Link to="/login">Login</Link></button>
                                            <button className="btn_login_signup"><Link to="/signup"><svg xmlns="http://www.w3.org/2000/svg" className="icon_login_signup" height="14" width="14" viewBox="0 0 512 512"><path fill="#8e85e6" d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" /></svg>SignUp</Link></button>
                                        </>
                                    )}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Container>

        </header>




    );
};

export default Header;