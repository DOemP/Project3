import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config/config";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const doLogin = async () => {
    const response = await fetch(`${config.endpoint}/Users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    
    if (!data.token) {
      alert('Login failed');
      return;
    }

    // set token to local storage
    localStorage.setItem('tokenUser', data.token);
    localStorage.setItem('username', data.name); 
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);
    doLogin();
  }

  return (
    <div className="container-fluid login-page d-flex justify-content-center align-items-center">
      <div className="row login-container">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img
            src="https://booking-sb.vercel.app/assets/signin-goANgg1d.svg"
            alt="Illustration"
            className="img-fluid"
          />
        </div>

        <div className="col-md-6 p-5">
          <h2 className="mb-4">Welcome back</h2>
          <p>
            New here? <a href="/signup">Create an account</a>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" >Enter email id</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" >Enter password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3 d-sm-flex justify-content-between">
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="form-check-input"
                />
                <label htmlFor="remember-me" className="form-check-label">
                  Remember me?
                </label>
              </div>
              <a href="/forgot-password" className="forgot-pass">
                Forgot password?
              </a>
            </div>

            <button type="submit"
              className="btn btn-primary w-100 mb-3"
            >Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
