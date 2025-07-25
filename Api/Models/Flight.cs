namespace BackEnd.Models
{
    public class Flight
    {
        //sfas
        public int Id { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }

        public ICollection<Ticket>? Tickets { get; set; }
        public ICollection<Seats>? Seats { get; set; }
    }
}
