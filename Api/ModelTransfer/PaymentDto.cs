using BackEnd.Models;
using System.Collections.Generic;

namespace BackEnd.ModelTransfer
{

	public class PaymentDto
	{
		public UserDTO User { get; set; }
		public long Amount { get; set; }
		public int TotalQuantity { get; set; }
		public List<PaymentDetailsDto> PaymentDetails { get; set; }

		public PaymentDto()
		{
			PaymentDetails = new List<PaymentDetailsDto>();
		}
	}
}