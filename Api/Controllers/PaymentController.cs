using Microsoft.AspNetCore.Mvc;
using BackEnd.ModelTransfer;
using BackEnd.Models;
using BackEnd.DataCtxt;
using System.Text.Json;
using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PaymentsController : Controller
	{
		private readonly IConfiguration _configuration;
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly DataContext _context;

		public PaymentsController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, DataContext context)
		{
			_configuration = configuration;
			_httpContextAccessor = httpContextAccessor;
			_context = context;
		}

		[HttpPost("getUrl")]
		public string getUrl([FromBody] PaymentDto paymentDto)
		{
			using var transaction = _context.Database.BeginTransaction();

			//int userId;
			long amount = paymentDto.Amount;
			long checkedAmount = 0;
			int checkTotalQuantity = 0;
			long totalQuantity = paymentDto.TotalQuantity;
			//string type = paymentDto.Type;

			List<PaymentDetailsDto> details = paymentDto.PaymentDetails;
			if (details != null)
			{
				foreach (var item in details)
				{
					var ticket = _context.Ticket.Find(item.TicketId) ?? throw new InvalidOperationException($"Ticket with ID {item.TicketId} not found.");
					if (item.Quantity < 0)
					{
						throw new InvalidOperationException($"Invalid quantity for Ticket ID {item.TicketId}. Quantity must be greater than 0.");
					}
					else if (item.Quantity > totalQuantity)
					{
						throw new InvalidOperationException($"Invalid quantity for Ticket ID {item.TicketId}. Quantity must be less than or equal to {totalQuantity}.");
					}

					checkTotalQuantity += item.Quantity;
					checkedAmount += (long)ticket.TicketPrice * item.Quantity;
				}
			}

			if (checkedAmount != amount)
			{
				throw new InvalidOperationException($"Amount mismatch. Expected: {checkedAmount}, Provided: {amount}");
			}

			if (checkTotalQuantity != totalQuantity)
			{
				throw new InvalidOperationException($"Quantity mismatch. Expected: {checkTotalQuantity}, Provided: {totalQuantity}");
			}

			var userExist = _context.Users.SingleOrDefault(u => u.Email == paymentDto.User.Email);
			Users userInfor;

			if (userExist == null)
			{
				Users user = new Users
				{
					Gender = Enum.TryParse<GenDer>(paymentDto.User.Gender, true, out var gender) ? gender : throw new InvalidOperationException("Invalid gender value."),
					Email = paymentDto.User.Email ?? throw new InvalidOperationException("Email cannot be null."),
					Phone = paymentDto.User.Phone ?? throw new InvalidOperationException("Phone cannot be null."),
					FirstName = paymentDto.User.FirstName ?? throw new InvalidOperationException("First name cannot be null."),
					LastName = paymentDto.User.LastName ?? throw new InvalidOperationException("Last name cannot be null."),
					Dob = paymentDto.User.Dob ?? throw new InvalidOperationException("Date of birth cannot be null."),
					Passport = paymentDto.User.PassportNumber ?? throw new InvalidOperationException("Passport cannot be null."),
				};
				_context.Users.Add(user);
				_context.SaveChanges();
				/* transaction.Commit();*/
				//userId = user.Id;
				userInfor = user;
			}
			else
			{
				//userId = userExist.Id;
				userInfor = userExist;
			}

			Order order = new Order
			{
				UserId = userInfor.Id,
				Amount = amount,
				TotalQuantity = (int)totalQuantity,
				Status = Status.Pending,
				CreatedAt = DateTime.UtcNow,
				OrderDetails = new List<OrderDetails>(),
				User = userInfor
			};


			foreach (var item in details)
			{
				var orderDetails = new OrderDetails
				{
					TicketId = item.TicketId,
					Quantity = item.Quantity,
					Order = order,
					PositionSeat = item.position_seat
				};
				order.OrderDetails.Add(orderDetails);
			}

			_context.Orders.Add(order);
			_context.SaveChanges();
			transaction.Commit();

			string vnp_Returnurl = _configuration["Vnpay:vnp_ReturnUrl"] ?? throw new InvalidOperationException("Vnpay:vnp_ReturnUrl configuration is missing.");
			string vnp_Url = _configuration["Vnpay:vnp_Url"] ?? throw new InvalidOperationException("Vnpay:vnp_Url configuration is missing.");
			string vnp_TmnCode = _configuration["Vnpay:vnp_TmnCode"] ?? throw new InvalidOperationException("Vnpay:vnp_Url configuration is missing.");
			string vnp_HashSecret = _configuration["Vnpay:vnp_HashSecret"] ?? throw new InvalidOperationException("Vnpay:vnp_HashSecret configuration is missing.");

			VnPayLibrary vnpay = new VnPayLibrary();

			vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
			vnpay.AddRequestData("vnp_Command", "pay");
			vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
			vnpay.AddRequestData("vnp_Amount", (amount * 100).ToString());
			//if (type.Equals("VNPAYQR"))
			//{
			//	vnpay.AddRequestData("vnp_BankCode", "VNPAYQR");
			//}
			//else if (type.Equals("VNBANK"))
			//{
			//	vnpay.AddRequestData("vnp_BankCode", "VNBANK");
			//}
			//else if (type.Equals("INTCARD"))
			//{
			//	vnpay.AddRequestData("vnp_BankCode", "INTCARD");
			//}

			Utils utils = new Utils(_httpContextAccessor);
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_ExpireDate", DateTime.Now.AddMinutes(30).ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", "VND");
			vnpay.AddRequestData("vnp_IpAddr", utils.GetIpAddress());
			vnpay.AddRequestData("vnp_Locale", "vn");
			vnpay.AddRequestData("vnp_OrderInfo", $"thanh toan {totalQuantity} ve : {amount} ");
			vnpay.AddRequestData("vnp_OrderType", "other");

			vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
			vnpay.AddRequestData("vnp_TxnRef", order.Id.ToString());

			return vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);



		}
		[HttpGet("ReturnUrl")]
		public IActionResult ReturnUrl()
		{
			var query = _httpContextAccessor.HttpContext?.Request.Query;
			if (query != null && query.Count > 0)
			{
				string vnp_HashSecret = _configuration["Vnpay:vnp_HashSecret"] ?? throw new InvalidOperationException("Vnpay:vnp_HashSecret configuration is missing."); // Secret key
				var vnpayData = query;
				VnPayLibrary vnpay = new VnPayLibrary();

				foreach (var s in vnpayData.Keys)
				{
					if (!string.IsNullOrEmpty(s) && s.StartsWith("vnp_"))
					{
						vnpay.AddResponseData(s, vnpayData[s]!);
					}
				}

				long orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
				long vnpayTranId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
				string vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
				string vnp_TransactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");
				string vnp_SecureHash = vnpay.GetResponseData("vnp_SecureHash") ?? throw new InvalidOperationException("vnp_SecureHash is missing.");
				string terminalID = vnpay.GetResponseData("vnp_TmnCode") ?? throw new InvalidOperationException("vnp_TmnCode is missing.");
				long vnp_Amount = Convert.ToInt64(vnpay.GetResponseData("vnp_Amount")) / 100;
				string bankCode = vnpay.GetResponseData("vnp_BankCode") ?? throw new InvalidOperationException("vnp_BankCode is missing.");

				bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);
				if (checkSignature)
				{
					if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
					{
						Order? order = _context.Orders
							.Include(o => o.User)
							.Include(o => o.OrderDetails)
								.ThenInclude(od => od.Ticket)
								.ThenInclude(t => t!.Flight)
							.SingleOrDefault(o => o.Id == orderId);

						if (order == null)
						{
							throw new InvalidOperationException($"Order with ID {orderId} not found.");
						}

						order.Status = Status.Completed;
						_context.SaveChanges();
						SendBillPayment(order);

						var firstOrderDetail = order.OrderDetails.FirstOrDefault();
						if (firstOrderDetail == null)
						{
							throw new InvalidOperationException("Order details are missing.");
						}

						var redirectUrl = $"http://localhost:3000/PaymentSuccess?amount={vnp_Amount}&name={order.User.FirstName}{order.User.LastName}&departure_city={firstOrderDetail.Ticket.Flight.Origin}&destination_city={firstOrderDetail.Ticket.Flight.Destination}&ticketType={firstOrderDetail.Ticket.TicketType}&quantity={firstOrderDetail.Quantity}";
						return Redirect(redirectUrl);
					}
					else
					{
						var redirectUrl = "http://localhost:3000/PaymentError";
						return Redirect(redirectUrl);
					}
				}
				else
				{
					var redirectUrl = "http://localhost:3000/PaymentError";
					return Redirect(redirectUrl);
				}
			}

			return BadRequest("No query string data found.");
		}



		private void SendBillPayment(Order order)
		{
			using (var smtp = new SmtpClient("smtp.gmail.com"))
			{
				smtp.Port = 587;
				smtp.Credentials = new NetworkCredential("nxdiem004@gmail.com", "lvqb xrha ggro tlnx");
				smtp.EnableSsl = true;

				var message = new MailMessage
				{
					From = new MailAddress("nxdiem004@gmail.com"),
					Subject = "Bill Payment",
					Body = GenerateBillPaymentHtml(order),
					IsBodyHtml = true,
				};
				message.To.Add(order.User.Email);

				smtp.Send(message);
			}
		}

		private string GenerateBillPaymentHtml(Order order)
		{
			return $@"
    <html>
    <body>sa
        <h2>Bill Payment</h2>
        <p>Ngày: {order.CreatedAt}</p>
        <p>Người thanh toán: {order.User.FirstName} {order.User.LastName}</p>
        <p>Số tiền: {order.Amount} VND</p>
        <p>Số lượng vé: {order.TotalQuantity}</p>
        <h3>Chi tiết đơn hàng:</h3>
        <ul>
            {string.Join("", order.OrderDetails.Select(od => $"<li>điểm đi: {od.Ticket.Flight.Origin}, điểm đến {od.Ticket.Flight.Destination},vé:{od.Ticket.TicketType} ,Số lượng: {od.Quantity}, Vị trí ghế: {od.PositionSeat}</li>"))}
        </ul>
    </body>
    </html>";
		}
	}
}