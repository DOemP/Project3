import React, { useState, useEffect } from "react";
import config from "../../config/config";
import '../css/FlightManagement.css';
import { useNavigate } from "react-router-dom";

const AddFlightTime = () => {
    const navigate = useNavigate();

    const [newFlightTime, setNewFlightTime] = useState({
        flightID: "",
        departureDate: "",
        arrivalDate: "",
        flightType: "Departure"
    });

    const [flightList, setFlightList] = useState([]);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`);
            const data = await response.json();

            console.log(data); // Kiểm tra cấu trúc của dữ liệu

            // Trích xuất mảng items từ dữ liệu trả về
            setFlightList(data.items);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };


    const handleCreateFlightTime = async () => {
        try {
            const response = await fetch(`${config.endpoint}/FlightTimes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newFlightTime)
            });

            if (response.ok) {
                alert("Flight time added successfully!");
                navigate("/admin/flightTime");

                setNewFlightTime({ flightID: "", departureDate: "", arrivalDate: "" });
            }
        } catch (error) {
            console.error("Error creating flight time:", error);
        }
    };

    return (
        <div>
            <h2>Add New Flight Time</h2>
            <select
                value={newFlightTime.flightID}
                onChange={(e) => setNewFlightTime({ ...newFlightTime, flightID: e.target.value })}
            >
                <option value="">Select Flight</option>
                {flightList.length > 0 ? (
                    flightList.map((flight) => (
                        <option key={flight.id} value={flight.id}>
                            {flight.flightNumber} - {flight.origin} to {flight.destination}
                        </option>
                    ))
                ) : (
                    <option disabled>No flights available</option>
                )}
            </select>

            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>DepartureDate</h6>
            <input className="inputa"
                type="datetime-local"
                value={newFlightTime.departureDate}
                onChange={(e) => setNewFlightTime({ ...newFlightTime, departureDate: e.target.value })}
                placeholder="Departure Date"
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>ArrivalDate</h6>
            <input className="inputa"
                type="datetime-local"
                value={newFlightTime.arrivalDate}
                onChange={(e) => setNewFlightTime({ ...newFlightTime, arrivalDate: e.target.value })}
                placeholder="Arrival Date"
            />

            <select
                value={newFlightTime.flightType}  
                onChange={(e) => setNewFlightTime({ ...newFlightTime, flightType: e.target.value })}  
            >
                <option value="Departure">Departure</option>
                <option value="Return">Return</option>
            </select>

            <button className="buttona" onClick={handleCreateFlightTime}>Add Flight Time</button>
        </div>
    );
};

export default AddFlightTime;
