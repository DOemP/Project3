import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronUp, faTh, faList, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './Flight_blog.module.css';

const FlightBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [sortOption, setSortOption] = useState('all');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [selectedView, setSelectedView] = useState('list');

    useEffect(() => {
        fetch('http://localhost:5223/api/Blogs')
            .then((response) => response.json())
            .then((data) => setBlogs(data))
            .catch((error) => console.error('Error fetching blogs:', error));
    }, []);

    const sortedBlogs = [...blogs].sort((a, b) => {
        if (sortOption === 'recent') {
            return new Date(b.posted_on) - new Date(a.posted_on);
        } else if (sortOption === 'oldest') {
            return new Date(a.posted_on) - new Date(b.posted_on);
        } else if (sortOption === 'az') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'za') {
            return b.name.localeCompare(a.name);
        }
        return 0; // default when 'all'
    });

    const filteredBlogs = sortedBlogs.filter(blog =>
        blog.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Adjust the totalItems and totalPages after filtering and sorting
    const totalItems = filteredBlogs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Use filteredBlogs for currentBlogs
    const currentBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to page 1 when searching
    };

    const handleCollapseToggle = (id) => {
        setIsCollapsed(isCollapsed === id ? null : id);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1); // Reset to page 1 when sorting changes
    };

    const handleViewSwitch = (view) => {
        
        setSelectedView(view);
        setCurrentPage(1); // Reset to page 1 when view changes

        if (view === 'grid') {
            setItemsPerPage(6);
        } else {
            setItemsPerPage(4);
        }
    };
    return (
        <main className={styles.pageBackground}>
            <section className={styles.filterBar}>
                <div className={styles.resultsInfo}>
                    <button
                        className={`${styles.btnlist} ${selectedView === 'list' ? 'active' : ''}`}
                        onClick={() => handleViewSwitch('list')}
                    >
                        <FontAwesomeIcon icon={faList} />
                    </button>
                    <span> </span>
                    <button
                        className={`${styles.btnlist} ${selectedView === 'grid' ? 'active' : ''}`}
                        onClick={() => handleViewSwitch('grid')}
                    >
                        <FontAwesomeIcon icon={faTh} />
                    </button>
                    <span> </span>
                    <span>
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                    </span>
                </div>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className={styles.searchButton}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                <div className={styles.sortDropdown}>
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="all">All</option>
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                    </select>
                </div>
            </section>
            <section className={styles.blogSection}>

                {selectedView === 'list' ? (
                    // List View: default
                    currentBlogs.map((blog) => (
                        <div key={blog.id} className={styles.blogItem}>
                            <div className={styles.blogImage}>
                                <img src={blog.image} alt={blog.name} className={styles.blogImage} />
                            </div>
                            <div className={styles.blogContent}>
                                <h2>{blog.name}</h2>
                                <p>{blog.description}</p>
                                <button
                                    className={styles.readMore}
                                    onClick={() => handleCollapseToggle(blog.id)}
                                >
                                    Posted on
                                    <FontAwesomeIcon icon={isCollapsed === blog.id ? faChevronUp : faChevronDown} />
                                </button>
                                <div className={`${styles.collapse} ${isCollapsed === blog.id ? styles.show : ''}`}>
                                    <p className={styles.timeblue}>{new Date(blog.posted_on).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Grid View: table view
                    <div className={styles.gridContainer}>
                        {currentBlogs.map((blog) => (
                            <div key={blog.id} className={styles.gridItem}>
                                <div className={styles.blogImage}>
                                    <img src={blog.image} alt={blog.name} className={styles.gridImage} />
                                </div>
                                <div className={styles.blogContent}>
                                    <h2>{blog.name}</h2>
                                    <p className={styles.timeblue}>{new Date(blog.posted_on).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.pagination}>
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={currentPage === index + 1 ? styles.activePage : ''}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        Next
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </section>
        </main>
    );
};

export default FlightBlog;
