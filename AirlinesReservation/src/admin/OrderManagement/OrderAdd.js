import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const [newOrder, setNewOrder] = useState({
        userId: 0,
        amount: 0,
        totalQuantity: 0,
        status: "Pending"
    });

   
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Users`); 
            if (response.ok) {
                const data = await response.json();
                setUsers(data.items); 
            } else {
                console.error("Failed to fetch users.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(); 
    }, []);

    const handleCreateOrder = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrder)
            });

            if (response.ok) {
                alert("Order added successfully!");
                navigate("/admin/orders");
                setNewOrder({ userId: 0, amount: 0, totalQuantity: 0, status: "Pending" });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to add order.'}`);
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div>
            <h2>Add New Order</h2>

            <select
                value={newOrder.userId}
                onChange={(e) => setNewOrder({ ...newOrder, userId: Number(e.target.value) })} 
            >
                <option value={0} disabled>Select a user</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Amount</h6>
            <input className="inputa"
                type="number"
                placeholder="Amount"
                value={newOrder.amount}
                onChange={(e) => setNewOrder({ ...newOrder, amount: Number(e.target.value) })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Total Quantity</h6>
            <input className="inputa"
                type="number"
                placeholder="Total Quantity"
                value={newOrder.totalQuantity}
                onChange={(e) => setNewOrder({ ...newOrder, totalQuantity: Number(e.target.value) })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Status</h6>
            <select
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
            >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
            </select>

            <button className="buttona" onClick={handleCreateOrder}>Add Order</button>
        </div>
    );
};

export default AddOrder;
