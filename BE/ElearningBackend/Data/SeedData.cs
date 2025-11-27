// Data/SeedData.cs
using ElearningBackend.Data;
using ElearningBackend.Models;

public static class SeedData
{
    public static void SeedPosts(ApplicationDbContext context)
    {
        if (!context.Posts.Any())
        {
            var posts = new[]
            {
                new Post
                {
                    PostID = "PST0001",
                    Title = "Kinh nghiệm học JavaScript",
                    Content = "Đây là chia sẻ kinh nghiệm học JS của mình...",
                    UserID = "USR0001", // Phải tồn tại trong UserTable
                    CreatedAt = new DateTime(2025, 5, 20)
                },
                new Post
                {
                    PostID = "PST0002",
                    Title = "Tips học SQL hiệu quả",
                    Content = "Một số mẹo học SQL cho người mới bắt đầu...",
                    UserID = "USR0002",
                    CreatedAt = new DateTime(2025, 6, 15)
                }
            };

            context.Posts.AddRange(posts);
            context.SaveChanges();
        }
    }
}
