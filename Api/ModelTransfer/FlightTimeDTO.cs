using BackEnd.Models;

namespace BackEnd.ModelTransfer
{
	public class FlightTimeDTO
	{
		public int Id { get; set; }
		public int FlightID { get; set; }
		public DateTime DepartureDate { get; set; }
		public DateTime ArrivalDate { get; set; }
		public string FlightType { get; set; }
	}
}
