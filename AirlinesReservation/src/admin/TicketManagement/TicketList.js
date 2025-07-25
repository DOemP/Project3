import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3); 
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [pageNumber, pageSize]);

    const fetchTickets = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTickets(data.items); 
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleAddTicket = () => {
        navigate('/admin/ticket/add');
    };

    const handleUpdateTicket = (ticketId) => {
        navigate(`/admin/ticket/update/${ticketId}`);
    };

    const handleDeleteTicket = async (ticketId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ticket: " + ticketId);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/Tickets/${ticketId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setTickets(tickets.filter(ticket => ticket.id !== ticketId));
            }
        } catch (error) {
            console.error("Error deleting ticket:", error);
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
            <h2>Ticket List</h2>
            <button className="buttona" onClick={handleAddTicket}>Add Ticket</button>
            {/* <h3>Ticket List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flight ID</th>
                        <th>Trip Type</th>
                        <th>Ticket Type</th>
                        <th>Ticket Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.flightID}</td>
                            <td>{ticket.tripType}</td>
                            <td>{ticket.ticketType}</td>
                            <td>{ticket.ticketPrice}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateTicket(ticket.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
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

export default TicketList;
