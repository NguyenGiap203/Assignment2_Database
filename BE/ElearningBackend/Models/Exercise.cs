using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("EXERCISE")]
    public class Exercise
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ExerciseID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ChapterID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string ExDescription { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string SampleAnswer { get; set; } = null!;

        [Required]
        public int MinPassingScore { get; set; }

        // Navigation property
        [ForeignKey("ChapterID")]
        public virtual Chapter? Chapter { get; set; }

        public virtual ICollection<ExerciseAttempt>? ExerciseAttempts { get; set; }
    }
}
