using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.DataCtxt;
using BackEnd.Models;
using BackEnd.ModelTransfer;
using BackEnd.PaginateModel;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DataContext _context;

        public TicketsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDTO>>> GetTicket([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var tickets = await _context.Ticket.ToListAsync();

            var ticketDtos = tickets.Select(ticket => new TicketDTO
            {
                Id = ticket.Id,
				FlightID = ticket.FlightID,
				TicketType = ticket.TicketType.ToString(), 
                TripType = ticket.TripType.ToString(),      
                TicketPrice = ticket.TicketPrice,
            }).ToList();

			var paginatedItems = ticketDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = ticketDtos.Count();

			Paginate<TicketDTO> response = new Paginate<TicketDTO>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}


        // GET: api/Tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        // PUT: api/Tickets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
		public async Task<IActionResult> PutTicket(int id, TicketDTO ticketDto)
		{
			if (id != ticketDto.Id)
			{
				return BadRequest("Ticket ID mismatch.");
			}

			Tickettype ticketTypeEnum;
			if (!Enum.TryParse(ticketDto.TicketType, true, out ticketTypeEnum))
			{
				ModelState.AddModelError("TicketType", "Invalid ticket type value.");
				return BadRequest(ModelState);
			}


			Triptype tripTypeEnum;
			if (!Enum.TryParse(ticketDto.TripType, true, out tripTypeEnum))
			{
				ModelState.AddModelError("TripType", "Invalid trip type value.");
				return BadRequest(ModelState);
			}

			var ticket = await _context.Ticket.FindAsync(id);
			if (ticket == null)
			{
				return NotFound();
			}

			ticket.FlightID = ticketDto.FlightID;
			ticket.TicketType = ticketTypeEnum;
			ticket.TripType = tripTypeEnum;
			ticket.TicketPrice = ticketDto.TicketPrice;

			_context.Entry(ticket).State = EntityState.Modified;

				await _context.SaveChangesAsync();
			

			return NoContent();
		}



		// POST: api/Tickets
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Ticket>> PostTickets(TicketDTO ticketDto)
		{
			if (ticketDto.FlightID <= 0)
			{
				ModelState.AddModelError("FlightID", "Invalid flight ID");
				return BadRequest(ModelState);
			}

			if (ticketDto.TicketPrice <= 0)
			{
				ModelState.AddModelError("TicketPrice", "Invalid ticket price");
				return BadRequest(ModelState);
			}

			if (!Enum.TryParse(ticketDto.TicketType, true, out Tickettype ticketTypeEnum))
			{
				ModelState.AddModelError("TicketType", "Invalid ticket type");
				return BadRequest(ModelState);
			}

			if (!Enum.TryParse(ticketDto.TripType, true, out Triptype tripTypeEnum))
			{
				ModelState.AddModelError("TripType", "Invalid trip type");
				return BadRequest(ModelState);
			}


			var ticket = new Ticket
			{
				FlightID = ticketDto.FlightID,
				TicketType = ticketTypeEnum,   
				TripType = tripTypeEnum,       
				TicketPrice = ticketDto.TicketPrice
			};

			_context.Ticket.Add(ticket);
			await _context.SaveChangesAsync();

			return CreatedAtAction("PostTickets", new { id = ticket.Id }, ticket);
		}

		// DELETE: api/Tickets/5
		[HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Ticket.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.Id == id);
        }


		//GetTicketsByOrder

		[HttpGet("order/{orderID}/tickets")]
		public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsByOrder(int orderID)
		{
			var tickets = await _context.OrderDetails
				.Where(od => od.OrderID == orderID)
				.Select(od => od.Ticket) 
				.ToListAsync();

			if (tickets == null || tickets.Count == 0)
			{
				return NotFound();
			}

			return Ok(tickets);
		}

	}
}
