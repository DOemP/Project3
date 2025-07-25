import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import '../css/FlightTimeManagement.css';

const FlightTimesList = () => {
    const [flightTimes, setFlightTimes] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlightTimes();
    }, [pageNumber, pageSize]);

    const fetchFlightTimes = async () => {
        try {
            const response = await fetch(`${config.endpoint}/FlightTimes?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFlightTimes(data.items); 
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching flight times:", error);
        }
    };

    const handleAddFlightTime = () => {
        navigate('/admin/flightTime/add');
    };

    const handleUpdateFlightTime = (flightTimeId) => {
        navigate(`/admin/flightTime/update/${flightTimeId}`);
    };

    const handleDeleteFlightTime = async (flightTimeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this flight time: " + flightTimeId);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/FlightTimes/${flightTimeId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setFlightTimes(flightTimes.filter(ft => ft.id !== flightTimeId));
            }
        } catch (error) {
            console.error("Error deleting flight time:", error);
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
            <h2>Flight Times List</h2>
            <button className="buttona" onClick={handleAddFlightTime}>Add Flight Time</button>
            {/* <h3>Flight Times List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flight ID</th>
                        <th>Departure Date</th>
                        <th>Arrival Date</th>
                        <th>Flight Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flightTimes.map((flightTime) => (
                        <tr key={flightTime.id}>
                            <td>{flightTime.id}</td>
                            <td>{flightTime.flightID}</td>
                            <td>{new Date(flightTime.departureDate).toLocaleString()}</td>
                            <td>{new Date(flightTime.arrivalDate).toLocaleString()}</td>
                            <td>{flightTime.flightType}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateFlightTime(flightTime.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteFlightTime(flightTime.id)}>Delete</button>
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

export default FlightTimesList;
