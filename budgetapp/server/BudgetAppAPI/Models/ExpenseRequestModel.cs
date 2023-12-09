namespace BudgetAppAPI.Models
{
    public class ExpenseRequestModel
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public int Amount { get; set; }
    }
}
