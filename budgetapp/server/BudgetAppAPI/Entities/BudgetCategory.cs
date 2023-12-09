using Microsoft.AspNetCore.Identity;

namespace BudgetAppAPI.Entities
{
    public class BudgetCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Budget { get; set; }
        public string UserId { get; set; }
        public IdentityUser User { get; set; }
    }
}
