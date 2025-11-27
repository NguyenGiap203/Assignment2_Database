using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("COURSE_RATING")]
    public class CourseRating
    {
        [Key, Column(Order = 0, TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Key, Column(Order = 1, TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string CourseID { get; set; } = null!;

        public int? RatingValue { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        [ForeignKey("CourseID")]
        public virtual Course? Course { get; set; }
    }
}
