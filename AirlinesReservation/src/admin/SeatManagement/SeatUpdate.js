import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSeat = () => {
    const navigate = useNavigate();
    const { seatId } = useParams(); 
    const [flights, setFlights] = useState([]);

    const [seat, setSeat] = useState({
        flightID: 0,
        seatNumber: 0
        // isBook: "Available" 
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


    const fetchSeat = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Seats/${seatId}`);
            if (response.ok) {
                const data = await response.json();
                setSeat(data);
            } else {
                console.error("Failed to fetch seat.");
            }
        } catch (error) {
            console.error("Error fetching seat:", error);
        }
    };

    useEffect(() => {
        fetchSeat();
        fetchFlights(); 
    }, [seatId]);

    const handleUpdateSeat = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Seats/${seatId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(seat)
            });

            if (response.ok) {
                alert("Seat updated successfully!");
                navigate("/admin/seats");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update seat.'}`);
            }
        } catch (error) {
            console.error("Error updating seat:", error);
        }
    };

    return (
        <div>
            <h2>Edit Seat</h2>

            <select
                value={seat.flightID}
                onChange={(e) => setSeat({ ...seat, flightID: Number(e.target.value) })} 
            >
                <option value={0} disabled>Select a flight</option>
                {flights.map(flight => (
                    <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} to {flight.destination} 
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Seat Number</h6>
            <input className="inputa"
                type="number"
                placeholder="Seat Number"
                value={seat.seatNumber}
                onChange={(e) => setSeat({ ...seat, seatNumber: Number(e.target.value) })}
            />
            {/* <select
                value={seat.isBook}
                onChange={(e) => setSeat({ ...seat, isBook: e.target.value })}
            >
                <option value="Available">Available</option>
                <option value="Selected">Selected</option>
                <option value="Taken">Taken</option>
            </select> */}

            <button className="buttona" onClick={handleUpdateSeat}>Update Seat</button>
        </div>
    );
};

export default UpdateSeat;
