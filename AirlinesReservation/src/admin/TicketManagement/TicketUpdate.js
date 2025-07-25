import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTicket = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [flights, setFlights] = useState([]);

    const [ticket, setTicket] = useState({
        flightID: 0,
        ticketType: "OneWay",
        tripType: "Popular",
        // userType: "Adult",
        // memberOfUser: 0,
        ticketPrice: 0
    });

    const fetchFlights = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`);
            const data = await response.json();
            setFlights(data.items);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const fetchTicket = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Tickets/${ticketId}`);
            if (response.ok) {
                const data = await response.json();
                setTicket(data);
            } else {
                console.error("Failed to fetch ticket.");
            }
        } catch (error) {
            console.error("Error fetching ticket:", error);
        }
    };

    useEffect(() => {
        fetchTicket();
        fetchFlights();
    }, [ticketId]);

    const handleUpdateTicket = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Tickets/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticket)
            });

            if (response.ok) {
                alert("Ticket updated successfully!");
                navigate("/admin/tickets");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update ticket.'}`);
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    return (
        <div>
            <h2>Update Ticket</h2>

            <select
                value={ticket.flightID}
                onChange={(e) => setTicket({ ...ticket, flightID: Number(e.target.value) })}
            >
                <option value={0} disabled>Select a flight</option>
                {flights.map(flight => (
                    <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} to {flight.destination}
                    </option>
                ))}
            </select>

            <select
                value={ticket.ticketType}
                onChange={(e) => setTicket({ ...ticket, ticketType: e.target.value })}
            >
                <option value="OneWay">One Way</option>
                <option value="RoundTrip">Round Trip</option>
                {/* <option value="MultiStage">Multi Stage</option> */}
            </select>

            <select
                value={ticket.tripType}
                onChange={(e) => setTicket({ ...ticket, tripType: e.target.value })}
            >
                <option value="Popular">Popular</option>
                <option value="Merchant">Merchant</option>
            </select>

            {/* <select
                value={ticket.userType}
                onChange={(e) => setTicket({ ...ticket, userType: e.target.value })}
            >
                <option value="Adult">Adult</option>
                <option value="Children">Children</option>
                <option value="Newborn">Newborn</option>
            </select>

            <input className="inputa"
                type="number"
                placeholder="Member of User"
                value={ticket.memberOfUser}
                onChange={(e) => setTicket({ ...ticket, memberOfUser: Number(e.target.value) })}
            /> */}
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Price</h6>
            <input className="inputa"
                type="number"
                placeholder="Ticket Price"
                value={ticket.ticketPrice}
                onChange={(e) => setTicket({ ...ticket, ticketPrice: Number(e.target.value) })}
            />

            <button className="buttona" onClick={handleUpdateTicket}>Update Ticket</button>
        </div>
    );
};

export default UpdateTicket;
