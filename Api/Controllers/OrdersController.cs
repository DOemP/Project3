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
    public class OrdersController : ControllerBase
    {
        private readonly DataContext _context;

        public OrdersController(DataContext context)
        {
            _context = context;
        }

		// GET: api/Orders
		/*[HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }*/

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrder([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
		{
			var orders = await _context.Orders.ToListAsync();

			var orderDtos = orders.Select(order => new OrderDTO
			{
				Id = order.Id,
				UserId = order.UserId,
				Amount = order.Amount,
				TotalQuantity = order.TotalQuantity,  
				Status = order.Status.ToString()
			}).ToList();

			var paginatedItems = orderDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = orderDtos.Count();

			Paginate<OrderDTO> response = new Paginate<OrderDTO>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}


		// GET: api/Orders/5
		[HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
		public async Task<IActionResult> PutOrder(int id, OrderDTO orderDto)
		{
			if (id != orderDto.Id)
			{
				return BadRequest("Order ID mismatch.");
			}

			if (!Enum.TryParse(orderDto.Status, true, out Status statusEnum))
			{
				ModelState.AddModelError("Status", "Invalid status value");
				return BadRequest(ModelState);
			}

			var order = await _context.Orders.FindAsync(id);
			if (order == null)
			{
				return NotFound();
			}

			order.UserId = orderDto.UserId;
			order.Amount = orderDto.Amount;
			order.TotalQuantity = orderDto.TotalQuantity;
			order.Status = statusEnum;

			_context.Entry(order).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!OrderExists(id))
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

		// POST: api/Orders
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Order>> PostOrder(OrderDTO orderDto)
		{
			if (orderDto.UserId <= 0)
			{
				ModelState.AddModelError("UserId", "Invalid user ID");
				return BadRequest(ModelState);
			}

			if (orderDto.Amount <= 0)
			{
				ModelState.AddModelError("Amount", "Invalid amount");
				return BadRequest(ModelState);
			}

			if (orderDto.TotalQuantity <= 0)
			{
				ModelState.AddModelError("TotalQuantity", "Invalid total quantity");
				return BadRequest(ModelState);
			}

			if (!Enum.TryParse(orderDto.Status, true, out Status statusEnum))
			{
				ModelState.AddModelError("Status", "Invalid status");
				return BadRequest(ModelState);
			}

			var order = new Order
			{
				UserId = orderDto.UserId,
				Amount = orderDto.Amount,
				TotalQuantity = orderDto.TotalQuantity,
				Status = statusEnum
			};

			_context.Orders.Add(order);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(PostOrder), new { id = order.Id }, order);
		}

		// DELETE: api/Orders/5
		[HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
