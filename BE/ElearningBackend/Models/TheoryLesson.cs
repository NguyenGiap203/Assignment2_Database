using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("THEORY_LESSON")]
    public class TheoryLesson
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TheoryLessonID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ChapterID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Column(TypeName = "NVARCHAR(MAX)")]
        public string? Content { get; set; }

        public int DurationMinutes { get; set; } = 0;

        // Navigation property
        [ForeignKey("ChapterID")]
        public virtual Chapter? Chapter { get; set; }
    }
}
