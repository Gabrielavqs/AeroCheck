namespace AeroCheck.Api.Models;

public enum AircraftStatus
{
    Operational,
    InMaintenance
}

public class Aircraft
{
    public int Id { get; set; }
    public string Registration { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public AircraftStatus Status { get; set; } = AircraftStatus.Operational;
    public decimal FlightHours { get; set; }
    public List<Inspection> Inspections { get; set; } = new();
}
