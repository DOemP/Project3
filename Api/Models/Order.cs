    namespace BackEnd.Models
    {
        public enum Status
        {
            Pending,
            Completed
        }

        public class Order
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public long Amount { get; set; }
            public int TotalQuantity { get; set; }
            public Status Status { get; set; }
            public DateTime CreatedAt { get; set; }
            public Users? User { get; set; }
            public ICollection<OrderDetails>? OrderDetails { get; set; }

            public Order()
            {
                CreatedAt = DateTime.UtcNow;
            }
        }

    }
