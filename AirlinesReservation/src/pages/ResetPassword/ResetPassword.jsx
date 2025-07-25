import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import config from "../../config/config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [token] = useState(new URLSearchParams(window.location.search).get("token"));

  const doPasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch(`${config.endpoint}/Users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        alert("Failed to reset password. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doPasswordReset();
  };

  return (
    <div className="container-fluid reset-password-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 p-5 form-container">
          <h2 className="mb-4">Reset Your Password</h2>
          <p>Enter your new password below.</p>

          {submitted ? (
            <div className="alert alert-success" role="alert">
              Your password has been reset successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Reset Password
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

export default ResetPassword;
