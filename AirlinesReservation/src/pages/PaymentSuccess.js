import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const amount = queryParams.get('amount');
    const name = queryParams.get('name');
    const departure_city = queryParams.get('departure_city');
    const destination_city = queryParams.get('destination_city');
    const ticketType = queryParams.get('ticketType');
    const quantity = queryParams.get('quantity');
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
    return (
        <section style={{ color: "white", height: "907px", display: "flex", justifyContent: "center", padding: "90px 0" }}>
            <div>
                <h1 style={{ fontSize: "40px", padding: "7px 0" }}>Payment Success</h1>
                <p style={{ color: "white", fontSize: "20px", padding: "7px 0" }}>Thank {name} for your payment</p>
                <h1 style={{ color: "white", fontSize: "18px", padding: "4px 0" }} >Ticket:{ticketType}</h1>
                <span style={{ color: "white", display: "flex" }}>
                    <h1 style={{ color: "white", fontSize: "18px", padding: "4px 0" }}>{departure_city}</h1> <span style={{ margin: "0 5px", padding: "4px 0", fontSize: "18px" }}>to</span> <h1 style={{ color: "white", fontSize: "18px", padding: "4px 0" }}>{destination_city}</h1>
                </span>
                <h1 style={{ color: "white", fontSize: "18px", padding: "4px 0" }}>Quantity:{quantity}</h1>
                <h1 style={{ color: "white", fontSize: "18px", padding: "4px 0" }}>Amount:{formattedAmount}</h1>
            </div>
        </section>
    );
}
export default PaymentSuccess;