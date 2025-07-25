import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";

const UpdateFlightTime = () => {
    const navigate = useNavigate();
    const { flightTimeId } = useParams();
    const [flights, setFlights] = useState([]);

    const [flightTime, setFlightTime] = useState({
        FlightID: 0,
        DepartureDate: "",
        ArrivalDate: "",
        flightType: "Departure"
    });

    const fetchFlightTime = async () => {
        try {
            const response = await fetch(`${config.endpoint}/FlightTimes/${flightTimeId}`);
            if (response.ok) {
                const data = await response.json();
                setFlightTime(data);
            } else {
                console.error("Failed to fetch flight time.");
            }
        } catch (error) {
            console.error("Error fetching flight time:", error);
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`);
            const data = await response.json();

            console.log(data); // Kiểm tra cấu trúc của dữ liệu

            // Trích xuất mảng items từ dữ liệu trả về
            setFlights(data.items);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };
    useEffect(() => {
        fetchFlightTime();
        fetchFlights();
    }, [flightTimeId]);

    const handleUpdateFlightTime = async () => {
        try {
            const response = await fetch(`${config.endpoint}/FlightTimes/${flightTimeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(flightTime)
            });

            if (response.ok) {
                alert("Flight time updated successfully!");
                navigate("/admin/flightTime");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update flight time.'}`);
            }
        } catch (error) {
            console.error("Error updating flight time:", error);
        }
    };

    return (
        <div>
            <h2>Update Flight Time</h2>

            <select
                value={flightTime.FlightID}
                onChange={(e) => setFlightTime({ ...flightTime, FlightID: Number(e.target.value) })}
            >
                <option value={0} disabled>Select a flight</option>
                {flights.map(flight => (
                    <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} to {flight.destination}
                    </option>
                ))}
            </select>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Departure Date</h6>
            <input className="inputa"
                type="datetime-local"
                placeholder="Departure Date"
                value={flightTime.DepartureDate}
                onChange={(e) => setFlightTime({ ...flightTime, DepartureDate: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Arrival Date</h6>
            <input className="inputa"
                type="datetime-local"
                placeholder="Arrival Date"
                value={flightTime.ArrivalDate}
                onChange={(e) => setFlightTime({ ...flightTime, ArrivalDate: e.target.value })}
            />

            <select
                value={flightTime.flightType}
                onChange={(e) => setFlightTime({ ...flightTime, flightType: e.target.value })}
            >
                <option value="Departure">Departure</option>
                <option value="Return">Return</option>
            </select>

            <button className="buttona" onClick={handleUpdateFlightTime}>Update Flight Time</button>
        </div>
    );
};

export default UpdateFlightTime;
