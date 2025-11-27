using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("PRACTICE_ATTEMPT_INFO")]
    public class PracticeAttemptInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [StringLength(8)]
        public string? PracticeAttemptID { get; set; }

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string PracticeID { get; set; } = null!;

        [Column(TypeName = "DATETIME")]
        public DateTime StartTime { get; set; } = DateTime.Now;

        [Column(TypeName = "DATETIME")]
        public DateTime? SubmitTime { get; set; }

        public int? Score { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        [ForeignKey("PracticeID")]
        public virtual Practice? Practice { get; set; }
    }
}
