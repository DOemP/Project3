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
	//test
	public class SeatsController : ControllerBase
	{
		private readonly DataContext _context;

		public SeatsController(DataContext context)
		{
			_context = context;
		}

		// GET: api/Seats
		[HttpGet]
		public async Task<ActionResult<IEnumerable<SeatDTO>>> GetSeats0([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
		{
			var seats = await _context.Seats.ToListAsync();

			var seatDtos = seats.Select(seat => new SeatDTO
			{
				Id = seat.Id,
				FlightID = seat.FlightID,
				SeatNumber = seat.SeatNumber,
			}).ToList();

			var paginatedItems = seatDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = seatDtos.Count();

			Paginate<SeatDTO> response = new Paginate<SeatDTO>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);

		}


		// GET: api/Seats/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Seats>> GetSeats(int id)
		{
			var seats = await _context.Seats.FindAsync(id);

			if (seats == null)
			{
				return NotFound();
			}

			return seats;
		}

		// PUT: api/Seats/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutSeat(int id, SeatDTO seatDto)
		{
			if (id != seatDto.Id)
			{
				return BadRequest("Seat ID mismatch.");
			}


			var seat = await _context.Seats.FindAsync(id);
			if (seat == null)
			{
				return NotFound();
			}

			if (seatDto.SeatNumber <= 0)
			{
				ModelState.AddModelError("SeatNumber", "Seat number must be greater than 0.");
				return BadRequest(ModelState);
			}

			seat.FlightID = seatDto.FlightID;
			seat.SeatNumber = seatDto.SeatNumber;
			_context.Entry(seat).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!SeatExists(id))
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

		private bool SeatExists(int id)
		{
			return _context.Seats.Any(e => e.Id == id);
		}


		// POST: api/Seats
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Seats>> PostSeats(SeatDTO seatDto)
		{
			if (seatDto.FlightID <= 0)
			{
				ModelState.AddModelError("FlightID", "Invalid flight ID");
				return BadRequest(ModelState);
			}

			if (seatDto.SeatNumber <= 0)
			{
				ModelState.AddModelError("SeatNumber", "Invalid seat number");
				return BadRequest(ModelState);
			}

			var seat = new Seats
			{
				FlightID = seatDto.FlightID,
				SeatNumber = seatDto.SeatNumber,
			};

			_context.Seats.Add(seat);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetSeats", new { id = seat.Id }, seat);
		}


		// DELETE: api/Seats/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSeats(int id)
		{
			var seats = await _context.Seats.FindAsync(id);
			if (seats == null)
			{
				return NotFound();
			}

			_context.Seats.Remove(seats);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool SeatsExists(int id)
		{
			return _context.Seats.Any(e => e.Id == id);
		}


		//lay so luong ghe theo flightID
		[HttpGet("seats/flight/{flightID}")]
		public async Task<IActionResult> GetSeatsByFlightID(int flightID)
		{
			var seats = await _context.Seats
				.Where(s => s.FlightID == flightID)
				.ToListAsync();

			if (seats == null || !seats.Any())
			{
				return NotFound(new { message = "No seats found for this flight." });
			}

			int totalSeats = seats.FirstOrDefault()?.SeatNumber ?? 0;

			return Ok(new { totalSeats });
		}



    }
}
