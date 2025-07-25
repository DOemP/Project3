import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../config/config";
import '../css/UserManagement.css';

const UpdateUser = () => {
    const { userId } = useParams(); 
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        role: "",
        password: ""
    });

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Users`);
            const data = await response.json();
            const selectedUser = data.items.find(user => user.id === parseInt(userId));
            console.log(data);
            setUser({
                ...selectedUser
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: userId,
                    ...user
                })
            });

            if (response.ok) {
                alert("User updated successfully!");
                navigate("/admin/users");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div>
            <h2>Update User</h2>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Name</h6>
            <input className="inputa"
                type="text"
                placeholder="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
             <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Phone</h6>
            <input className="inputa"
                type="text"
                placeholder="Phone"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Email</h6>
            <input className="inputa"
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Age</h6>
            <input className="inputa"
                type="number"
                placeholder="Age"
                value={user.age}
                onChange={(e) => setUser({ ...user, age: e.target.value })}
            />
            
            <select
                value={user.gender}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="FeMale">Female</option>
            </select>

            <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Password</h6>
            <input className="inputa"
                type="password" 
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button className="buttona" style={{marginLeft:"10px"}} onClick={handleUpdateUser}>Update User</button>
        </div>
    );
};

export default UpdateUser;
