using BackEnd.Models;

namespace BackEnd.ModelTransfer
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public long Amount { get; set; }
        public int TotalQuantity { get; set; }
        public string Status { get; set; }
	}
}
