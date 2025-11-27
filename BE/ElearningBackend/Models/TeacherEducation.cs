using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("TEACHER_EDUCATION")]
    public class TeacherEducation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EduID { get; set; }

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TeacherID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string Degree { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(100)")]
        [StringLength(100)]
        public string Major { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(100)")]
        [StringLength(100)]
        public string School { get; set; } = null!;

        [Column(TypeName = "DATE")]
        public DateTime? StartTime { get; set; }

        [Column(TypeName = "DATE")]
        public DateTime? EndTime { get; set; }

        // Navigation property
        [ForeignKey("TeacherID")]
        public virtual Teacher? Teacher { get; set; }
    }
}
