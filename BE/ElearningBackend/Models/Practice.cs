using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("PRACTICES")]
    public class Practice
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string PracticeID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(50)")]
        [StringLength(50)]
        public string Difficulty { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string Content { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TeacherID { get; set; } = null!;

        // Navigation properties
        [ForeignKey("TeacherID")]
        public virtual Teacher? Teacher { get; set; }

        public virtual ICollection<PracticeAttemptInfo>? PracticeAttemptInfos { get; set; }
    }
}
