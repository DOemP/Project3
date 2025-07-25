using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.DataCtxt;
using BackEnd.Models;
using BackEnd.ModelTransfer;
using BCrypt.Net;
using Org.BouncyCastle.Crypto.Generators;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using System.Text;

using BackEnd.PaginateModel;
using static System.Reflection.Metadata.BlobBuilder;

using Microsoft.AspNetCore.Authorization;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;


namespace BackEnd.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;


		/*public UsersController(DataContext context)
		{
			_context = context;
		}*/
		//ađá
		// GET: api/Users
	/*	[HttpGet]
		public async Task<ActionResult<Paginate<UserDTO1>>> GetUsers()*/

        public UsersController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        //ađá
        // GET: api/Users
        [HttpGet]
		public async Task<ActionResult<IEnumerable<UserDTO1>>> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)

		{
			var users = await _context.Users.ToListAsync();

			var userDtos = users.Select(user => new UserDTO1
			{
				Id = user.Id,
				Name = user.Name,
				Phone = user.Phone,
				PassWord = user.Password,
				Email = user.Email,
				Age = user.Age,
				Gender = user.Gender.ToString(),
				Role = user.Role.ToString()
			}).ToList();

			var paginatedItems = userDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

			var totalCount = userDtos.Count();

			Paginate<UserDTO1> response = new Paginate<UserDTO1>
			{
				Items = paginatedItems,
				PageNumber = pageNumber,
				PageSize = pageSize,
				TotalCount = totalCount
			};

			return Ok(response);
		}


		// GET: api/Users/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Users>> GetUsers(int id)
		{
			var users = await _context.Users.FindAsync(id);

			if (users == null)
			{
				return NotFound();
			}

			return users;
		}

		// PUT: api/Users/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		/* [HttpPut("{id}")]
		 public async Task<IActionResult> PutUsers(int id, Users users)
		 {
			 if (id != users.Id)
			 {
				 return BadRequest();
			 }

			 _context.Entry(users).State = EntityState.Modified;

			 try
			 {
				 await _context.SaveChangesAsync();
			 }
			 catch (DbUpdateConcurrencyException)
			 {
				 if (!UsersExists(id))
				 {
					 return NotFound();
				 }
				 else
				 {
					 throw;
				 }
			 }

			 return NoContent();
		 }*/

		[HttpPut("{id}")]
		public async Task<IActionResult> PutUsers(int id, UserDTO1 userDto)
		{
			if (id != userDto.Id)
			{
				return BadRequest("User ID mismatch.");
			}

			GenDer genderEnum;
			if (!Enum.TryParse(userDto.Gender, true, out genderEnum))
			{
				ModelState.AddModelError("Gender", "Invalid gender value");
				return BadRequest(ModelState);
			}

			RoLe? roleEnum = null;
			if (!string.IsNullOrEmpty(userDto.Role))
			{
				RoLe parsedRole;
				if (Enum.TryParse(userDto.Role, true, out parsedRole))
				{
					roleEnum = parsedRole;
				}
				else
				{
					ModelState.AddModelError("Role", "Invalid role value");
					return BadRequest(ModelState);
				}
			}

			var users = await _context.Users.FindAsync(id);
			if (users == null)
			{
				return NotFound();
			}

			users.Name = userDto.Name;
			users.Phone = userDto.Phone;
			users.Password = userDto.PassWord;
			users.Email = userDto.Email;
			users.Age = userDto.Age;
			users.Gender = genderEnum;
			users.Role = roleEnum;

			_context.Entry(users).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!UsersExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}




		// POST: api/Users
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		/* public async Task<ActionResult<Users>> PostUsers(Users users)
		 {
			 _context.Users.Add(users);
			 await _context.SaveChangesAsync();

			 return CreatedAtAction("GetUsers", new { id = users.Id }, users);
		 }*/
		[HttpPost]
		public async Task<ActionResult<Users>> PostUsers(UserDTO1 userDto)
		{
			GenDer genderEnum;
			if (!Enum.TryParse(userDto.Gender, true, out genderEnum))
			{
				ModelState.AddModelError("Gender", "Invalid gender value");
				return BadRequest(ModelState);
			}

			RoLe? roleEnum = null;
			if (!string.IsNullOrEmpty(userDto.Role))
			{
				RoLe parsedRole;
				if (Enum.TryParse(userDto.Role, true, out parsedRole))
				{
					roleEnum = parsedRole;
				}
				else
				{
					ModelState.AddModelError("Role", "Invalid role value");
					return BadRequest(ModelState);
				}
			}

			/*string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.PassWord);*/

			var users = new Users
			{
				Id = userDto.Id,
				Name = userDto.Name,
				Phone = userDto.Phone,
				Password = userDto.PassWord,
				Email = userDto.Email,
				Age = userDto.Age,
				Gender = genderEnum,
				Role = roleEnum
			};

			_context.Users.Add(users);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetUsers", new { id = users.Id }, users);
		}


		// DELETE: api/Users/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteUsers(int id)
		{
			var users = await _context.Users.FindAsync(id);
			if (users == null)
			{
				return NotFound();
			}

			_context.Users.Remove(users);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool UsersExists(int id)
		{
			return _context.Users.Any(e => e.Id == id);
		}


		//LoginAdmin
		[HttpPost("loginAdmin")]
		public async Task<IActionResult> LoginAdmin([FromBody] LoginDTO loginDto)
		{
			if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
			{
				return BadRequest("Email and Password are required.");
			}

			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

			//ma hoa
			/*if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PassWord)) 
			{
				return Unauthorized("Invalid email or password.");
			}*/


			if (user == null || user.Password != loginDto.Password)
			{
				return Unauthorized();
			}

			// Sinh token JWT
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes("YourSuperSecretKey01234567899999");

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
			new Claim(ClaimTypes.Name, user.Name),
			new Claim(ClaimTypes.Email, user.Email)
				}),
				Expires = DateTime.UtcNow.AddDays(1),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			var tokenString = tokenHandler.WriteToken(token);

			return Ok(new
			{
				token = tokenString,
				user = new
				{
					name = user.Name,
					email = user.Email
				},
				message = "Login successful!"
			});

		}

        private string GenerateJwtToken(Users user)
        {
            // generate token for current user
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);

        }

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDTO model)
		{
			var user = await AuthenticateUserAsync(model.Email, model.Password);

			if (user != null)
			{
				var token = GenerateJwtToken(user);
				return Ok(new { token, name = user.Name });
			}

			return Unauthorized();
		}

		private async Task<Users> AuthenticateUserAsync(string email, string password)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
			return user;
		}

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already exists" });
            }

            if (!Enum.TryParse<GenDer>(model.Gender, true, out var parsedGender))
            {
                return BadRequest(new { message = "Invalid gender value" });
            }

			RoLe parsedRole = RoLe.User;  // Mặc định gán 'User'
			/*if (!string.IsNullOrEmpty(model.Role))  // Sử dụng IsNullOrEmpty để kiểm tra giá trị chuỗi Role
			{
				if (!Enum.TryParse<RoLe>(model.Role, true, out parsedRole))
				{
					return BadRequest(new { message = "Invalid role value" });
				}
			}*/

			var today = DateTime.Today;
            var age = today.Year - model.DOB.Year;
            if (model.DOB.Date > today.AddYears(-age)) age--;

            var newUser = new Users
            {
                Name = model.Name,
                Phone = model.Phone,
                Email = model.Email,
                Dob = model.DOB,
                Age = age,
                Password = model.Password,
                Gender = parsedGender,
				Role = parsedRole
			};

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(newUser);
            return Ok(new { token });
        }

        [AllowAnonymous]
		[HttpPost("forgot-password")]
		public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
			if (user == null)
			{
				return BadRequest(new { message = "No user associated with this email." });
			}

			// Generate a reset token
			var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
			user.PasswordResetToken = resetToken;
			user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
			await _context.SaveChangesAsync();

			// Send email
			var resetUrl = $"http://localhost:3000/reset-password?token={resetToken}";
			SendResetEmail(user.Email, resetUrl);

			return Ok(new { message = "A password reset link has been sent to your email address." });
		}

		private void SendResetEmail(string email, string resetUrl)
		{
			using (var smtp = new SmtpClient("smtp.gmail.com"))
			{
				smtp.Port = 587;
				smtp.Credentials = new NetworkCredential("nxdiem004@gmail.com", "lvqb xrha ggro tlnx\r\n");
				smtp.EnableSsl = true;

				var message = new MailMessage
				{
					From = new MailAddress("nxdiem004@gmail.com"),
					Subject = "Reset your password",
					Body = $"Please reset your password by clicking this link: {resetUrl}",
					IsBodyHtml = true,
				};
				message.To.Add(email);

				smtp.Send(message);
			}
		}

		[AllowAnonymous]
		[HttpPost("reset-password")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u =>
				u.PasswordResetToken == model.Token && u.ResetTokenExpires > DateTime.UtcNow);
			if (user == null)
			{
				return BadRequest(new { message = "Invalid or expired token." });
			}

			// Update the user's password
			user.Password = model.NewPassword;
			user.PasswordResetToken = null; // clear the reset token
			user.ResetTokenExpires = null;  // clear the token expiry
			await _context.SaveChangesAsync();

			return Ok(new { message = "Password has been reset successfully." });
		}

	}
}
