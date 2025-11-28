using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElearningBackend.Models
{
    [Table("ANSWER")]
    public class Answer
    {
        [Key, Column(Order = 0, TypeName = "CHAR(10)")]
        [StringLength(10)]
        public string TestID { get; set; } = null!;

        [Key, Column(Order = 1)]
        public int QuestionNo { get; set; }

        [Key, Column(Order = 2)]
        public int AnswerNo { get; set; }

        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string AnswerContent { get; set; } = null!;

        [Required]
        [Column(TypeName = "BIT")]
        public bool IsCorrect { get; set; } = false;

        // Navigation property
        [ForeignKey("TestID,QuestionNo")]
        public virtual Question? Question { get; set; }
    }
}
