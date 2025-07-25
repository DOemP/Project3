import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";

const OrderDetailsList = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, [pageNumber, pageSize]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`${config.endpoint}/OrderDetails?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrderDetails(data.items);
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    const handleAddOrderDetail = () => {
        navigate('/admin/orderdetails/add');
    };

    const handleUpdateOrderDetail = (orderDetailId) => {
        navigate(`/admin/orderdetails/update/${orderDetailId}`);
    };

    const handleDeleteOrderDetail = async (orderDetailId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order detail: " + orderDetailId);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/OrderDetails/${orderDetailId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setOrderDetails(orderDetails.filter(detail => detail.id !== orderDetailId));
            }
        } catch (error) {
            console.error("Error deleting order detail:", error);
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
            <h2>Order Details List</h2>
            <button className="buttona" onClick={handleAddOrderDetail}>Add Order Detail</button>
            {/* <h3>Order Details List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Quantity</th>
                        <th>Ticket ID</th>
                        <th>Seat Position</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map((detail) => (
                        <tr key={detail.id}>
                            <td>{detail.id}</td>
                            <td>{detail.orderID}</td>
                            <td>{detail.quantity}</td>
                            <td>{detail.ticketId}</td>
                            <td>{detail.positionSeat}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateOrderDetail(detail.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteOrderDetail(detail.id)}>Delete</button>
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

export default OrderDetailsList;
