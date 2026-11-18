using System.ComponentModel.DataAnnotations;

namespace AeroCheck.Api.Dtos;

public record AircraftResponse(
    int Id,
    string Registration,
    string Model,
    string Status,
    decimal FlightHours);

public record CreateAircraftRequest(
    [Required, RegularExpression(@"^[A-Z]{2}-[A-Z]{3}$", ErrorMessage = "Matrícula deve seguir o formato AA-AAA (ex.: PR-EMB).")]
    string Registration,
    [Required, StringLength(50)]
    string Model,
    [Range(0, 10000000)]
    decimal FlightHours);

public record InspectionResponse(
    int Id,
    int AircraftId,
    string AircraftRegistration,
    string Type,
    string Description,
    DateOnly DueDate,
    string Status,
    bool IsOverdue);

public record CreateInspectionRequest(
    [Range(1, int.MaxValue)]
    int AircraftId,
    [Required]
    string Type,
    [Required, StringLength(300)]
    string Description,
    DateOnly DueDate);

public record UpdateInspectionStatusRequest([Required] string Status);

public record DashboardSummary(
    int TotalAircraft,
    int AircraftInMaintenance,
    int PendingInspections,
    int InProgressInspections,
    int OverdueInspections);