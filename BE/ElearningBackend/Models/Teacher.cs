using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("TEACHER")]
    public class Teacher
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TeacherID { get; set; } = null!;

        // Navigation properties
        [ForeignKey("TeacherID")]
        public virtual UserTable? User { get; set; }

        public virtual ICollection<Course>? Courses { get; set; }
        public virtual ICollection<Practice>? Practices { get; set; }
        public virtual ICollection<TeacherEducation>? Educations { get; set; }
    }
}
