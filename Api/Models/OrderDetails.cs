namespace BackEnd.Models
{
	public class OrderDetails
	{
		public int Id { get; set; }
		public int OrderID { get; set; }
		public int Quantity { get; set; }
		public int TicketId { get; set; }
		public string PositionSeat { get; set; }
		public Order? Order { get; set; }
		public Ticket? Ticket { get; set; }
	}
}
