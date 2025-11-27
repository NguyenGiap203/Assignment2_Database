// Models/Post.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("POSTS")]
    public class Post
    {
        [Key]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string PostID { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(200)")]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string Content { get; set; } = null!;

        [Column(TypeName = "DATETIME")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        [Column(TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string UserID { get; set; } = null!;

        // Navigation property
        [ForeignKey("UserID")]
        public virtual UserTable? User { get; set; }

        public virtual ICollection<Comment>? Comments { get; set; }
    }
}
