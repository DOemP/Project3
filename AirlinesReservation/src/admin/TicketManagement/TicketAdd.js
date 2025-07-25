import React, { useState, useEffect } from "react";
import config from "../../config/config";
// import '../css/TicketManagement.css';
import { useNavigate } from "react-router-dom";

const AddTicket = () => {
    const navigate = useNavigate();

    const [newTicket, setNewTicket] = useState({
        flightID: "",
        ticketType: "OneWay", 
        tripType: "Popular",
        ticketPrice: ""
    });

    const [flightList, setFlightList] = useState([]);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`);
            const data = await response.json();
            setFlightList(data.items);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const handleCreateTicket = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTicket)
            });

            if (response.ok) {
                alert("Ticket added successfully!");
                navigate("/admin/tickets");

                setNewTicket({
                    flightID: "",
                    ticketType: "OneWay",
                    tripType: "Popular",
                    ticketPrice: ""
                });
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    return (
        <div>
            <h2>Add New Ticket</h2>
            <select
                value={newTicket.flightID}
                onChange={(e) => setNewTicket({ ...newTicket, flightID: e.target.value })}
            >
                <option value="">Select Flight</option>
                {flightList.map((flight) => (
                    <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} to {flight.destination}
                    </option>
                ))}
            </select>
            <select
                value={newTicket.ticketType}
                onChange={(e) => setNewTicket({ ...newTicket, ticketType: e.target.value })}
            >
                <option value="OneWay">One Way</option>
                <option value="RoundTrip">Round Trip</option>
                {/* <option value="MultiStage">Multi Stage</option> */}
            </select>
            <select
                value={newTicket.tripType}
                onChange={(e) => setNewTicket({ ...newTicket, tripType: e.target.value })}
            >
                <option value="Popular">Popular</option>
                <option value="Merchant">Merchant</option>
            </select>
            {/* <select
                value={newTicket.userType}
                onChange={(e) => setNewTicket({ ...newTicket, userType: e.target.value })}
            >
                <option value="Adult">Adult</option>
                <option value="Children">Children</option>
                <option value="Newborn">Newborn</option>
            </select> */}
            {/* <input className="inputa"
                type="number"
                placeholder="Member Of User"
                value={newTicket.memberOfUser}
                onChange={(e) => setNewTicket({ ...newTicket, memberOfUser: e.target.value })}
            /> */}
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Price</h6>
            <input className="inputa"
                type="number"
                placeholder="Ticket Price"
                value={newTicket.ticketPrice}
                onChange={(e) => setNewTicket({ ...newTicket, ticketPrice: e.target.value })}
            />

            <button className="buttona" style={{ marginLeft: "15px" }} onClick={handleCreateTicket}>Add Ticket</button>
        </div>
    );
};

export default AddTicket;
