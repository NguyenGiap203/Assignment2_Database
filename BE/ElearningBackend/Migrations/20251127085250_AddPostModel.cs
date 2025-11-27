using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElearningBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddPostModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "USERTABLE",
                columns: table => new
                {
                    UserID = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    AccountName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    AccountPassword = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Nation = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Province = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Ward = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AccountState = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_USERTABLE", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "POSTS",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorId = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_POSTS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_POSTS_USERTABLE_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "USERTABLE",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_POSTS_AuthorId",
                table: "POSTS",
                column: "AuthorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "POSTS");

            migrationBuilder.DropTable(
                name: "USERTABLE");
        }
    }
}
