import React, { useEffect, useState } from 'react';
import './FlightDetail.css';
import './reset.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TravelerForm from './TravelerFom';
import { CloseCircleOutlined } from '@ant-design/icons';
import FareSummary from './FareSummary';
import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns';

const FlightDetail = () => {
    const [tickets, setTickets] = useState([]);

    const calculateHrDuration = (start, end) => {
        try {
            if (!start || !end) {
                throw new Error("Invalid date strings provided");
            }

            const startDate = parseISO(start);
            const endDate = parseISO(end);

            if (isNaN(startDate) || isNaN(endDate)) {
                throw new Error("Invalid date format");
            }

            return differenceInHours(endDate, startDate);
        } catch (error) {
            console.error("Error calculating duration:", error.message);
            return null;
        }
    };

    const calculateMsDuration = (start, end) => {
        try {
            if (!start || !end) {
                throw new Error("Invalid date strings provided");
            }

            const startDate = parseISO(start);
            const endDate = parseISO(end);

            if (isNaN(startDate) || isNaN(endDate)) {
                throw new Error("Invalid date format");
            }

            return differenceInMinutes(endDate, startDate) % 60;
        } catch (error) {
            console.error("Error calculating duration:", error.message);
            return null;
        }
    };

    useEffect(() => {
        const ticketData = sessionStorage.getItem('tickets');
        if (ticketData) {
            const parsedTickets = JSON.parse(ticketData);
            setTickets(parsedTickets);
        }
    }, []);

    const removeTicket = ({ index }) => {
        const newTickets = tickets.filter((_, i) => i !== index);
        setTickets(newTickets);
        sessionStorage.setItem('tickets', JSON.stringify(newTickets));
    };

    return (
        (tickets.length !== 0) ? [
            <section className='flight_detail_section'>
                <Container style={{ padding: "50px 0" }}>
                    <Row>
                        <Col xs={12} xl={9}>
                            <div className='flight_detail_wrap'>
                                {tickets.map((ticket, index) => (
                                    <div key={index} className='detail_wrap' style={{ borderRadius: "15px" }}>
                                        <div className='title_wrap' style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                                            <div className='img_wrap' style={{ padding: "0 5px" }}>
                                                <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 576 512" class="rtl-flip" height="81" width="81" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"></path>
                                                </svg>
                                            </div>
                                            <div className='detail_wrap ' style={{ padding: "0 13px" }}>

                                                <div className='main_title'>
                                                    <ul style={{ display: "flex", alignItems: "center" }}>
                                                        <li>
                                                            <h2 className="departure_city">{ticket?.details.departure_city}</h2>
                                                        </li>
                                                        <li>
                                                            <p style={{ padding: "0 10px", marginBottom: "0" }}>
                                                                <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"></path>
                                                                </svg>
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <h2 className='destination_city'>{ticket?.details.destination_city}</h2>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className='sub_title' style={{ padding: '5px 0' }}>
                                                    <ul style={{ display: "flex", alignItems: "center" }}>
                                                        <li className="_nav_item">
                                                            <span>{new Date(ticket?.schedule.departure.departure).toLocaleDateString()}</span>
                                                        </li>
                                                        <li className="nav_item">
                                                            <span>{calculateHrDuration(ticket.schedule.departure.departure, ticket.schedule.departure.destination)}h {calculateMsDuration(ticket.schedule.departure.departure, ticket.schedule.departure.destination)}m</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flight_wrap card">
                                            <div className='card_header' style={{ paddingBottom: "0" }}>
                                                <h6 className='title_card' style={{ fontWeight: 700, fontSize: "19px", lineHeight: 1.25, color: "#fff" }}>Travel Class: Economy</h6>
                                                <CloseCircleOutlined style={{ fontSize: '24px' }} onClick={() => removeTicket({ index })} />
                                            </div>

                                            <div className='outbound_flight'>
                                                <div className='card_body p4'>
                                                    <Row>
                                                        <Col md={3} className='col_in4_airline'>
                                                            <img className='logo' src="data:image/svg+xml,%3csvg%20id='logo-38'%20width='78'%20height='32'%20viewBox='0%200%2078%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M55.5%200H77.5L58.5%2032H36.5L55.5%200Z'%20class='ccustom'%20fill='%23FF7A00'%3e%3c/path%3e%3cpath%20d='M35.5%200H51.5L32.5%2032H16.5L35.5%200Z'%20class='ccompli1'%20fill='%23FF9736'%3e%3c/path%3e%3cpath%20d='M19.5%200H31.5L12.5%2032H0.5L19.5%200Z'%20class='ccompli2'%20fill='%23FFBC7D'%3e%3c/path%3e%3c/svg%3e" class="w-80px mb-3" />
                                                            <h6 className="airline mb-0">VietNam Airline</h6>
                                                            <h6 className="model mb-0">{ticket?.details.flight_number}</h6>
                                                        </Col>

                                                        <Col md={3} sm={4} className='col_departure_city'>
                                                            <h4 className='mb-2 city_name'>{ticket?.details.departure_city}</h4>
                                                            <h4 className='mb-2 time'> {new Date(ticket?.schedule.departure.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                                                            <p className='mb-2'>{new Date(ticket?.schedule.departure.departure).toLocaleDateString()}</p>
                                                        </Col>

                                                        <Col md={3} sm={4} className='col_flight_time'>
                                                            <div className='Detail'>
                                                                <span className='hour_wrap'>
                                                                    <span className='hours'>{calculateHrDuration(ticket.schedule.departure.departure, ticket.schedule.departure.destination)}</span>
                                                                    <span className='hours_text'>hr</span>
                                                                </span>
                                                                <span className='minutes_wrap'>
                                                                    <span className='minutes'>{calculateMsDuration(ticket.schedule.departure.departure, ticket.schedule.departure.destination)}</span>
                                                                    <span className='minutes_text'>min</span>
                                                                </span>
                                                            </div>
                                                            <div className='img_wrap'>
                                                                <hr className="line"></hr>
                                                                <div className='img'>
                                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="fa-fw rtl-flip" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M480 192H365.71L260.61 8.06A16.014 16.014 0 0 0 246.71 0h-65.5c-10.63 0-18.3 10.17-15.38 20.39L214.86 192H112l-43.2-57.6c-3.02-4.03-7.77-6.4-12.8-6.4H16.01C5.6 128-2.04 137.78.49 147.88L32 256 .49 364.12C-2.04 374.22 5.6 384 16.01 384H56c5.04 0 9.78-2.37 12.8-6.4L112 320h102.86l-49.03 171.6c-2.92 10.22 4.75 20.4 15.38 20.4h65.5c5.74 0 11.04-3.08 13.89-8.06L365.71 320H480c35.35 0 96-28.65 96-64s-60.65-64-96-64z"></path>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </Col>

                                                        <Col md={3} sm={4} className='col_destination_city'>
                                                            <h4 className='mb-2 city_name'>{ticket?.details.destination_city}</h4>
                                                            <h4 className='mb-2 time'> {new Date(ticket?.schedule.departure.destination).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                                                            <p className='mb-2'>{new Date(ticket?.schedule.departure.destination).toLocaleDateString()}</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            {ticket?.type === 'round-way' && (
                                                <>
                                                    <hr className='line' />

                                                    <div className='return_flight'>
                                                        <div className='card_body p4'>
                                                            <Row>
                                                                <Col md={3} className='col_in4_airline'>
                                                                    <img className='logo' src="data:image/svg+xml,%3csvg%20id='logo-38'%20width='78'%20height='32'%20viewBox='0%200%2078%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M55.5%200H77.5L58.5%2032H36.5L55.5%200Z'%20class='ccustom'%20fill='%23FF7A00'%3e%3c/path%3e%3cpath%20d='M35.5%200H51.5L32.5%2032H16.5L35.5%200Z'%20class='ccompli1'%20fill='%23FF9736'%3e%3c/path%3e%3cpath%20d='M19.5%200H31.5L12.5%2032H0.5L19.5%200Z'%20class='ccompli2'%20fill='%23FFBC7D'%3e%3c/path%3e%3c/svg%3e" />
                                                                    <h6 className="airline mb-0">VietNam Airline</h6>
                                                                    <h6 className="model mb-0">{ticket?.details.flight_number}</h6>
                                                                </Col>

                                                                <Col md={3} sm={4} className='col_departure_city'>
                                                                    <h4 className='mb-2 city_name'>{ticket?.details.destination_city}</h4>
                                                                    <h4 className='mb-2 time'> {new Date(ticket?.schedule.return.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                                                                    <p className='mb-2'>{new Date(ticket?.schedule.return.departure).toLocaleDateString()}</p>
                                                                </Col>

                                                                <Col md={3} sm={4} className='col_flight_time'>
                                                                    <div className='Detail'>
                                                                        <span className='hour_wrap'>
                                                                            <span className='hours'>{calculateHrDuration(ticket.schedule.return.departure, ticket.schedule.return.destination)}</span>
                                                                            <span className='hours_text'>hr</span>
                                                                        </span>
                                                                        <span className='minutes_wrap'>
                                                                            <span className='minutes'>{calculateMsDuration(ticket.schedule.return.departure, ticket.schedule.return.destination)}</span>
                                                                            <span className='minutes_text'>min</span>
                                                                        </span>
                                                                    </div>
                                                                    <div className='img_wrap'>
                                                                        <hr className="line" />
                                                                        <div className='img'>
                                                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="fa-fw rtl-flip" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M480 192H365.71L260.61 8.06A16.014 16.014 0 0 0 246.71 0h-65.5c-10.63 0-18.3 10.17-15.38 20.39L214.86 192H112l-43.2-57.6c-3.02-4.03-7.77-6.4-12.8-6.4H16.01C5.6 128-2.04 137.78.49 147.88L32 256 .49 364.12C-2.04 374.22 5.6 384 16.01 384H56c5.04 0 9.78-2.37 12.8-6.4L112 320h102.86l-49.03 171.6c-2.92 10.22 4.75 20.4 15.38 20.4h65.5c5.74 0 11.04-3.08 13.89-8.06L365.71 320H480c35.35 0 96-28.65 96-64s-60.65-64-96-64z"></path>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                <Col md={3} sm={4} className='col_destination_city'>
                                                                    <h4 className='mb-2 city_name'>{ticket?.details.departure_city}</h4>
                                                                    <h4 className='mb-2 time'> {new Date(ticket?.schedule.return.destination).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                                                                    <p className='mb-2'>{new Date(ticket?.schedule.return.destination).toLocaleDateString()}</p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className='btn_selectPosition'>
                            <button className='btn btn-primary'>Select Position</button>
                        </div> */}

                            <div className='traveler_detail_wrap card'>
                                <div className='card_header'>
                                    <span className='content_header' style={{ fontSize: "35px", fontWeight: "700" }}>
                                        Traveler Details
                                    </span>
                                </div>
                                <div className='card_body'>
                                    {tickets.length > 0 ? <TravelerForm tickets={tickets} /> : null}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} xl={3}  >
                            <FareSummary tickets={tickets} setTickets={setTickets} />
                        </Col>
                    </Row>
                </Container>
            </section>
        ] : [
            <section style={{ height: "907px" }}>
                <Container >
                    <Row>
                        <Col>
                            <h2 style={{ color: 'white', fontSize: "30px", fontWeight: "700", padding: "50px 0" }} className="text-center">No tickets selected</h2>
                        </Col>
                    </Row>
                </Container>
            </section>
        ]
    );
};

export default FlightDetail;