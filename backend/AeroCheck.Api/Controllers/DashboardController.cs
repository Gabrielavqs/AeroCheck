using AeroCheck.Api.Data;
using AeroCheck.Api.Dtos;
using AeroCheck.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AeroCheck.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummary>> GetSummary()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var totalAircraft = await db.Aircraft.CountAsync();
        var inMaintenance = await db.Aircraft.CountAsync(a => a.Status == AircraftStatus.InMaintenance);
        var pending = await db.Inspections.CountAsync(i => i.Status == InspectionStatus.Pending);
        var inProgress = await db.Inspections.CountAsync(i => i.Status == InspectionStatus.InProgress);
        var overdue = await db.Inspections.CountAsync(i =>
            i.DueDate < today && i.Status != InspectionStatus.Completed);

        return Ok(new DashboardSummary(totalAircraft, inMaintenance, pending, inProgress, overdue));
    }
}