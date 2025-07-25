import React, { useState, useEffect } from "react";
import config from "../../config/config";
import '../css/FlightManagement.css';
import { useNavigate } from "react-router-dom";

const AddSeat = () => {
    const navigate = useNavigate();

    const [newSeat, setNewSeat] = useState({
        flightID: "",
        seatNumber: ""
        // isBook: "Available"
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


    const handleCreateSeat = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Seats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newSeat)
            });

            if (response.ok) {
                alert("Seat added successfully!");
                navigate("/admin/seats");

                setNewSeat({ flightID: "", seatNumber: "" });
            }
        } catch (error) {
            console.error("Error creating seat:", error);
        }
    };

    return (
        <div>
            <h2>Add New Seat</h2>
            <select
                value={newSeat.flightID}
                onChange={(e) => setNewSeat({ ...newSeat, flightID: e.target.value })}
            >
                <option value="">Select Flight</option>
                {flightList.map((flight) => (
                    <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} to {flight.destination}
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Seat Number</h6>
            <input className="inputa"
                type="number"
                placeholder="Seat Number"
                value={newSeat.seatNumber}
                onChange={(e) => setNewSeat({ ...newSeat, seatNumber: e.target.value })}
            />
            {/* <h6 style={{marginTop:"10px",marginBottom:"-7px"}}>Status</h6>
            <select
                value={newSeat.isBook}
                onChange={(e) => setNewSeat({ ...newSeat, isBook: e.target.value })}
            >
                <option value="Available">Available</option>
                <option value="Selected">Selected</option>
                <option value="Taken">Taken</option>
            </select> */}

            <button className="buttona" style={{marginLeft:"15px"}} onClick={handleCreateSeat}>Add Seat</button>
        </div>
    );
};

export default AddSeat;
