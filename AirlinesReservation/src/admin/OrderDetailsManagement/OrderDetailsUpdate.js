import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
    const { orderDetailsId } = useParams(); 

    const [orderDetails, setOrderDetails] = useState({
        orderId: 0,
        quantity: 0,
        ticketId: 0,
        positionSeat: ""
    });

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

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`${config.endpoint}/OrderDetails/${orderDetailsId}`);
            if (response.ok) {
                const data = await response.json();
                setOrderDetails(data);
            } else {
                console.error("Failed to fetch order details.");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchTickets();
        fetchOrderDetails(); 
    }, [orderDetailsId]);

    const handleUpdateOrderDetails = async () => {
        try {
            const response = await fetch(`${config.endpoint}/OrderDetails/${orderDetailsId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                alert("Order details updated successfully!");
                navigate("/admin/orderdetails");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update order details.'}`);
            }
        } catch (error) {
            console.error("Error updating order details:", error);
        }
    };

    return (
        <div>
            <h2>Update Order Details</h2>

            <select
                value={orderDetails.orderId}
                onChange={(e) => setOrderDetails({ ...orderDetails, orderId: Number(e.target.value) })} 
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
                value={orderDetails.quantity}
                onChange={(e) => setOrderDetails({ ...orderDetails, quantity: Number(e.target.value) })}
            />
            <select
                value={orderDetails.ticketId}
                onChange={(e) => setOrderDetails({ ...orderDetails, ticketId: Number(e.target.value) })}
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
                value={orderDetails.positionSeat}
                onChange={(e) => setOrderDetails({ ...orderDetails, positionSeat: e.target.value })}
            />

            <button className="buttona" onClick={handleUpdateOrderDetails}>Update Order Details</button>
        </div>
    );
};

export default UpdateOrderDetails;
