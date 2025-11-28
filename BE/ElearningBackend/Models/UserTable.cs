using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("USERTABLE")]
    public class UserTable
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Required]
        [Column(TypeName = "VARCHAR(30)")]
        [StringLength(30)]
        public string AccountName { get; set; } = null!;

        [Required]
        [Column(TypeName = "VARCHAR(128)")]
        [StringLength(128)]
        public string AccountPassword { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(100)")]
        [StringLength(100)]
        public string FullName { get; set; } = null!;

        [Required]
        [Column(TypeName = "VARCHAR(255)")]
        [StringLength(255)]
        public string Email { get; set; } = null!;

        [Column(TypeName = "VARCHAR(15)")]
        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string? Nation { get; set; }

        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string? Province { get; set; }

        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string? Ward { get; set; }

        [Column(TypeName = "DATE")]
        public DateTime? EnrollmentDate { get; set; }

        [Required]
        [Column(TypeName = "BIT")]
        public bool AccountState { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Post>? Posts { get; set; }
        public virtual ICollection<Comment>? Comments { get; set; }
        public virtual ICollection<CourseEnrollment>? CourseEnrollments { get; set; }
        public virtual ICollection<CourseRating>? CourseRatings { get; set; }
        public virtual ICollection<ExerciseAttempt>? ExerciseAttempts { get; set; }
        public virtual ICollection<TestAttemptRecord>? TestAttemptRecords { get; set; }
        public virtual ICollection<PracticeAttemptInfo>? PracticeAttemptInfos { get; set; }
        public virtual Teacher? Teacher { get; set; }
    }
}
