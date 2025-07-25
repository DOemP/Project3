import React from "react";
import "./Pagination.css";

const Pagination = ({ flightsPerPage, totalFlights, paginate, currentPage }) => {
    const pageNumbers = [];

    // Tính tổng số trang
    for (let i = 1; i <= Math.ceil(totalFlights / flightsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
