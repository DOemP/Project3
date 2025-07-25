using BackEnd.Models;

namespace BackEnd.ModelTransfer
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public DateTime? Dob { get; set; }
        public string? FirstName { get; set; }
		public string? LastName { get; set; }
        public string? PassportNumber {  get; set; } 
		public string? Email { get; set; }
        public string? PassWord { get; set; }
        public int Age { get; set; }
        public string? Gender { get; set; }
        public string? Role { get; set; }
    }
}
