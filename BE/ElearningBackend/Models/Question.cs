using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("QUESTION")]
    public class Question
    {
        [Key, Column(Order = 0, TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TestID { get; set; } = null!;

        [Key, Column(Order = 1)]
        public int QuestionNo { get; set; }

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string QuestionContent { get; set; } = null!;

        public int Score { get; set; } = 0;

        // Navigation properties
        [ForeignKey("TestID")]
        public virtual Test? Test { get; set; }

        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
