import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FlightResults from "../FlightResult/FlightResult";
import Pagination from "../Pagination/Pagination";
import "./FlightList.css";

const FlightList = () => {
    const location = useLocation();
    const { flights } = location.state || {}; // Optional chaining

    const [newflights, setNewFlights] = useState([]);

    useEffect(() => {
        if (flights && flights.length > 0) {
            console.log("Danh sách:", flights);
            const formattedFlights = flights.map((flight) => {
                return {
                    type: flight.type,
                    details: {
                        id: flight.id,
                        flightNumber: flight.flightNumber,
                        tripType: flight.tripType,
                        departure_city: flight.origin,
                        destination_city: flight.destination,
                        price: flight.ticketPrice
                    },
                    schedule: {
                        departure: {
                            departure: flight.departure.departureDate,
                            destination: flight.departure.arrivalDate
                        },
                        ...(flight.type === "round-trip" ? {
                            return: {
                                departure: flight.return.departureDate,
                                destination: flight.return.arrivalDate
                            }
                        } : {})
                    }
                };
            });
            setNewFlights(formattedFlights);
        }
    }, [flights]);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 5; // Number of flights per page

    // Calculate flights to display on the current page
    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    const currentFlights = newflights.slice(indexOfFirstFlight, indexOfLastFlight);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-sm-5">
            {newflights.length > 0 ? (
                <>
                    <FlightResults flights={currentFlights} />
                    <Pagination
                        flightsPerPage={flightsPerPage}
                        // totalFlights={newflights.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </>
            ) : (
                <p>No flights found. Please try another search.</p>
            )}
        </div>
    );
};

export default FlightList;