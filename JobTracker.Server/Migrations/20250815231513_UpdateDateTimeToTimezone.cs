using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDateTimeToTimezone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime[]>(
                name: "InterviewDates",
                table: "JobApplications",
                type: "timestamp with time zone[]",
                nullable: true,
                oldClrType: typeof(DateTime[]),
                oldType: "timestamp[]",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime[]>(
                name: "InterviewDates",
                table: "JobApplications",
                type: "timestamp[]",
                nullable: true,
                oldClrType: typeof(DateTime[]),
                oldType: "timestamp with time zone[]",
                oldNullable: true);
        }
    }
}
