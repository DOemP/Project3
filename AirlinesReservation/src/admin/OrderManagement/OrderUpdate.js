import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOrder = () => {
    const navigate = useNavigate();
    const { orderId } = useParams(); 
    const [users, setUsers] = useState([]);

    const [order, setOrder] = useState({
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

    const fetchOrder = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Orders/${orderId}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data);
            } else {
                console.error("Failed to fetch order.");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchUsers(); 
    }, [orderId]);

    const handleUpdateOrder = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });

            if (response.ok) {
                alert("Order updated successfully!");
                navigate("/admin/orders");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update order.'}`);
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    return (
        <div>
            <h2>Update Order</h2>

            <select
                value={order.userId}
                onChange={(e) => setOrder({ ...order, userId: Number(e.target.value) })} 
            >
                <option value={0} disabled>Select a user</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>

            <input className="inputa"
                type="number"
                placeholder="Amount"
                value={order.amount}
                onChange={(e) => setOrder({ ...order, amount: Number(e.target.value) })}
            />

            <input className="inputa"
                type="number"
                placeholder="Total Quantity"
                value={order.totalQuantity}
                onChange={(e) => setOrder({ ...order, totalQuantity: Number(e.target.value) })}
            />

            <select
                value={order.status}
                onChange={(e) => setOrder({ ...order, status: e.target.value })}
            >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
            </select>

            <button className="buttona" onClick={handleUpdateOrder}>Update Order</button>
        </div>
    );
};

export default UpdateOrder;
