import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

const AddOrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    const [newOrderDetails, setNewOrderDetails] = useState({
        orderId: 0,
        quantity: 0,
        ticketId: 0,
        positionSeat: ""
    });

    // Fetch danh sách đơn hàng
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Orders`); 
            if (response.ok) {
                const data = await response.json();
                setOrders(data.items); 
            } else {
                console.error("Failed to fetch orders.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch danh sách vé
    const fetchTickets = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Tickets`); 
            if (response.ok) {
                const data = await response.json();
                setTickets(data.items); 
            } else {
                console.error("Failed to fetch tickets.");
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchTickets();
    }, []);

    const handleCreateOrderDetails = async () => {
        try {
            const response = await fetch(`${config.endpoint}/OrderDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrderDetails)
            });

            if (response.ok) {
                alert("Order details added successfully!");
                navigate("/admin/orderdetails");
                setNewOrderDetails({ orderId: 0, quantity: 0, ticketId: 0, positionSeat: "" });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to add order details.'}`);
            }
        } catch (error) {
            console.error("Error creating order details:", error);
        }
    };

    return (
        <div>
            <h2>Add New Order Details</h2>

            <select
                value={newOrderDetails.orderId}
                onChange={(e) => setNewOrderDetails({ ...newOrderDetails, orderId: Number(e.target.value) })} 
            >
                <option value={0} disabled>Select an order</option>
                {orders.map(order => (
                    <option key={order.id} value={order.id}>
                        {`Order ID: ${order.id}`}
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Quantity</h6>
            <input className="inputa"
                type="number"
                placeholder="Quantity"
                value={newOrderDetails.quantity}
                onChange={(e) => setNewOrderDetails({ ...newOrderDetails, quantity: Number(e.target.value) })}
            />
            <select
                value={newOrderDetails.ticketId}
                onChange={(e) => setNewOrderDetails({ ...newOrderDetails, ticketId: Number(e.target.value) })}
            >
                <option value={0} disabled>Select a ticket</option>
                {tickets.map(ticket => (
                    <option key={ticket.id} value={ticket.id}>
                        {`Ticket ID: ${ticket.id}`}
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Position Seat</h6>
            <input className="inputa"
                type="text"
                placeholder="Position Seat"
                value={newOrderDetails.positionSeat}
                onChange={(e) => setNewOrderDetails({ ...newOrderDetails, positionSeat: e.target.value })}
            />

            <button className="buttona" onClick={handleCreateOrderDetails}>Add Order Details</button>
        </div>
    );
};

export default AddOrderDetails;
