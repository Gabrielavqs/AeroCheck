using AeroCheck.Api.Controllers;
using AeroCheck.Api.Data;
using AeroCheck.Api.Dtos;
using AeroCheck.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AeroCheck.Tests;

/// <summary>
/// Unit tests for business rules from spec 01 (RN1 to RN6).
/// Uses an in-memory database: requires neither SQL Server nor HTTP.
/// Testes das regras de negócio da spec 01 (RN1 a RN6).
/// Usam banco em memória: não precisam de SQL Server nem de HTTP.
/// </summary>
public class InspectionRulesTests
{
    private static AppDbContext NewDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // fresh database per test / um banco novo por teste
            .Options;
        return new AppDbContext(options);
    }

    private static async Task<Aircraft> AddAircraftAsync(AppDbContext db, string registration = "PR-AAA")
    {
        var aircraft = new Aircraft { Registration = registration, Model = "E175" };
        db.Aircraft.Add(aircraft);
        await db.SaveChangesAsync();
        return aircraft;
    }

    private static async Task<InspectionResponse> CreateInspectionAsync(
        AppDbContext db, int aircraftId, DateOnly? dueDate = null)
    {
        var request = new CreateInspectionRequest(
            aircraftId,
            "A-Check",
            "Routine inspection / Inspeção de rotina",
            dueDate ?? DateOnly.FromDateTime(DateTime.Today.AddDays(10)));
        var result = await new InspectionsController(db).Create(request);
        var created = Assert.IsType<CreatedResult>(result.Result);
        return Assert.IsType<InspectionResponse>(created.Value);
    }

    private static async Task<ActionResult?> ChangeStatusAsync(AppDbContext db, int inspectionId, string status)
    {
        var result = await new InspectionsController(db)
            .UpdateStatus(inspectionId, new UpdateInspectionStatusRequest(status));
        return result.Result;
    }

    [Fact] // RN1
    public async Task New_inspection_starts_pending()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);

        var inspection = await CreateInspectionAsync(db, aircraft.Id);

        Assert.Equal("Pending", inspection.Status);
    }

    [Fact] // RN2
    public async Task Cannot_jump_from_pending_to_completed()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var inspection = await CreateInspectionAsync(db, aircraft.Id);

        var result = await ChangeStatusAsync(db, inspection.Id, "Completed");

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact] // RN2
    public async Task Cannot_reopen_a_completed_inspection()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var inspection = await CreateInspectionAsync(db, aircraft.Id);
        await ChangeStatusAsync(db, inspection.Id, "InProgress");
        await ChangeStatusAsync(db, inspection.Id, "Completed");

        var result = await ChangeStatusAsync(db, inspection.Id, "InProgress");

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact] // RN3
    public async Task Starting_an_inspection_puts_the_aircraft_in_maintenance()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var inspection = await CreateInspectionAsync(db, aircraft.Id);

        var result = await ChangeStatusAsync(db, inspection.Id, "InProgress");

        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(AircraftStatus.InMaintenance, (await db.Aircraft.FindAsync(aircraft.Id))!.Status);
    }

    [Fact] // RN4
    public async Task Completing_the_only_inspection_returns_the_aircraft_to_operational()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var inspection = await CreateInspectionAsync(db, aircraft.Id);
        await ChangeStatusAsync(db, inspection.Id, "InProgress");

        await ChangeStatusAsync(db, inspection.Id, "Completed");

        Assert.Equal(AircraftStatus.Operational, (await db.Aircraft.FindAsync(aircraft.Id))!.Status);
    }

    [Fact] // RN4
    public async Task Aircraft_stays_in_maintenance_while_another_inspection_is_in_progress()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var first = await CreateInspectionAsync(db, aircraft.Id);
        var second = await CreateInspectionAsync(db, aircraft.Id);
        await ChangeStatusAsync(db, first.Id, "InProgress");
        await ChangeStatusAsync(db, second.Id, "InProgress");

        await ChangeStatusAsync(db, first.Id, "Completed");
        Assert.Equal(AircraftStatus.InMaintenance, (await db.Aircraft.FindAsync(aircraft.Id))!.Status);

        await ChangeStatusAsync(db, second.Id, "Completed");
        Assert.Equal(AircraftStatus.Operational, (await db.Aircraft.FindAsync(aircraft.Id))!.Status);
    }

    [Fact] // RN5
    public async Task Inspection_past_due_is_overdue_until_completed()
    {
        using var db = NewDb();
        var aircraft = await AddAircraftAsync(db);
        var yesterday = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));
        var inspection = await CreateInspectionAsync(db, aircraft.Id, yesterday);
        Assert.True(inspection.IsOverdue);

        await ChangeStatusAsync(db, inspection.Id, "InProgress");
        var result = Assert.IsType<OkObjectResult>(await ChangeStatusAsync(db, inspection.Id, "Completed"));
        var completed = Assert.IsType<InspectionResponse>(result.Value);

        Assert.False(completed.IsOverdue);
    }

    [Fact] // RN6
    public async Task Duplicate_registration_is_a_conflict()
    {
        using var db = NewDb();
        var controller = new AircraftController(db);
        var request = new CreateAircraftRequest("PR-AAA", "E175", 0);

        var first = await controller.Create(request);
        var second = await controller.Create(request);

        Assert.IsType<CreatedResult>(first.Result);
        Assert.IsType<ConflictObjectResult>(second.Result);
    }
}