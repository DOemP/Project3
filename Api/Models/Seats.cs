namespace BackEnd.Models
{

    public enum isBook
	{
		Available,
		Selected,
        Taken
	}

    public class Seats
    {
        public int Id { get; set; }
        public int FlightID { get; set; }
        public int SeatNumber { get; set; }

        public Flight? Flight { get; set; }
    }
}
