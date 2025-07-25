import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../config/config";
import '../css/FlightManagement.css';

const UpdateFlight = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState({
        flightNumber: "",
        origin: "",
        destination: ""
    });

    useEffect(() => {
        fetchFlight();
    }, [flightId]);

    const fetchFlight = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights`);
            const data = await response.json();

            console.log(data); // Kiểm tra cấu trúc của dữ liệu

            // Trích xuất mảng items từ dữ liệu trả về
            const selectedFlight = data.items.find(flight => flight.id === parseInt(flightId));
            if (selectedFlight) {
                setFlight(selectedFlight); // Thiết lập thông tin chuyến bay
            } else {
                console.error("Flight not found");
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const handleUpdateFlight = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights/${flightId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: flightId,
                    ...flight
                })
            });

            if (response.ok) {
                alert("Flight updated successfully!");
                navigate("/admin/flights");
            } else {
                alert("Failed to update flight");
            }
        } catch (error) {
            console.error("Error updating flight:", error);
        }
    };

    return (
        <div>
            <h2>Update Flight</h2>
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Flight Number</h6>
            <input
                className="inputa"
                type="text"
                placeholder="Flight Number"
                value={flight.flightNumber}
                onChange={(e) => setFlight({ ...flight, flightNumber: e.target.value })}
            />
             <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Origin</h6>
            <input
                className="inputa"
                type="text"
                placeholder="Origin"
                value={flight.origin}
                onChange={(e) => setFlight({ ...flight, origin: e.target.value })}
            />
            <h6 style={{ marginTop: "10px", marginBottom: "-7px" }}>Destination</h6>
            <input
                className="inputa"
                type="text"
                placeholder="Destination"
                value={flight.destination}
                onChange={(e) => setFlight({ ...flight, destination: e.target.value })}
            />
            <button className="buttona" onClick={handleUpdateFlight}>Update Flight</button>
        </div>
    );
};

export default UpdateFlight;
