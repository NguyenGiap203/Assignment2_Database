using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("EXERCISE_ATTEMPT")]
    public class ExerciseAttempt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [StringLength(8)]
        public string? AttemptID { get; set; }

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ExerciseID { get; set; } = null!;

        [Column(TypeName = "DATETIME")]
        public DateTime StartTime { get; set; } = DateTime.Now;

        [Column(TypeName = "DATETIME")]
        public DateTime? SubmitTime { get; set; }

        [Column(TypeName = "DECIMAL(4, 2)")]
        public decimal? Score { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        [ForeignKey("ExerciseID")]
        public virtual Exercise? Exercise { get; set; }
    }
}
