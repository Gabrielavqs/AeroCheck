using AeroCheck.Api.Data;
using AeroCheck.Api.Dtos;
using AeroCheck.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AeroCheck.Api.Controllers;

[ApiController]
[Route("api/inspections")]
public class InspectionsController(AppDbContext db) : ControllerBase
{
    private static readonly string[] ValidTypes = ["A-Check", "C-Check", "Estrutural"];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InspectionResponse>>> GetAll([FromQuery] string? status)
    {
        var query = db.Inspections.AsNoTracking().Include(i => i.Aircraft).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<InspectionStatus>(status, ignoreCase: true, out var parsed))
                return BadRequest(new ProblemDetails { Title = "Status inválido." });

            query = query.Where(i => i.Status == parsed);
        }

        var inspections = await query.OrderBy(i => i.DueDate).ToListAsync();
        return Ok(inspections.Select(ToResponse));
    }

    [HttpPost]
    public async Task<ActionResult<InspectionResponse>> Create(CreateInspectionRequest request)
    {
        if (!ValidTypes.Contains(request.Type))
            return BadRequest(new ProblemDetails { Title = "Tipo inválido. Use A-Check, C-Check ou Estrutural." });

        var aircraft = await db.Aircraft.FindAsync(request.AircraftId);
        if (aircraft is null)
            return NotFound(new ProblemDetails { Title = "Aeronave não encontrada." });

        var inspection = new Inspection
        {
            AircraftId = aircraft.Id,
            Aircraft = aircraft,
            Type = request.Type,
            Description = request.Description.Trim(),
            DueDate = request.DueDate,
            Status = InspectionStatus.Pending // RN1
        };

        db.Inspections.Add(inspection);
        await db.SaveChangesAsync();

        return Created($"/api/inspections/{inspection.Id}", ToResponse(inspection));
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<InspectionResponse>> UpdateStatus(int id, UpdateInspectionStatusRequest request)
    {
        if (!Enum.TryParse<InspectionStatus>(request.Status, ignoreCase: true, out var newStatus))
            return BadRequest(new ProblemDetails { Title = "Status inválido." });

        var inspection = await db.Inspections.Include(i => i.Aircraft).FirstOrDefaultAsync(i => i.Id == id);
        if (inspection is null)
            return NotFound(new ProblemDetails { Title = "Inspeção não encontrada." });

        // RN2: Pending -> InProgress -> Completed
        var allowed =
            (inspection.Status == InspectionStatus.Pending && newStatus == InspectionStatus.InProgress) ||
            (inspection.Status == InspectionStatus.InProgress && newStatus == InspectionStatus.Completed);

        if (!allowed)
            return BadRequest(new ProblemDetails
            {
                Title = $"Transição inválida: {inspection.Status} para {newStatus}."
            });

        inspection.Status = newStatus;
        var aircraft = inspection.Aircraft!;

        if (newStatus == InspectionStatus.InProgress)
        {
            // RN3
            aircraft.Status = AircraftStatus.InMaintenance;
        }
        else
        {
            // RN4
            var hasOtherInProgress = await db.Inspections.AnyAsync(i =>
                i.AircraftId == aircraft.Id && i.Id != inspection.Id && i.Status == InspectionStatus.InProgress);

            if (!hasOtherInProgress)
                aircraft.Status = AircraftStatus.Operational;
        }

        await db.SaveChangesAsync();
        return Ok(ToResponse(inspection));
    }

    private static InspectionResponse ToResponse(Inspection i)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var overdue = i.DueDate < today && i.Status != InspectionStatus.Completed; // RN5

        return new InspectionResponse(
            i.Id,
            i.AircraftId,
            i.Aircraft?.Registration ?? string.Empty,
            i.Type,
            i.Description,
            i.DueDate,
            i.Status.ToString(),
            overdue);
    }
}