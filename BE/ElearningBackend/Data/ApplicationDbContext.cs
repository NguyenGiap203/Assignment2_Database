// Data/ApplicationDbContext.cs
using ElearningBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ElearningBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Main entities
        public DbSet<UserTable> UserTable { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<TeacherEducation> TeacherEducations { get; set; }

        // Course related
        public DbSet<Course> Courses { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<VideoLesson> VideoLessons { get; set; }
        public DbSet<TheoryLesson> TheoryLessons { get; set; }

        // Exercise and Test
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }

        // Practice
        public DbSet<Practice> Practices { get; set; }

        // Attempts
        public DbSet<ExerciseAttempt> ExerciseAttempts { get; set; }
        public DbSet<TestAttemptRecord> TestAttemptRecords { get; set; }
        public DbSet<PracticeAttemptInfo> PracticeAttemptInfos { get; set; }

        // User interactions
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CourseRating> CourseRatings { get; set; }
        public DbSet<CourseEnrollment> CourseEnrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite keys
            modelBuilder.Entity<Question>()
                .HasKey(q => new { q.TestID, q.QuestionNo });

            modelBuilder.Entity<Answer>()
                .HasKey(a => new { a.TestID, a.QuestionNo, a.AnswerNo });

            modelBuilder.Entity<Comment>()
                .HasKey(c => new { c.UserID, c.CreatedAt });

            modelBuilder.Entity<CourseRating>()
                .HasKey(cr => new { cr.UserID, cr.CourseID });

            modelBuilder.Entity<CourseEnrollment>()
                .HasKey(ce => new { ce.UserID, ce.CourseID });

            // Configure relationships
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.TeacherID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.Teacher)
                .WithMany(t => t.Courses)
                .HasForeignKey(c => c.TeacherID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Chapter>()
                .HasOne(ch => ch.Course)
                .WithMany(c => c.Chapters)
                .HasForeignKey(ch => ch.CourseID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VideoLesson>()
                .HasOne(vl => vl.Chapter)
                .WithMany(ch => ch.VideoLessons)
                .HasForeignKey(vl => vl.ChapterID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TheoryLesson>()
                .HasOne(tl => tl.Chapter)
                .WithMany(ch => ch.TheoryLessons)
                .HasForeignKey(tl => tl.ChapterID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Exercise>()
                .HasOne(e => e.Chapter)
                .WithMany(ch => ch.Exercises)
                .HasForeignKey(e => e.ChapterID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Test>()
                .HasOne(t => t.Chapter)
                .WithMany(ch => ch.Tests)
                .HasForeignKey(t => t.ChapterID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Test)
                .WithMany(t => t.Questions)
                .HasForeignKey(q => q.TestID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => new { a.TestID, a.QuestionNo })
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Practice>()
                .HasOne(p => p.Teacher)
                .WithMany(t => t.Practices)
                .HasForeignKey(p => p.TeacherID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ExerciseAttempt>()
                .HasOne(ea => ea.User)
                .WithMany(u => u.ExerciseAttempts)
                .HasForeignKey(ea => ea.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ExerciseAttempt>()
                .HasOne(ea => ea.Exercise)
                .WithMany(e => e.ExerciseAttempts)
                .HasForeignKey(ea => ea.ExerciseID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TestAttemptRecord>()
                .HasOne(tar => tar.User)
                .WithMany(u => u.TestAttemptRecords)
                .HasForeignKey(tar => tar.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TestAttemptRecord>()
                .HasOne(tar => tar.Test)
                .WithMany(t => t.TestAttemptRecords)
                .HasForeignKey(tar => tar.TestID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PracticeAttemptInfo>()
                .HasOne(pai => pai.User)
                .WithMany(u => u.PracticeAttemptInfos)
                .HasForeignKey(pai => pai.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PracticeAttemptInfo>()
                .HasOne(pai => pai.Practice)
                .WithMany(p => p.PracticeAttemptInfos)
                .HasForeignKey(pai => pai.PracticeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Course)
                .WithMany(co => co.Comments)
                .HasForeignKey(c => c.CourseID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseRating>()
                .HasOne(cr => cr.User)
                .WithMany(u => u.CourseRatings)
                .HasForeignKey(cr => cr.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseRating>()
                .HasOne(cr => cr.Course)
                .WithMany(c => c.CourseRatings)
                .HasForeignKey(cr => cr.CourseID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseEnrollment>()
                .HasOne(ce => ce.User)
                .WithMany(u => u.CourseEnrollments)
                .HasForeignKey(ce => ce.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseEnrollment>()
                .HasOne(ce => ce.Course)
                .WithMany(c => c.CourseEnrollments)
                .HasForeignKey(ce => ce.CourseID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherEducation>()
                .HasOne(te => te.Teacher)
                .WithMany(t => t.Educations)
                .HasForeignKey(te => te.TeacherID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
