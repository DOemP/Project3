import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import config from "../../config/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const doPasswordReset = async () => {
    try {
      const response = await fetch(`${config.endpoint}/Users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        alert("Failed to send reset link. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error sending password reset request:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doPasswordReset();
  };

  return (
    <div className="container-fluid forgot-password-page d-flex justify-content-center align-items-center">
      <div className="row forgot-password-container">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img
            src="https://booking-sb.vercel.app/assets/signin-goANgg1d.svg"
            alt="Illustration"
            className="img-fluid"
          />
        </div>

        <div className="col-md-6 p-5">
          <h2 className="mb-4">Forgot Your Password?</h2>
          <p>
            Enter the email address associated with an account.
          </p>

          {submitted ? (
            <div className="alert alert-success" role="alert">
              A password reset link has been sent to {email}.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="email">Enter your email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Send Reset Link
              </button>
            </form>
          )}

          <p className="mt-3">
            Remember your password? <Link to="/login">Go back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
