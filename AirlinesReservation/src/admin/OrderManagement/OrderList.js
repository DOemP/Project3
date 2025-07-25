import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3); 
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [pageNumber, pageSize]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Orders?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data.items);
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleAddOrder = () => {
        navigate('/admin/order/add');
    };

    const handleUpdateOrder = (orderId) => {
        navigate(`/admin/order/update/${orderId}`);
    };

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order: " + orderId);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/Orders/${orderId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.id !== orderId));
            }
        } catch (error) {
            console.error("Error deleting order:", error);
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
            <h2>Order List</h2>
            <button className="buttona" onClick={handleAddOrder}>Add Order</button>
            {/* <h3>Order List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Amount</th>
                        <th>Total Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userId}</td>
                            <td>{order.amount}</td>
                            <td>{order.totalQuantity}</td>
                            <td>{order.status}</td>
                            <td>
                                <button className="buttona" onClick={() => handleUpdateOrder(order.id)}>Update</button>
                                <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteOrder(order.id)}>Delete</button>
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

export default OrderList;
