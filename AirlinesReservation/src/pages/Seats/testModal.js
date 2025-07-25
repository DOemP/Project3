import React, { useState, useEffect } from 'react';
import config from '../../config/config';
import './testModal.css';
import { useNavigate, useParams } from 'react-router-dom';

const SeatSelection = () => {
    const { flightID } = useParams();
    const navigate = useNavigate();
    const [seats, setSeats] = useState([]);
    const [flightInfo, setFlightInfo] = useState({});
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [selectedTicketsIndex, setSelectedTicketsIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentSeat, setCurrentSeat] = useState(null);

    const seatsPerRow = 6;
    // const totalSeats = 50;
    const seatColumns = ['A', 'B', 'C', 'D', 'E', 'G'];

    //Thong tin chuyen bay
    const fetchFlightInfo = async (flightID) => {
        try {
            const response = await fetch(`${config.endpoint}/Flights/${flightID}`);
            const data = await response.json();
            setFlightInfo({
                origin: data.origin,
                destination: data.destination,
                departureDate: data.departureDate,
                arrivalDate: data.arrivalDate,
                passengers: data.passengers
            });
        } catch (error) {
            console.error("Error fetching flight info:", error);
            setFlightInfo({});
        }
    };

    // Thong tin ve theo orderID từ sessionStorage
    const fetchTicketsFromSession = async () => {
        try {
            // Lấy dữ liệu vé từ sessionStorage
            const ticketsFromSession = sessionStorage.getItem('tickets');

            if (ticketsFromSession) {
                // Chuyển từ chuỗi JSON về đối tượng
                const parsedTickets = JSON.parse(ticketsFromSession);

                console.log("Vé trong session: " + JSON.stringify(parsedTickets, null, 2));
                console.log("Số lượng vé: " + parsedTickets.length);

                // Cập nhật state 'tickets' với dữ liệu từ session
                setTickets(parsedTickets);
            } else {
                console.log("Không có vé trong session.");
            }
        } catch (error) {
            console.error("Error fetching tickets from session:", error);
        }
    };


    //  Lay so ghe ra chia deu hang cot
    const fetchSeats = async (flightID) => {
        try {
            const response = await fetch(`${config.endpoint}/Seats/seats/flight/${flightID}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Dữ liệu ghế trả về từ API:", data);

            // Kiểm tra xem data có chứa thuộc tính totalSeats hay không
            if (data && data.totalSeats !== undefined) {
                const totalSeats = data.totalSeats; // Lấy tổng số ghế từ dữ liệu trả về
                console.log("Tổng số ghế:", totalSeats);


                if (totalSeats > 0) {
                    const generatedSeats = [];
                    const totalRows = Math.ceil(totalSeats / seatsPerRow);

                    for (let row = 0; row < totalRows; row++) {
                        for (let col = 0; col < seatsPerRow; col++) {
                            const seatIndex = row * seatsPerRow + col;
                            if (seatIndex < totalSeats) {
                                generatedSeats.push({
                                    seat: {
                                        row: row + 1,
                                        column: seatColumns[col],
                                    },
                                    status: 'available',
                                });
                            }
                        }
                    }

                    setSeats(generatedSeats); // Cập nhật danh sách ghế vào state
                } else {
                    console.error("Không tìm thấy số lượng ghế trong dữ liệu trả về.");
                }



            } else {
                console.error("Dữ liệu trả về không có thuộc tính totalSeats:", data);
            }

        } catch (error) {
            console.error("Error fetching seats:", error);
            setSeats([]); // Xóa danh sách ghế nếu có lỗi
        }
    };


    useEffect(() => {
        if (flightID) {
            setFlightInfo({});
            // duyet();
            fetchTicketsFromSession();
            setSeats([]);
            fetchFlightInfo(flightID);
            fetchSeats(flightID);
        }
        // if (orderID) {
        //     fetchTickets(orderID);
        // }
    }, [flightID]);





    const handleSeatClick = (seat, ticketIndex) => {
        // Không cho phép chọn ghế đã được người khác chọn ("taken")
        if (seat.status === 'taken') return;

        const selectedSeatValue = `${seat.seat.row}${seat.seat.column}`;

        // Kiểm tra ghế hiện tại và đổi ghế
        if (selectedSeats[ticketIndex] === selectedSeatValue) {
            // Hủy chọn ghế hiện tại và trả lại trạng thái "available"
            const updatedSeats = [...selectedSeats];
            updatedSeats[ticketIndex] = null;

            setSeats(prevSeats =>
                prevSeats.map(s =>
                    s.seat.row === seat.seat.row && s.seat.column === seat.seat.column
                        ? { ...s, status: 'available' }
                        : s
                )
            );

            setSelectedSeats(updatedSeats);
        } else {
            // Đổi ghế: Nếu đã chọn ghế trước đó, trả ghế cũ về trạng thái "available"
            if (selectedSeats[ticketIndex]) {
                const oldSeatValue = selectedSeats[ticketIndex];
                const oldSeatRow = parseInt(oldSeatValue[0], 10);
                const oldSeatColumn = oldSeatValue.substring(1);

                setSeats(prevSeats =>
                    prevSeats.map(s =>
                        s.seat.row === oldSeatRow && s.seat.column === oldSeatColumn
                            ? { ...s, status: 'available' }
                            : s
                    )
                );
            }

            // Cập nhật ghế mới và hiện modal xác nhận
            setCurrentSeat(seat);
            setShowModal(true);
        }
    };












    const confirmSeat = () => {
        if (!currentSeat) {
            console.error("Chưa chọn ghế nào!");
            return;
        }

        const seatValue = `${currentSeat.seat.row}${currentSeat.seat.column}`;

        // Xử lý đổi ghế: Trả lại ghế cũ về trạng thái "available"
        if (selectedSeats[selectedTicketsIndex]) {
            const previousSeatValue = selectedSeats[selectedTicketsIndex];
            const previousSeatRow = parseInt(previousSeatValue[0], 10);
            const previousSeatColumn = previousSeatValue.substring(1);

            setSeats(prevSeats =>
                prevSeats.map(seat =>
                    seat.seat.row === previousSeatRow && seat.seat.column === previousSeatColumn
                        ? { ...seat, status: 'available' }
                        : seat
                )
            );
        }

        // Cập nhật trạng thái ghế mới là "taken"
        setSeats(prevSeats =>
            prevSeats.map(seat =>
                seat.seat.row === currentSeat.seat.row && seat.seat.column === currentSeat.seat.column
                    ? { ...seat, status: 'taken' }
                    : seat
            )
        );

        // Lưu lựa chọn ghế cho vé hiện tại
        const updatedSeats = [...selectedSeats];
        updatedSeats[selectedTicketsIndex] = seatValue;

        // Lưu ghế vào session
        const sessionData = JSON.parse(sessionStorage.getItem('tickets')) || [];
        sessionData[selectedTicketsIndex] = {
            ...sessionData[selectedTicketsIndex],
            position_seat: seatValue,
        };
        sessionStorage.setItem('tickets', JSON.stringify(sessionData));

        setSelectedSeats(updatedSeats);
        setShowModal(false);  // Đóng modal
        setCurrentSeat(null); // Reset sau khi chọn xong
    };





    //Modal xac nhan
    const renderModal = () => {
        if (!showModal || !currentSeat) return null;

        return (
            <div className="modal">
                <div className="modal-content">
                    <h2>Xác nhận đặt chỗ</h2>
                    <p>Bạn có chắc chắn muốn đặt ghế {`${currentSeat.seat.row}${currentSeat.seat.column}`} cho vé {selectedTicketsIndex + 1} không?</p>
                    <button onClick={confirmSeat}>Xác nhận</button>
                    <button onClick={() => setShowModal(false)}>Hủy</button>
                </div>
            </div>
        );
    };


    // o hien thong tin tung ve chon
    const createSeatSelectors = () => {
        // Lấy dữ liệu vé từ sessionStorage
        const ticketsFromSession = sessionStorage.getItem('tickets');

        // Nếu có dữ liệu, chuyển từ chuỗi JSON thành đối tượng
        const parsedTickets = ticketsFromSession ? JSON.parse(ticketsFromSession) : [];

        // Duyệt qua từng vé và tạo các phần tử hiển thị ghế ngồi
        return parsedTickets.map((ticket, index) => (
            <div key={index} className="seat-selector">
                <span>Chọn ghế cho vé {index + 1}:</span>
                <div
                    className={`seat-info ${selectedSeats[index] ? 'selected' : ''}`}
                    onClick={() => handleSeatSelection(index)}
                    style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
                >
                    {selectedSeats[index] ? (
                        <>
                            <span>Tên hành khách: {ticket.passengerName}</span>
                            <span>Chỗ ngồi: {selectedSeats[index]}</span>
                        </>
                    ) : (
                        <span>Chưa chọn ghế</span>
                    )}
                </div>
            </div>
        ));
    };


    const handleSeatSelection = (index) => {
        console.log("Current Seat:", currentSeat);
        console.log("Selected Seats:", selectedSeats);

        setSelectedTicketsIndex(index);
    };

    // Danh sach ghe
    const renderSeats = () => {
        return seats.map((seat, index) => (
            <div
                key={index}
                className={`seat ${seat.status} ${selectedSeats[selectedTicketsIndex] === `${seat.seat.row}${seat.seat.column}` ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat, selectedTicketsIndex)}
            >
                {`${seat.seat.row}${seat.seat.column}`}
            </div>
        ));
    };

    // Thong tin chuyne bay
    const renderFlightInfo = () => (
        <div className="flight-info">
            <div className="origin">{flightInfo.origin}</div>
            <div className="destination">{flightInfo.destination}</div>
            <div className="departure">{flightInfo.departureDate}</div>
            <div className="arrival">{flightInfo.arrivalDate}</div>
            <div className="passengers">{flightInfo.passengers} hành khách</div>
        </div>
    );

    const handleBack = () => {

    };

    const handleConfirm = () => {
        navigate('/flight_Details');
    };



    const handleClearSelection = () => {
        setSelectedSeats(Array(tickets.length).fill(null)); // Đặt tất cả ghế đã chọn về null
        setSeats(prevSeats =>
            prevSeats.map(seat => ({ ...seat, status: 'available' })) // Đánh dấu lại tất cả ghế là có thể chọn
        );
    };






    return (
        <div>
            <div className="seat-selection" style={{ backgroundColor: "white" }}>
                {renderFlightInfo()}
                <div className="seat-map">
                    {renderSeats()}
                </div>
                <div className="selected-seats">
                    Ghế đã chọn: {selectedSeats.join(', ')}
                </div>
                {createSeatSelectors()}
                {renderModal()}
            </div>

            <div>
                <p>Selected Seats: {JSON.stringify(selectedSeats)}</p>
            </div>


            <div className="footer_wrap">
                <div className="row">
                    <div className="col-12" style={{ color: "black", display: "flex", flexWrap: "wrap" }}>
                        <div className="col-6" style={{ display: "flex", flexWrap: "wrap" }}>
                            <p>{selectedSeats.filter(seat => seat).length}/{tickets.length}</p>
                            <p style={{ marginLeft: "5px" }}>ghế ngồi đã chọn</p>
                        </div>
                        <div className="col-6">
                            <p
                                onClick={handleClearSelection}
                                style={{ cursor: "pointer", color: "blue", textAlign: "end", marginLeft: "50%" }}
                            >
                                xóa lựa chọn
                            </p>
                        </div>
                    </div>
                    <div className="col-12" style={{ color: "black", display: "flex", flexWrap: "wrap", justifyContent: "end" }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleBack(); }}>
                            <button type="submit">Quay lại</button>
                        </form>
                        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
                            <button type="submit">Xác nhận</button>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SeatSelection;
