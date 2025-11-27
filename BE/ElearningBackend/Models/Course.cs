using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("COURSE")]
    public class Course
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string CourseID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(255)")]
        [StringLength(255)]
        public string CourseName { get; set; } = null!;

        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string CourseState { get; set; } = "Sắp ra mắt";

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TeacherID { get; set; } = null!;

        [Column(TypeName = "DECIMAL(10, 2)")]
        public decimal TotalDuration { get; set; } = 0;

        public int NumTests { get; set; } = 0;

        public int NumTheoryLessons { get; set; } = 0;

        public int NumExercises { get; set; } = 0;

        public int NumVideos { get; set; } = 0;

        [Column(TypeName = "DECIMAL(2, 1)")]
        public decimal AverageRating { get; set; } = 0;

        public int NumRatings { get; set; } = 0;

        public int NumStudents { get; set; } = 0;

        // Navigation properties
        [ForeignKey("TeacherID")]
        public virtual Teacher? Teacher { get; set; }

        public virtual ICollection<Chapter>? Chapters { get; set; }
        public virtual ICollection<CourseEnrollment>? CourseEnrollments { get; set; }
        public virtual ICollection<CourseRating>? CourseRatings { get; set; }
        public virtual ICollection<Comment>? Comments { get; set; }
    }
}
