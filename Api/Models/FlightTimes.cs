namespace BackEnd.Models
{
	public enum flightType
	{
		Departure,
		Return
	}
	public class FlightTimes
	{
		public int Id { get; set; }
		public int FlightID { get; set; }
		public DateTime DepartureDate { get; set; }
		public DateTime ArrivalDate { get; set; }
		public flightType? FlightType { get; set; }
		public Flight? Flight { get; set; }
	}
}
