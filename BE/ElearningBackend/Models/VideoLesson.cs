using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("VIDEO_LESSON")]
    public class VideoLesson
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string VideoID { get; set; } = null!;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string ChapterID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(1000)")]
        [StringLength(1000)]
        public string VideoURL { get; set; } = null!;

        [Required]
        public int DurationMinutes { get; set; } = 0;

        // Navigation property
        [ForeignKey("ChapterID")]
        public virtual Chapter? Chapter { get; set; }
    }
}
