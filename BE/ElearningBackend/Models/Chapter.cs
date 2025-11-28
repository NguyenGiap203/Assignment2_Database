using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("CHAPTER")]
    public class Chapter
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ChapterID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string CourseID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string ChapterTitle { get; set; } = null!;

        [Required]
        public int ChapterOrder { get; set; }

        [Column(TypeName = "NVARCHAR(MAX)")]
        public string? ChapterDescription { get; set; }

        // Navigation properties
        [ForeignKey("CourseID")]
        public virtual Course? Course { get; set; }

        public virtual ICollection<VideoLesson>? VideoLessons { get; set; }
        public virtual ICollection<TheoryLesson>? TheoryLessons { get; set; }
        public virtual ICollection<Exercise>? Exercises { get; set; }
        public virtual ICollection<Test>? Tests { get; set; }
    }
}
