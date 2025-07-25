using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.DataCtxt
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Ticket> Ticket { get; set; }
        public DbSet<Seats> Seats { get; set; }

		public DbSet<Order> Orders { get; set; }
		public DbSet<OrderDetails> OrderDetails { get; set; }

        public DbSet<Blog> Blogs { get; set; }

        public DbSet<Flight> Flights { get; set; }
        public DbSet<FlightTimes> FlightTimes { get; set; }
        

        // enum lưu dạng chuỗi
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Table Ticket
            modelBuilder.Entity<Ticket>()
                .Property(t => t.TicketType)
                .HasConversion<string>();

            modelBuilder.Entity<Ticket>()
                .Property(t => t.TripType)
                .HasConversion<string>();

            // Table Users
            modelBuilder.Entity<Users>()
                .Property(u => u.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<Users>()
                .Property(u => u.Role)
                .HasConversion<string>();

			//Table Order
			modelBuilder.Entity<Order>()
				.Property(u => u.Status)
				.HasConversion<string>();

            //Table FlightTime

            modelBuilder.Entity<FlightTimes>()
                .Property(u => u.FlightType)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }

    }
}
