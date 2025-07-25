using BackEnd.Models;

namespace BackEnd.ModelTransfer
{
    public class RegisterDTO
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime DOB { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
/*        public string Role { get; set; }*/
    }
}
