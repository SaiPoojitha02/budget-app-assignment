using BudgetAppAPI;
using BudgetAppAPI.Entities;
using BudgetAppAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api")]
    public class BudgetExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BudgetExpenseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("category")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryRequestModel model)
        {
            try
            {
                var claims = new HttpContextAccessor().HttpContext?.User?.Claims.ToList();
                var userId = claims.First(x => x.Type == System.Security.Claims.ClaimTypes.Sid).Value;

                var category = new BudgetCategory { Name = model.Name, Budget = model.Budget, UserId = userId };

                await _context.BudgetCategories.AddAsync(category);
                await _context.SaveChangesAsync();
                return StatusCode(201, category);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to create category" });
            }
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var claims = new HttpContextAccessor().HttpContext?.User?.Claims.ToList();
                var userId = claims.First(x => x.Type == System.Security.Claims.ClaimTypes.Sid).Value;

                var categories = await _context.BudgetCategories
                                                .Where(x=>x.UserId == userId)
                                                .ToListAsync();
                return Ok(categories);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to retrieve categories" });
            }
        }

        [HttpPost("expense")]
        public async Task<IActionResult> CreateExpense([FromBody] ExpenseRequestModel model)
        {
            try
            {
                var claims = new HttpContextAccessor().HttpContext?.User?.Claims.ToList();
                var userId = claims.First(x => x.Type == System.Security.Claims.ClaimTypes.Sid).Value;

                var expense = new Expense { BudgetCategoryId = model.CategoryId, Name = model.Name, Amount = model.Amount, Date= DateTime.Now };
                await _context.Expenses.AddAsync(expense);
                await _context.SaveChangesAsync();
                return StatusCode(201, expense);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to create expense" });
            }
        }

        [HttpGet("expenses")]
        public async Task<IActionResult> GetExpenses()
        {
            try
            {
                var claims = new HttpContextAccessor().HttpContext?.User?.Claims.ToList();
                var userId = claims.First(x => x.Type == System.Security.Claims.ClaimTypes.Sid).Value;

                var expenses = await _context.Expenses
                                            .Include(e => e.BudgetCategory)
                                            .ThenInclude(b=>b.User)
                                            .Where(x=>x.BudgetCategory.UserId == userId)
                                            .ToListAsync();
                return Ok(expenses);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to retrieve expenses" });
            }
        }
    }
}