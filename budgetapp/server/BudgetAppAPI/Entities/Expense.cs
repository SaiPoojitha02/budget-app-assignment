using Microsoft.AspNetCore.Identity;

namespace BudgetAppAPI.Entities
{
    public class Expense
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Amount { get; set; }
        public int BudgetCategoryId { get; set; }
        public DateTime Date { get; set; }
        public BudgetCategory BudgetCategory { get; set; }
    }
}
