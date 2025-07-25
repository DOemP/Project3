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
    public class OrderDetailsController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderDetailsController(DataContext context)
        {
            _context = context;
        }

		// GET: api/OrderDetails
		[HttpGet]
		public async Task<ActionResult<Paginate<OrderDetails>>> GetOrderDetails([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
		{
			var orderDetails = await _context.OrderDetails.ToListAsync();

			var paginatedItems = orderDetails.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = orderDetails.Count();

			Paginate<OrderDetails> response = new Paginate<OrderDetails>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}


		// GET: api/OrderDetails/5
		[HttpGet("{id}")]
        public async Task<ActionResult<OrderDetails>> GetOrderDetails(int id)
        {
            var orderDetails = await _context.OrderDetails.FindAsync(id);

            if (orderDetails == null)
            {
                return NotFound();
            }

            return orderDetails;
        }

        // PUT: api/OrderDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
		public async Task<IActionResult> PutOrderDetails(int id, OrderDetailsDTO orderDetailsDto)
		{
			var orderDetails = await _context.OrderDetails.FindAsync(id);
			if (orderDetails == null)
			{
				return NotFound();
			}

			if (orderDetailsDto.OrderID <= 0)
			{
				ModelState.AddModelError("OrderID", "Invalid order ID");
				return BadRequest(ModelState);
			}

			if (orderDetailsDto.TicketId <= 0)
			{
				ModelState.AddModelError("TicketId", "Invalid ticket ID");
				return BadRequest(ModelState);
			}

			if (orderDetailsDto.Quantity <= 0)
			{
				ModelState.AddModelError("Quantity", "Invalid quantity");
				return BadRequest(ModelState);
			}
			orderDetails.OrderID = orderDetailsDto.OrderID;
			orderDetails.Quantity = orderDetailsDto.Quantity;
			orderDetails.TicketId = orderDetailsDto.TicketId;
			orderDetails.PositionSeat = orderDetailsDto.PositionSeat;

			_context.Entry(orderDetails).State = EntityState.Modified;
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// POST: api/OrderDetails
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<OrderDetails>> PostOrderDetails(OrderDetailsDTO orderDetailsDto)
		{
			if (orderDetailsDto.OrderID <= 0)
			{
				ModelState.AddModelError("OrderID", "Invalid order ID");
				return BadRequest(ModelState);
			}

			if (orderDetailsDto.TicketId <= 0)
			{
				ModelState.AddModelError("TicketId", "Invalid ticket ID");
				return BadRequest(ModelState);
			}

			if (orderDetailsDto.Quantity <= 0)
			{
				ModelState.AddModelError("Quantity", "Invalid quantity");
				return BadRequest(ModelState);
			}

			var orderDetails = new OrderDetails
			{
				OrderID = orderDetailsDto.OrderID,
				Quantity = orderDetailsDto.Quantity,
				TicketId = orderDetailsDto.TicketId,
				PositionSeat = orderDetailsDto.PositionSeat
			};

			_context.OrderDetails.Add(orderDetails);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(PostOrderDetails), new { id = orderDetails.Id }, orderDetails);
		}

		// DELETE: api/OrderDetails/5
		[HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetails(int id)
        {
            var orderDetails = await _context.OrderDetails.FindAsync(id);
            if (orderDetails == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(orderDetails);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderDetailsExists(int id)
        {
            return _context.OrderDetails.Any(e => e.Id == id);
        }
    }
}
