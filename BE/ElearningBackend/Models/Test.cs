using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("TEST")]
    public class Test
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TestID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string TestName { get; set; } = null!;

        [Required]
        public int TestDuration { get; set; }

        public int ScoreToPass { get; set; } = 0;

        public int TotalScore { get; set; } = 0;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ChapterID { get; set; } = null!;

        // Navigation properties
        [ForeignKey("ChapterID")]
        public virtual Chapter? Chapter { get; set; }

        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<TestAttemptRecord> TestAttemptRecords { get; set; } = new List<TestAttemptRecord>();
    }
}
