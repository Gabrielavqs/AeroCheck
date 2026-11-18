namespace AeroCheck.Api.Models;

public enum InspectionStatus
{
    Pending,
    InProgress,
    Completed
}

public class Inspection
{
    public int Id { get; set; }
    public int AircraftId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly DueDate { get; set; }
    public InspectionStatus Status { get; set; } = InspectionStatus.Pending;
    public Aircraft? Aircraft { get; set; }
}
