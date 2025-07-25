import { useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainApp from './MainApp';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== '/flight_List' && location.pathname !== '/flight_Details' && !/^\/SeatSelect\/[^/]+$/.test(location.pathname)) {
      sessionStorage.removeItem('tickets');
    }
  }, [location.pathname]);
  return <MainApp />;
}

// useEffect(() => {
//   const ticket = [
//     {
//       type: 'round-way',
//       position_seat: 'B3',
//       details: {
//         id: 1,
//         departure_city: 'HN',
//         destination_city: 'HCM',
//         price: 200000,
//         quantity: 1,
//         flight_number: 'A100',
//       },
//       schedule: {
//         departure: {
//           departure: '2023-10-01T10:00:00',
//           destination: '2023-10-01T15:00:00'
//         },
//         return: {
//           departure: '2023-10-01T10:00:00',
//           destination: '2023-10-01T12:00:00'
//         }
//       }
//     },
//     {
//       type: 'round-way',
//       position_seat: 'A1',
//       details: {
//         id: 2,
//         departure_city: 'HN',
//         destination_city: 'HCM',
//         price: 100000,
//         quantity: 1,
//         flight_number: 'A200',
//       },
//       schedule: {
//         departure: {
//           departure: '2023-10-04T02:00:00',
//           destination: '2023-10-04T04:00:00'
//         },
//         return: {
//           departure: '2023-10-05T14:00:00',
//           destination: '2023-10-05T16:00:00'
//         }
//       }
//     }
//   ];



//   const ticketJSON = JSON.stringify(ticket);

//   sessionStorage.setItem('ticket', ticketJSON);
// }, []);



export default App;



