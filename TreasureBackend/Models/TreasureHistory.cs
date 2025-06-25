using System;
using System.ComponentModel.DataAnnotations;

namespace TreasureBackend.Models
{
    public class TreasureHistory
    {
        [Key]
        public int Id { get; set; }

        public int Rows { get; set; }
        public int Columns { get; set; }
        public int P { get; set; }

        public string MatrixJson { get; set; } = string.Empty;

        public double Result { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}