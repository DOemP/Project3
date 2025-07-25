using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.DataCtxt;
using BackEnd.Models;
using BackEnd.PaginateModel;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly DataContext _context;

        public FlightsController(DataContext context)
        {
            _context = context;
        }

		// GET: api/Flights
		[HttpGet]
		public async Task<ActionResult<Paginate<Flight>>> GetFlights([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
		{
			var flights = await _context.Flights.ToListAsync();

			var paginatedItems = flights.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = flights.Count();

			Paginate<Flight> response = new Paginate<Flight>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}

		// GET: api/Flights/5
		[HttpGet("{id}")]
        public async Task<ActionResult<Flight>> GetFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
            {
                return NotFound();
            }

            return flight;
        }

        // PUT: api/Flights/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlight(int id, Flight flight)
        {
            if (id != flight.Id)
            {
                return BadRequest();
            }

            _context.Entry(flight).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Flights
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Flight>> PostFlight(Flight flight)
        {
            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFlight", new { id = flight.Id }, flight);
        }

        // DELETE: api/Flights/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                return NotFound();
            }

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlightExists(int id)
        {
            return _context.Flights.Any(e => e.Id == id);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchFlights(
            string origin,
            string destination,
            DateTime? departureDate,
            DateTime? returnDate,
            string ticketType,
            string tripType)
        {
            // Chuyển tripType thành enum
            Triptype parsedTripType;
            if (!Enum.TryParse(tripType, true, out parsedTripType))
            {
                return BadRequest("Loại chuyến đi không hợp lệ.");
            }

            // Truy vấn từ bảng Ticket trước
            var ticketsQuery = _context.Ticket
                .Include(t => t.Flight)
                .ThenInclude(f => f.Tickets)
                .Where(t => t.Flight.Origin == origin && t.Flight.Destination == destination)
                .Where(t => string.IsNullOrEmpty(tripType) || t.TripType == parsedTripType)
                .Join(_context.FlightTimes,
                      t => t.FlightID,
                      ft => ft.FlightID,
                      (t, ft) => new { Ticket = t, FlightTime = ft })
                .Where(result =>
                    result.FlightTime.FlightType == flightType.Departure &&
                    (!departureDate.HasValue || result.FlightTime.DepartureDate.Date == departureDate.Value.Date));

            if (ticketType == "round-trip")
            {
                var returnTicketsQuery = _context.Ticket
                    .Include(t => t.Flight)
                    .Where(t => t.Flight.Origin == destination && t.Flight.Destination == origin)
                    .Join(_context.FlightTimes,
                          t => t.FlightID,
                          ft => ft.FlightID,
                          (t, ft) => new { Ticket = t, FlightTime = ft })
                    .Where(result =>
                        result.FlightTime.FlightType == flightType.Return &&
                        (!returnDate.HasValue || result.FlightTime.DepartureDate.Date == returnDate.Value.Date));

                // Lấy tất cả các chuyến đi trong ngày khởi hành
                var departureTickets = await ticketsQuery
                    .Select(result => new
                    {
                        Type = "round-trip",
                        TicketID = result.Ticket.Id,
                        FlightNumber = result.Ticket.Flight.FlightNumber,
                        Origin = result.Ticket.Flight.Origin,
                        Destination = result.Ticket.Flight.Destination,
                        DepartureDate = result.FlightTime.DepartureDate,
                        ArrivalDate = result.FlightTime.ArrivalDate,
                        TicketPrice = result.Ticket.TicketPrice,
                        TripType = result.Ticket.TripType
                    })
                    .ToListAsync();

                // Lấy tất cả các chuyến về trong ngày về
                var returnTickets = await returnTicketsQuery
                    .Select(result => new
                    {
                        TicketID = result.Ticket.Id,
                        FlightNumber = result.Ticket.Flight.FlightNumber,
                        Origin = result.Ticket.Flight.Origin,
                        Destination = result.Ticket.Flight.Destination,
                        DepartureDate = result.FlightTime.DepartureDate,
                        ArrivalDate = result.FlightTime.ArrivalDate,
                        TicketPrice = result.Ticket.TicketPrice,
                        TripType = result.Ticket.TripType
                    })
                    .ToListAsync();

                // Kết hợp tất cả các chuyến đi với các chuyến về phù hợp
                var combinedResults = departureTickets.SelectMany(df => returnTickets
                    .Where(rf => rf.DepartureDate > df.ArrivalDate) // Chỉ chọn chuyến về có thời gian khởi hành sau chuyến đi
                    .Select(rf => new
                    {
                        Type = "round-trip",
                        TicketID = df.TicketID,
                        FlightNumber = df.FlightNumber,
                        Origin = df.Origin,
                        Destination = df.Destination,
                        Departure = new
                        {
                            DepartureDate = df.DepartureDate,
                            ArrivalDate = df.ArrivalDate
                        },
                        Return = new
                        {
                            DepartureDate = rf.DepartureDate,
                            ArrivalDate = rf.ArrivalDate
                        },
                        TicketPrice = df.TicketPrice + rf.TicketPrice,
                        TripType = df.TripType
                    })
                ).ToList();

                return Ok(combinedResults);
            }
            else if (ticketType == "one-way")
            {
                var singleTripTickets = await ticketsQuery
                    .Select(result => new
                    {
                        Type = "one-way",
                        TicketID = result.Ticket.Id,
                        FlightNumber = result.Ticket.Flight.FlightNumber,
                        Origin = result.Ticket.Flight.Origin,
                        Destination = result.Ticket.Flight.Destination,
                        DepartureDate = result.FlightTime.DepartureDate,
                        ArrivalDate = result.FlightTime.ArrivalDate,
                        TicketPrice = result.Ticket.TicketPrice,
                        TripType = result.Ticket.TripType
                    })
                    .ToListAsync();

                return Ok(singleTripTickets);
            }
            else
            {
                return BadRequest("Loại vé không hợp lệ.");
            }
        }

    }
}
