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
using BackEnd.ModelTransfer;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightTimesController : ControllerBase
    {
        private readonly DataContext _context;

        public FlightTimesController(DataContext context)
        {
            _context = context;
        }

		[HttpGet]
		public async Task<ActionResult<IEnumerable<FlightTimeDTO>>> GetFlightTimes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
		{
			var flightTimes = await _context.FlightTimes.Include(ft => ft.Flight).ToListAsync();

			var flightTimeDtos = flightTimes.Select(ft => new FlightTimeDTO
			{
				Id = ft.Id,
				FlightID = ft.FlightID,
				DepartureDate = ft.DepartureDate,
				ArrivalDate = ft.ArrivalDate,
				FlightType = ft.FlightType.ToString() 
			}).ToList();

			var paginatedItems = flightTimeDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = flightTimeDtos.Count();

			Paginate<FlightTimeDTO> response = new Paginate<FlightTimeDTO>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}



		// GET: api/FlightTimes/5
		[HttpGet("{id}")]
        public async Task<ActionResult<FlightTimes>> GetFlightTimes(int id)
        {
            var flightTimes = await _context.FlightTimes.FindAsync(id);

            if (flightTimes == null)
            {
                return NotFound();
            }

            return flightTimes;
        }

		// PUT: api/FlightTimes/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutFlightTime(int id, FlightTimeDTO flightTimeDto)
		{
			if (id != flightTimeDto.Id)
			{
				return BadRequest("FlightTime ID mismatch.");
			}

			// Validate FlightType, parse from string to enum
			if (!Enum.TryParse(flightTimeDto.FlightType, true, out flightType flightTypeEnum))
			{
				ModelState.AddModelError("FlightType", "Invalid flight type value.");
				return BadRequest(ModelState);
			}

			var flightTime = await _context.FlightTimes.FindAsync(id);
			if (flightTime == null)
			{
				return NotFound();
			}

			// Update entity properties
			flightTime.FlightID = flightTimeDto.FlightID;
			flightTime.DepartureDate = flightTimeDto.DepartureDate;
			flightTime.ArrivalDate = flightTimeDto.ArrivalDate;
			flightTime.FlightType = flightTypeEnum;

			_context.Entry(flightTime).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.FlightTimes.Any(ft => ft.Id == id))
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


		// POST: api/FlightTimes
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		[HttpPost]
		public async Task<ActionResult<FlightTimes>> PostFlightTimes(FlightTimeDTO flightTimeDto)
		{
			if (flightTimeDto.FlightID <= 0)
			{
				ModelState.AddModelError("FlightID", "Invalid flight ID");
				return BadRequest(ModelState);
			}

			if (flightTimeDto.DepartureDate == default(DateTime))
			{
				ModelState.AddModelError("DepartureDate", "Invalid departure date");
				return BadRequest(ModelState);
			}

			if (flightTimeDto.ArrivalDate == default(DateTime))
			{
				ModelState.AddModelError("ArrivalDate", "Invalid arrival date");
				return BadRequest(ModelState);
			}

			if (!Enum.TryParse(flightTimeDto.FlightType, true, out flightType flightTypeEnum))
			{
				ModelState.AddModelError("FlightType", "Invalid flight type");
				return BadRequest(ModelState);
			}

			var flightTimes = new FlightTimes
			{
				FlightID = flightTimeDto.FlightID,
				DepartureDate = flightTimeDto.DepartureDate,
				ArrivalDate = flightTimeDto.ArrivalDate,
				FlightType = flightTypeEnum 
			};

			_context.FlightTimes.Add(flightTimes);
			await _context.SaveChangesAsync();

			return CreatedAtAction("PostFlightTimes", new { id = flightTimes.Id }, flightTimes);
		}


		// DELETE: api/FlightTimes/5
		[HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlightTimes(int id)
        {
            var flightTimes = await _context.FlightTimes.FindAsync(id);
            if (flightTimes == null)
            {
                return NotFound();
            }

            _context.FlightTimes.Remove(flightTimes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlightTimesExists(int id)
        {
            return _context.FlightTimes.Any(e => e.Id == id);
        }
    }
}
