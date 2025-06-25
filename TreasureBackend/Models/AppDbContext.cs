using Microsoft.EntityFrameworkCore;

namespace TreasureBackend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TreasureHistory> TreasureHistory { get; set; }
    }
}