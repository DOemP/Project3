import React from "react";
import OneWayCard from "../FlightItem/OneWayCard"; // Form cho One-Way
import RoundTripCard from "../FlightItem/RoundTripCard"; // Form cho Round-Trip

const FlightResults = ({ flights }) => {
    if (flights.length === 0) {
        return <p>Không tìm thấy chuyến bay.</p>;
    }

    return (
        <div className="vstack gap-4">
            {flights.map((flight) => {
                console.log(flight);
                if (flight.type === "one-way") {
                    return <OneWayCard key={flight.id} flight={flight} />;
                } else if (flight.type === "round-trip") {
                    return <RoundTripCard key={flight.id} flight={flight} />;
                } else {
                    return <p key={flight.id}>Loại chuyến bay không hợp lệ.</p>;
                }
            })}
        </div>
    );
};

export default FlightResults;
