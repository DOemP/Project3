namespace BackEnd.Models
{

    public enum Tickettype
    {
        OneWay,
        RoundTrip,
        MultiStage
    }

    public enum Triptype
    {
        Popular,
        Merchant
    }
    public class Ticket
    {
        public int Id { get; set; }
        public int FlightID { get; set; }
        public Triptype TripType { get; set; } 
        public Tickettype TicketType { get; set; }  
        public int TicketPrice { get; set; }
        public Flight? Flight { get; set; }
    }
}
