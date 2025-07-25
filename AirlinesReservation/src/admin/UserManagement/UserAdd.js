import React, { useState } from "react";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import '../css/UserManagement.css'; 

const AddUser = () => {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        name: "",
        phone: "",
        password: "" ,
        email: "",
        age: "",
        gender: "Male",
        role: "User"
            
    });

    const handleCreateUser = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert("User added successfully!");
                navigate("/admin/users");

                setNewUser({ name: "", phone: "", email: "", age: "", gender: "Male", role: "User", password: "" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div>
            <h2>Add New User</h2>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Name</h6>
            <input className="inputa"
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
             <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Phone</h6>
            <input className="inputa"
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
             <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Email</h6>
            <input className="inputa"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
             <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Age</h6>
            <input className="inputa"
                type="number"
                placeholder="Age"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />
            <select
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
            >
                <option value="Male">Male</option>
                <option value="FeMale">FeMale</option>
            </select>
            <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Password</h6>
            <input className="inputa"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button className="buttona" style={{ marginLeft: "10px" }} onClick={handleCreateUser}>Add User</button>
        </div>
    );
};

export default AddUser;
