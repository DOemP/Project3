import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import '../css/FlightManagement.css';

const SeatList = () => {
    const [seats, setSeats] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3); 
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSeats();
    }, [pageNumber, pageSize]);

    const fetchSeats = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Seats?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSeats(data.items); 
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching seats:", error);
        }
    };

    const handleAddSeat = () => {
        navigate('/admin/seat/add');
    };

    const handleUpdateSeat = (seatId) => {
        navigate(`/admin/seat/update/${seatId}`);
    };

    const handleDeleteSeat = async (seatId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this seat: " + seatId);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/Seats/${seatId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setSeats(seats.filter(seat => seat.id !== seatId));
            }
        } catch (error) {
            console.error("Error deleting seat:", error);
        }
    };

    // Chuyển trang
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
            <h2>Seat List</h2>
            <button className="buttona" onClick={handleAddSeat}>Add Seat</button>
            {/* <h3>Seat List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flight ID</th>
                        <th>Seat Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {seats.map((seat) => (
                        <tr key={seat.id}>
                            <td>{seat.id}</td>
                            <td>{seat.flightID}</td>
                            <td>{seat.seatNumber}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateSeat(seat.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteSeat(seat.id)}>Delete</button>
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

export default SeatList;
