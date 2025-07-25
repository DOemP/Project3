import React from 'react';
import './FareSummary.css';
import { InputNumber } from 'antd';
const FareSummary = ({ tickets, setTickets }) => {

    const changeQuantity = ({ value, index }) => {
        const newTickets = [...tickets];
        newTickets[index].details.quantity = value;
        setTickets(newTickets);
        sessionStorage.setItem('ticket', JSON.stringify(newTickets));
    }

    return (
        <div className="fare_summary_wrap card">
            <div className='card_header' style={{ borderBottom: "1px solid rgba(255, 255, 255, .07)" }} >
                <span className='content_header' style={{ fontSize: "26px", fontWeight: "700" }}>
                    Fare Summary
                </span>
            </div>

            <div className="card_body">
                <div className="fare_summary_content">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="fare_summary_item_wrapper"  >
                            <div className="fare_summary_item">
                                <div className="fare_summary_item_title">{ticket.details.departure_city}

                                    <svg style={{ padding: "0 3px" }} stroke="white" fill="white" stroke-width="0" viewBox="0 0 16 16" height="1.6em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"></path>
                                    </svg>

                                    {ticket.details.destination_city}</div>
                            </div>
                            <div className="fare_summary_item">
                                <div className="fare_summary_item_title">Flight Date</div>
                                <div className="fare_summary_item_price">{new Date(ticket.schedule.departure.departure).toLocaleDateString()}</div>
                            </div>
                            <div className="fare_summary_item">
                                <div className="fare_summary_item_title">Base Fare</div>
                                <div className="fare_summary_item_price">{ticket.details.price} VND</div>
                            </div>
                            <div className="fare_summary_item">
                                <div className="fare_summary_item_title">Quantity</div>
                                <div className="fare_summary_item_price">
                                    <InputNumber min={1} max={10} defaultValue={ticket.details.quantity} onChange={(value) => changeQuantity({ value, index })} changeOnWheel />
                                </div>
                            </div>

                            {index === tickets.length - 1 ? null : (<div className="line"></div>)}
                        </div>
                    ))}

                </div>
            </div>

            <div className="card_footer">
                <div className="fare_summary_item">
                    <div className="fare_summary_item_title">Total Fare</div>
                    <div className="fare_summary_item_price">
                        {tickets.reduce((total, ticket) => {
                            return total + (ticket?.details.price * ticket?.details.quantity);
                        }, 0)} VND
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FareSummary;