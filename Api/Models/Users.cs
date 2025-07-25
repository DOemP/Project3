namespace BackEnd.Models
{

    public enum GenDer
    {
        Male,
        FeMale
    }

    public enum RoLe 
    {
        User,
        Admin
    }
    public class Users
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string Phone { get; set; }

		public string? Password { get; set; }
        public DateTime? Dob { get; set; }
		public string Email { get; set; }
        public string? FirstName { get; set; }

        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public string? Passport { get; set; }

        public string? LastName { get; set; }

        public int Age { get; set; }
        public GenDer Gender { get; set; }
        public RoLe? Role { get; set; }

        public ICollection<Order>? Orders { get; set; }

    }
}
