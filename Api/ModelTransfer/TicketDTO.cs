namespace BackEnd.ModelTransfer
{
    public class TicketDTO
    {
        public int Id { get; set; }
        public int FlightID { get; set; }
        public string TicketType { get; set; }  
        public string TripType { get; set; }     
        public int TicketPrice { get; set; }
    }
}
