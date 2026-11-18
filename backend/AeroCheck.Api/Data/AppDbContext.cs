using AeroCheck.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AeroCheck.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Aircraft> Aircraft => Set<Aircraft>();
    public DbSet<Inspection> Inspections => Set<Inspection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Aircraft>(entity =>
        {
            entity.ToTable("Aircraft");
            entity.Property(a => a.Registration).HasMaxLength(10).IsRequired();
            entity.Property(a => a.Model).HasMaxLength(50).IsRequired();
            entity.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(a => a.FlightHours).HasPrecision(10, 1);
            entity.HasIndex(a => a.Registration).IsUnique();
        });

        modelBuilder.Entity<Inspection>(entity =>
        {
            entity.ToTable("Inspections");
            entity.Property(i => i.Type).HasMaxLength(30).IsRequired();
            entity.Property(i => i.Description).HasMaxLength(300).IsRequired();
            entity.Property(i => i.Status).HasConversion<string>().HasMaxLength(20);
            entity.HasOne(i => i.Aircraft)
                  .WithMany(a => a.Inspections)
                  .HasForeignKey(i => i.AircraftId);
        });
    }
}
