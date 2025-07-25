import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import '../css/UserManagement.css';

const UserList = () => {
    const [users, setUsers] = useState([]); 
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [pageNumber, pageSize]); 

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.endpoint}/Users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data.items); 
            setTotalCount(data.totalCount || 0); 
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAddUser = () => {
        navigate('/admin/user/add');
    };

    const handleUpdateUser = (UserId) => {
        navigate(`/admin/user/update/${UserId}`);
    };

    const handleDeleteUser = async (UserId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete user with ID: ${UserId}?`);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${config.endpoint}/Users/${UserId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setUsers(users.filter(User => User.id !== UserId));
            }
        } catch (error) {
            console.error("Error deleting User:", error);
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
            <h2>User List</h2>
            <button className="buttona" onClick={handleAddUser}>Add User</button>
            {/* <h3>User List</h3> */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>{user.email}</td>
                                <td>{user.age}</td>
                                <td>{user.gender}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="buttona" onClick={() => handleUpdateUser(user.id)}>Update</button>
                                    <button className="buttona" style={{ backgroundColor: "red" }} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
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

export default UserList;
