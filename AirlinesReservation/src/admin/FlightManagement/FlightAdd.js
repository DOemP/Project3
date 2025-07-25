import React, { useState } from "react";
import config from "../../config/config";
import '../css/FlightManagement.css';
import { useNavigate } from "react-router-dom";

const AddFlight = () => {
    const navigate = useNavigate();

    const [newFlight, setNewFlight] = useState({
        flightNumber: "",
        origin: "",
        destination: ""
    });

    const handleCreateFlight = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newFlight)
            });

            if (response.ok) {
                alert("Flight added successfully!");
                navigate("/admin/flights");

                setNewFlight({ flightNumber: "", origin: "", destination: ""});
            }
        } catch (error) {
            console.error("Error creating flight:", error);
        }
    };

    return (
        <div>
            <h2>Add New Flight</h2>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Flight Number</h6>
            <input className="inputa"
                type="text"
                placeholder="Flight Number"
                value={newFlight.flightNumber}
                onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Origin</h6>
            <input className="inputa"
                type="text"
                placeholder="Origin"
                value={newFlight.origin}
                onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Destination</h6>
            <input className="inputa"
                type="text"
                placeholder="Destination"
                value={newFlight.destination}
                onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
            />

            
            {/* <button className="buttona" onClick={handleCreateFlight}>Add Flight</button> */}

            {/* <input className="inputa"
                type="datetime-local"
                placeholder="Departure Date"
                value={newFlight.departureDate}
                onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })}
            />
            <input className="inputa"
                type="datetime-local"
                placeholder="Arrival Date"
                value={newFlight.arrivalDate}
                onChange={(e) => setNewFlight({ ...newFlight, arrivalDate: e.target.value })}
            /> */}
            <button className="buttona"  onClick={handleCreateFlight}>Add Flight</button>

        </div>
    );
};

export default AddFlight;
