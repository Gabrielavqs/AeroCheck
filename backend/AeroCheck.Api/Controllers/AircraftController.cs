using AeroCheck.Api.Data;
using AeroCheck.Api.Dtos;
using AeroCheck.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AeroCheck.Api.Controllers;

[ApiController]
[Route("api/aircraft")]
public class AircraftController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AircraftResponse>>> GetAll()
    {
        var aircraft = await db.Aircraft
            .AsNoTracking()
            .OrderBy(a => a.Registration)
            .ToListAsync();

        return Ok(aircraft.Select(ToResponse));
    }

    [HttpPost]
    public async Task<ActionResult<AircraftResponse>> Create(CreateAircraftRequest request)
    {
        var registration = request.Registration.Trim().ToUpperInvariant();

        var exists = await db.Aircraft.AnyAsync(a => a.Registration == registration);
        if (exists)
            return Conflict(new ProblemDetails { Title = $"Já existe uma aeronave com a matrícula {registration}." });

        var aircraft = new Aircraft
        {
            Registration = registration,
            Model = request.Model.Trim(),
            FlightHours = request.FlightHours,
            Status = AircraftStatus.Operational
        };

        db.Aircraft.Add(aircraft);
        await db.SaveChangesAsync();

        return Created($"/api/aircraft/{aircraft.Id}", ToResponse(aircraft));
    }

    private static AircraftResponse ToResponse(Aircraft a) =>
        new(a.Id, a.Registration, a.Model, a.Status.ToString(), a.FlightHours);
}