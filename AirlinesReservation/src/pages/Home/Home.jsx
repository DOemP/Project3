
import { Container } from 'react-bootstrap';
import './Home.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook để điều hướng
import { Button, DatePicker, Select } from 'antd'; // Import Ant Design components
import { useLocation } from 'react-router-dom'; // Hook để lấy dữ liệu từ navigate
import axios from 'axios';
import config from '../../config/config';
// import FlightResultsPage from './FlightResultsPage';


const Home = () => {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [ticketType, setTicketType] = useState("one-way");
  const [tripType, setTripType] = useState(""); // Default trip type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Kiểm soát hiện/ẩn trường Return
  const [data, setData] = useState({ origins: [], destinations: [], }); // Khởi tạo data

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5223/api/Flights');
        console.log('Response data:', response.data); // Kiểm tra dữ liệu trả về
  
        if (response.data && Array.isArray(response.data.items)) {
          const origins = response.data.items.map(a => ({
            value: a.origin,
            label: a.origin,
          }));
  
          const destinations = response.data.items.map(a => ({
            value: a.destination,
            label: a.destination,
          }));
  
          setData({ origins, destinations });
        } else {
          console.error('Unexpected data format:', response.data);
        }
  
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      }
    };
  
    fetchData();
  }, []);

  const onSearch = (value) => {
    console.log('search:', value);
  };

  // Xử lý sự kiện khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const searchParams = new URLSearchParams({
      origin: from,
      destination: to,
      departureDate,
      returnDate: ticketType === "round-trip" ? returnDate : "",
      ticketType,
      tripType,
    });
  
    try {
      const response = await fetch(
        `${config.endpoint}/Flights/search?${searchParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch flight data.");
  
      const data = await response.json();
  
      // Tách chuyến bay dựa trên loại vé (one-way hoặc round-trip)
      const flights = data.map((flight) => {
        const departure = flight.departure || {};
        const flightReturn = flight.return || null;
  
        if (ticketType === "one-way") {
          // Chuyến bay một chiều
          return {
            type: flight.type,
            id: flight.ticketID,
            flightNumber: flight.flightNumber,
            origin: flight.origin,
            destination: flight.destination,
            positionSeat: flight.positionSeat || "",
            departure: {
              departureDate: flight.departureDate || null,
              arrivalDate: flight.arrivalDate || null,
            },
            ticketPrice: flight.ticketPrice || null,
            tripType: flight.tripType === 1 ? "Merchant" : "Popular",
          };
        } else if (ticketType === "round-trip") {
          // Chuyến bay khứ hồi
          return {
            type: flight.type,
            id: flight.ticketID,
            flightNumber: flight.flightNumber,
            origin: flight.origin,
            destination: flight.destination,
            positionSeat: flight.positionSeat || "",
            departure: {
              departureDate: departure.departureDate || null,
              arrivalDate: departure.arrivalDate || null,
            },
            return: {
              departureDate: flightReturn?.departureDate || null,
              arrivalDate: flightReturn?.arrivalDate || null,
            },
            ticketPrice: flight.ticketPrice || null,
            tripType: flight.tripType === 1 ? "Merchant" : "Popular",
          };
        }
      });
  
      navigate("/flight_List", { state: { flights, ticketType } });
      console.log("Danh sách chuyến bay:", flights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để hiển thị hoặc ẩn trường Return
  const toggleColVisibility = () => {
    setTicketType("one-way");
    setIsVisible(false);
  };

  const showinvisible = () => {
    setTicketType("round-trip");
    setIsVisible(true);
  };


  return (

    <Container>


      <div className='Home-pic_1' style={{ backgroundImage: "url('https://booking-sb.vercel.app/assets/01-KMyk26JY.jpg')" }}>
        <div className='font_pic_1'>Ready to take off?</div>


        {/* <svg className='fill-mode' viewBox="0 0 12.9 324"><path className="fill-mode" d="M9.8,316.4c1.1-26.8,2-53.4,1.9-80.2c-0.1-18.2-0.8-36.4-1.2-54.6c-0.2-8.9-0.2-17.7,0.8-26.6 c0.5-4.5,1.1-9,1.4-13.6c0.1-1.9,0.1-3.7,0.1-5.6c-0.2-0.2-0.6-1.5-0.2-3.1c-0.3-1.8-0.4-3.7-0.4-5.5c-1.2-3-1.8-6.3-1.7-9.6 c0.9-19,0.5-38.1,0.8-57.2c0.3-17.1,0.6-34.2,0.2-51.3c-0.1-0.6-0.1-1.2-0.1-1.7c0-0.8,0-1.6,0-2.4c0-0.5,0-1.1,0-1.6 c0-1.2,0-2.3,0.2-3.5H0v11.8c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1V31c3.3,0,6.1,2.7,6.1,6.1S3.3,43.3,0,43.3v6.9 c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1 s-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9 c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1 c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.7,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9 c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.7,6.1,6.1 c0,3.4-2.8,6.1-6.1,6.1v6.9c3.3,0,6.1,2.8,6.1,6.1c0,3.4-2.8,6.1-6.1,6.1V324h9.5C9.6,321.4,9.7,318.8,9.8,316.4z"></path></svg> */}
        <form className='form-Booking' onSubmit={handleSubmit}>
          <Row>
            <Col>
              <div className='all-but'>
                <Button className='but-1' onClick={toggleColVisibility}>
                  One Way
                </Button>
                <Button className='but-2' onClick={showinvisible}>
                  <label>Round Trip</label>
                </Button>
              </div>
            </Col>
            <Col>
              <Select
                className='Choosen-class'
                showSearch
                placeholder="Select Class"
                optionFilterProp="label"
                onChange={setTripType}
                options={[
                  { value: 'Popular', label: 'Popular' },
                  { value: 'Merchant', label: 'Merchant' },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col sm style={{ color: 'white' }} className='Booking-Departure form4'>
              <svg xmlns="http://www.w3.org/2000/svg" height="14" width="10.5" viewBox="0 0 384 512" style={{ marginRight: '8px' }}><path fill="#eceff3" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
              <label>From</label>
              <Select
                className='Choosen-form-to-departure-location'
                showSearch
                placeholder="Select Location"
                optionFilterProp="label"
                onChange={setFrom}
                onSearch={onSearch}
                options={data.origins}
                // options={[
                //   { value: 'HN', label: 'HN' },
                //   { value: 'HCM', label: 'HCM' },
                // ]}
              />
            </Col>
            <Col sm style={{ color: 'white' }} className='Booking-Departure form4'>
              <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512" style={{ marginRight: '8px' }}><path fill="#eceff3" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" /></svg>
              <label>To</label>
              <Select
                className='Choosen-form-to-departure-location'
                showSearch
                placeholder="Select Location"
                optionFilterProp="label"
                onChange={setTo}
                onSearch={onSearch}
                options={data.destinations}
                // // options={[
                // //   { value: 'HN', label: 'HN' },
                // //   { value: 'HCM', label: 'HCM' },
                // ]}
              />
            </Col>
            <Col sm style={{ color: 'white' }} className='Booking-Departure form4'>
              <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512" style={{ marginRight: '8px' }}><path fill="#eceff3" d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z" /></svg>
              <label>Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </Col>
            <Col
              sm
              style={{ color: 'white', display: isVisible ? 'block' : 'none' }}
              className='Booking-Departure form4'
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512" style={{ marginRight: '8px' }}><path fill="#eceff3" d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z" /></svg>
              <label>Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Col>
          </Row>
          <div className='but_space'>
            <Button className="Butt_Submit" onClick={handleSubmit}>Find Ticket<svg color='#fff' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className='butt-offer'><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" ></path></svg></Button>
          </div>
          {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        </form>
      </div>

      {/* <h4 style={{ color: '#fff', paddingtop: '10px' }} className='h4'>Special Offer</h4> */}
      <br />
      <div className="row">
        {/* <div className="col-lg-4 form">
          <img
            src='https://booking-sb.vercel.app/assets/07-opohBWBK.svg'
            className='Offer-1'
            alt=""
          />
          <br />
          <label style={{ color: '#fff' }} className='margin-top'>Flat</label>
          <br />
          <h5 ClassName='font-all'>$899</h5>
          <br />
          <label ClassName='font-all'>Off On Domestic Flights</label>
          <br />
          <div ClassName="bg-primary bg-opacity-10 border border-2 border-primary border-dashed rounded-2 px-3 py-2 font-all margin-top">
            <h5 ClassName="fw-normal user-select-all mb-0 " role="button">8B99OFF</h5>
          </div>
          <a role="button" tabIndex="0" href="" ClassName="btn-round mb-0 btn btn-white btn-lg "><svg color='#fff' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className='butt-offer'><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" ></path></svg></a>
        </div> */}

        {/* <div ClassName="col-lg-4 form2">

          <img src='https://booking-sb.vercel.app/assets/08-DvZHGsr_.svg' ClassName='Offer-1' alt=""></img>
          <br />
          <label style={{ color: '#fff' }} ClassName='margin-top'>Flat</label>
          <br />
          <h5 className='font-all'>13% off</h5>
          <br />
          <label className='font-all'>On Domestic Flights</label>
          <br />
          <div className="bg-primary bg-opacity-10 border border-2 border-primary border-dashed rounded-2 px-3 py-2 font-all margin-top">
            <h5 className="fw-normal user-select-all mb-0 " role="button">13PO7FF</h5>
          </div>
          <a role="button" tabIndex="0" href="" className="btn-round mb-0 btn btn-white btn-lg "><svg color='#fff' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className='butt-offer'><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" ></path></svg></a>
        </div> */}
        {/* <div className="col-lg-4 form3 ">
          <img src='https://booking-sb.vercel.app/assets/09-lbUh0dwJ.svg' className='Offer-1' alt=""></img>
          <br />
          <label style={{ color: '#fff' }} className='margin-top'>Flat</label>
          <br />
          <h5 className='font-all'>$2,400 off</h5>
          <br />
          <label className='font-all'>On International Flights</label>
          <br />
          <div className="bg-primary bg-opacity-10 border border-2 border-primary border-dashed rounded-2 px-3 py-2 font-all margin-top">
            <h5 className="fw-normal user-select-all mb-0 " role="button">13PO7FF</h5>
          </div>
          <a role="button" tabIndex="0" href="" className="btn-round mb-0 btn btn-white btn-lg "><svg color='#fff' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className='butt-offer'><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" ></path></svg></a>
        </div> */}
        {/* popular             */}
        {/* <h2 className='font-all2' style={{ textAlign: 'center', padding: '50px', fontSize: 'font-size: bold' }}>Popular Destinations</h2> */}
        <br />
        <div className="row g-1">
          {/* <div className="col-3">
            <div class="figure-container">
              <img src='https://booking-sb.vercel.app/assets/01-XLNMkZnp.jpg' alt='' className='card-img'></img>
              <br />

            </div>
            <label className='font-card'><h5>Thailand</h5></label>
            <label className='font-all' style={{ marginLeft: '88px' }}>4.3</label>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-warning ms-1" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
            <br />
            <label className='font-all' style={{ color: '#b0b0b8' }}>The next flight is on 26th Dec</label>
          </div>

          <div className="col-3">
            <div class="figure-container">
              <img src='https://booking-sb.vercel.app/assets/03-EPDgyWjn.jpg' alt='' className='card-img'></img>
            </div>

            <br />
            <label className='font-card'><h5>HongKong</h5></label>
            <label className='font-all' style={{ marginLeft: '88px' }}>4.3</label>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-warning ms-1" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
            <br />
            <label className='font-all' style={{ color: '#b0b0b8' }}>The next flight is on 26th Dec</label>
          </div>
          <div className="col-3">
            <div class="figure-container">
              <img src='https://booking-sb.vercel.app/assets/02-wSem_cAO.jpg' alt='' className='card-img'></img>
            </div>

            <br />
            <label className='font-card'><h5>Maldive</h5></label>
            <label className='font-all' style={{ marginLeft: '88px' }}>4.3</label>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-warning ms-1" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
            <br />
            <label className='font-all' style={{ color: '#b0b0b8' }}>The next flight is on 26th Dec</label>
          </div>
          <div className="col-3">
            <div class="figure-container">
              <img src='https://booking-sb.vercel.app/assets/04-QN3VUbn5.jpg' alt='' className='card-img'></img>
            </div>

            <br />
            <label className='font-card'><h5>Swiztland</h5></label>
            <label className='font-all' style={{ marginLeft: '88px' }}>4.3</label>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-warning ms-1" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
            <br />
            <label className='font-all' style={{ color: '#b0b0b8' }}>The next flight is on 26th Dec</label>
          </div> */}
          {/* tuturiol           */}
          <div className='totorial'>
            <Row>
              <Col>
                <img src='https://booking-sb.vercel.app/assets/step-3-7OYqXIyu.svg' alt='' className='img-1'></img>
                <br />
                <label><h5 className='font-all'>Search Choice</h5></label>
                <label className='font'>Total 630+ destinations that we work with</label>
              </Col>
              <Col><svg width="154px" height="83px" className='svg-1'><path className="fill-secondary opacity-4" d="M142.221,83.016 L140.251,81.082 L148.020,73.376 C146.847,73.405 145.665,73.402 144.479,73.353 L144.548,70.637 C145.888,70.692 147.217,70.676 148.535,70.628 L139.384,62.839 L141.165,60.792 L153.787,71.539 L142.221,83.016 ZM131.667,71.378 L132.327,68.751 C134.373,69.284 136.418,69.712 138.402,70.022 L138.015,72.707 C135.938,72.383 133.803,71.936 131.667,71.378 ZM119.489,67.036 L120.594,64.564 C122.531,65.433 124.480,66.221 126.383,66.905 L125.482,69.458 C123.509,68.751 121.493,67.935 119.489,67.036 ZM108.113,60.978 L109.540,58.677 C111.340,59.784 113.170,60.834 114.978,61.800 L113.698,64.186 C111.840,63.193 109.961,62.115 108.113,60.978 ZM99.302,55.005 C98.712,54.567 98.124,54.125 97.540,53.680 L99.203,51.541 C99.776,51.978 100.352,52.412 100.933,52.843 C102.031,53.657 103.148,54.459 104.282,55.243 L102.729,57.461 C101.568,56.659 100.426,55.841 99.302,55.005 ZM87.631,45.617 L89.413,43.574 C91.015,44.943 92.626,46.298 94.258,47.629 L92.525,49.714 C90.877,48.369 89.247,47.000 87.631,45.617 ZM78.063,37.231 L79.883,35.221 L84.635,39.423 L82.823,41.439 L78.063,37.231 ZM68.521,28.905 L70.295,26.853 C71.914,28.227 73.520,29.618 75.118,31.017 L73.310,33.038 C71.724,31.648 70.130,30.268 68.521,28.905 ZM58.688,21.003 L60.328,18.848 C62.036,20.128 63.717,21.440 65.378,22.781 L63.659,24.875 C62.023,23.557 60.369,22.263 58.688,21.003 ZM48.288,13.967 L49.683,11.647 C51.494,12.727 53.321,13.891 55.111,15.108 L53.575,17.340 C51.832,16.155 50.053,15.019 48.288,13.967 ZM38.981,9.077 C38.372,8.799 37.760,8.531 37.146,8.268 L38.204,5.775 C38.838,6.046 39.469,6.325 40.098,6.611 C41.429,7.216 42.746,7.854 44.046,8.521 L42.810,10.930 C41.547,10.283 40.272,9.664 38.981,9.077 ZM25.330,4.320 L25.934,1.679 C27.985,2.168 30.080,2.771 32.161,3.471 L31.314,6.042 C29.311,5.369 27.298,4.791 25.330,4.320 ZM13.076,2.706 L13.084,-0.012 C15.208,0.029 17.387,0.197 19.559,0.487 L19.234,3.180 C17.166,2.905 15.094,2.745 13.076,2.706 ZM0.759,1.270 C2.660,0.821 4.623,0.487 6.593,0.273 L6.939,2.975 C5.080,3.177 3.230,3.493 1.439,3.914 L0.759,1.270 Z"></path></svg></Col>
              <Col><img src='https://booking-sb.vercel.app/assets/step-2-FFQO7UxQ.svg' className='img-2' alt=''></img>
                <label><h5 className='font-all'>Select Destination</h5></label>
                <label className='font'>Insipidity the sufficient discretion imprudence</label>
              </Col>
              <Col><svg className="fill-secondary opacity-4 svg-1" width="161px" height="79px"><path d="M158.107,15.463 L157.135,5.449 C156.369,6.347 155.573,7.235 154.736,8.101 L152.599,6.579 C153.544,5.600 154.425,4.592 155.272,3.574 L142.859,6.243 L142.411,3.796 L159.535,0.118 L160.985,15.028 L158.107,15.463 ZM131.614,21.310 C133.615,20.323 135.558,19.284 137.387,18.222 L138.833,20.282 C136.938,21.383 134.927,22.459 132.858,23.479 L131.614,21.310 ZM119.450,26.438 C121.550,25.684 123.624,24.876 125.616,24.039 L126.674,26.293 C124.626,27.153 122.496,27.983 120.340,28.758 L119.450,26.438 ZM107.366,32.761 L106.764,30.352 C107.500,30.158 108.237,29.959 108.974,29.755 C110.367,29.370 111.762,28.963 113.155,28.535 L113.894,30.904 C112.468,31.343 111.042,31.759 109.615,32.153 C108.867,32.359 108.116,32.563 107.366,32.761 ZM93.778,33.405 C95.956,32.941 98.128,32.461 100.295,31.955 L100.806,34.386 C98.616,34.898 96.421,35.383 94.222,35.850 L93.778,33.405 ZM80.657,36.053 L87.229,34.752 L87.633,37.206 L81.049,38.509 L80.657,36.053 ZM67.485,38.736 C69.678,38.262 71.876,37.807 74.074,37.362 L74.484,39.816 C72.299,40.256 70.119,40.708 67.942,41.181 L67.485,38.736 ZM54.349,41.900 C56.526,41.309 58.711,40.754 60.906,40.230 L61.433,42.656 C59.274,43.174 57.122,43.718 54.979,44.301 L54.349,41.900 ZM41.404,46.011 C43.490,45.232 45.654,44.489 47.835,43.801 L48.597,46.164 C46.472,46.834 44.363,47.557 42.331,48.315 L41.404,46.011 ZM30.259,53.613 L28.967,51.468 C29.611,51.137 30.259,50.813 30.912,50.495 C32.293,49.821 33.691,49.176 35.102,48.558 L36.207,50.792 C34.838,51.392 33.483,52.016 32.143,52.670 C31.511,52.978 30.883,53.292 30.259,53.613 ZM17.425,58.480 C19.198,57.202 21.090,55.953 23.052,54.765 L24.549,56.794 C22.662,57.937 20.844,59.138 19.142,60.364 L17.425,58.480 ZM7.428,67.231 C8.888,65.655 10.488,64.107 12.182,62.630 L14.128,64.332 C12.516,65.738 10.995,67.211 9.607,68.707 L7.428,67.231 ZM0.172,77.195 C1.089,75.523 2.140,73.865 3.293,72.267 L5.697,73.469 C4.610,74.977 3.620,76.539 2.755,78.114 L0.172,77.195 ZM149.871,12.613 C148.214,13.999 146.419,15.364 144.535,16.669 L142.867,14.750 C144.671,13.499 146.390,12.194 147.973,10.869 L149.871,12.613 Z"></path></svg></Col>
              <Col><img src='	https://booking-sb.vercel.app/assets/step-1-MvdtJvxb.svg' className='img-1' alt=''></img>
                <label><h5 className='font-all'>Easy to Book</h5></label>
                <label className='font'>With an easy and fast ticket purchase process</label>
              </Col>
            </Row>
          </div>
          {/* discover */}
          <div className='AD'>
            <label><h3 className='font-all'>It's time to discover</h3></label><img src='	https://booking-sb.vercel.app/assets/04-62COr-Za.svg' alt='' className='AD-pic-1'></img>
            <br />
            <label className='font'>He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy.</label>
            <a class="btn btn-lg btn-dark mb-0 butt-Ad" href="/flights/list">Book a Flight</a>

          </div>
        </div>



      </div>

    </Container >
  );
}

export default Home;
