import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import '../css/FlightManagement.css';

const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlights();
    }, [pageNumber, pageSize]);

    const fetchFlights = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Flights?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFlights(data.items || []); 
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const handleAddFlight = () => {
        navigate('/admin/flight/add');
    };

    const handleUpdateFlight = (flightId) => {
        navigate(`/admin/flight/update/${flightId}`);
    };

    const handleDeleteFlight = async (flightId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete this flight: ${flightId}?`);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/Flights/${flightId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setFlights(flights.filter(flight => flight.id !== flightId));
            }
        } catch (error) {
            console.error("Error deleting flight:", error);
        }
    };

    const goToNextPage = () => {
        if (pageNumber * pageSize < totalCount) {
            setPageNumber(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(prevPage => prevPage - 1);
        }
    };

    return (
        <div>

            <h2>Flight List</h2>
            <button className="buttona" onClick={handleAddFlight}>Add Flight</button>

            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flight Number</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(flights) && flights.map((flight) => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.origin}</td>
                            <td>{flight.destination}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateFlight(flight.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteFlight(flight.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p className="pa">
                    Page {pageNumber} of {Math.ceil(totalCount / pageSize)}
                </p>
            </div>
            <div>
                <button className="buttona" disabled={pageNumber === 1} onClick={goToPreviousPage}>Previous</button>
                <button className="buttona" disabled={pageNumber * pageSize >= totalCount} onClick={goToNextPage}>Next</button>
            </div>
        </div>
    );
};

export default FlightList;
