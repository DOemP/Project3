import React from "react";
import { format } from "date-fns";
import './Card.css';
import { addCart } from "../../components/Cart/addCart";

const OneWayCard = ({ flight }) => {
    const formattedDepartureDate = format(new Date(flight.schedule.departure.departure), 'HH:mm, dd MMM yyyy');
    const formattedArrivalDate = format(new Date(flight.schedule.departure.destination), 'HH:mm, dd MMM yyyy');
    return (
        <div className="border card mb-3">
            <div className="card-header d-sm-flex justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2 mb-sm-0">
                    <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icono-VNA.png"
                        alt="Logo"
                        className="logo me-2"
                    />
                    <h6 className="fw-normal mb-0 whitetxt">
                        <strong>Vietnam Airlines ({flight.details.flightNumber})</strong>
                    </h6>
                </div>
                <h6 className="fw-normal mb-0 whitetxt">
                    <strong>Travel Class: {flight.details.tripType}</strong>
                </h6>
            </div>

            <div className="card-body p-4 pb-0">
                <div className="row g-4 pb-3">
                    <div className="col-md-3 col-sm-4">
                        <h5 className="whitetxt"><strong>{formattedDepartureDate}</strong></h5>
                        <p>{flight.details.departure_city}</p>
                    </div>

                    <div className="col-md-3 col-sm-4 text-center my-sm-auto">
                        <div className="position-relative my-4">
                            <hr className="bg-primary opacity-50" />
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                        <h5 className="whitetxt"><strong>{formattedArrivalDate}</strong></h5>
                        <p>{flight.details.destination_city}</p>
                    </div>

                    <div className="col-md-3 text-md-end">
                        <h5 className="whitetxt">{flight.details.price} VND</h5>
                        <button className="btn btn-primary" onClick={() => addCart(flight)}>
                            <strong>Đặt Ngay</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneWayCard;