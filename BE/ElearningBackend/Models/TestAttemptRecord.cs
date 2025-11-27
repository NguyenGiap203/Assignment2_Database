using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("TEST_ATTEMPT_RECORDS")]
    public class TestAttemptRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [StringLength(8)]
        public string? TestAttemptID { get; set; }

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TestID { get; set; } = null!;

        [Column(TypeName = "DATETIME")]
        public DateTime StartTime { get; set; } = DateTime.Now;

        [Column(TypeName = "DATETIME")]
        public DateTime? SubmitTime { get; set; }

        [Column(TypeName = "DECIMAL(4, 2)")]
        public decimal? Score { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        [ForeignKey("TestID")]
        public virtual Test? Test { get; set; }
    }
}
