import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import "./SignUp.css";

const Signup = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  // const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const navigate = useNavigate();

  const doRegister = async () => {
    const response = await fetch(`${config.endpoint}/Users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        dob: dob,
        // age: parseInt(age),
        password: password,
        gender: gender,
      })
    });

    const data = await response.json();

    if (!data.token) {
      alert('Registration failed');
      return;
    }

    // Save token to session storage
    sessionStorage.setItem('tokenRegister', data.token);
    navigate('/login');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    doRegister();
  };

  return (
    <div className="container-fluid signup-page d-flex justify-content-center align-items-center pt-5 pb-5">
      <div className="row signup-container">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img
            src="https://booking-sb.vercel.app/assets/signin-goANgg1d.svg"
            alt="Illustration"
            className="img-fluid"
          />
        </div>

        <div className="col-md-6 p-5">
          <h2 className="mb-4">Create new account</h2>
          <p>Already a member? <a href="/login">Log in</a></p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="form-control"
                required
              />
            </div>

            {/* <div className="form-group mb-3">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="form-control"
                required
              />
            </div> */}

            <div className="form-group mb-3">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="form-control"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email ID</label>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="keepSignedIn"
                className="form-check-input"
                checked={keepSignedIn}
                onChange={() => setKeepSignedIn(!keepSignedIn)}
              />
              <label htmlFor="keepSignedIn" className="form-check-label">
                Keep me signed in
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
