using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("COMMENTS")]
    public class Comment
    {
        [Key, Column(Order = 0, TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        [Key, Column(Order = 1, TypeName = "DATETIME")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string Content { get; set; } = null!;

        public int ReplyCount { get; set; } = 0;

        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string? ReplyUserID { get; set; }

        [Column(TypeName = "DATETIME")]
        public DateTime? ReplyCreatedAt { get; set; }

        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string? PostID { get; set; }

        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string? CourseID { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        [ForeignKey("PostID")]
        public virtual Post? Post { get; set; }

        [ForeignKey("CourseID")]
        public virtual Course? Course { get; set; }

        // Self-referencing for replies
        [ForeignKey("ReplyUserID,ReplyCreatedAt")]
        public virtual Comment? ReplyToComment { get; set; }
    }
}
