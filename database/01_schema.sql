IF DB_ID('AeroCheck') IS NULL
    CREATE DATABASE AeroCheck;
GO
USE AeroCheck;
GO
IF OBJECT_ID('dbo.Inspections') IS NOT NULL DROP TABLE dbo.Inspections;
IF OBJECT_ID('dbo.Aircraft') IS NOT NULL DROP TABLE dbo.Aircraft;
GO
CREATE TABLE dbo.Aircraft (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Registration NVARCHAR(10)  NOT NULL,
    Model        NVARCHAR(50)  NOT NULL,
    Status       NVARCHAR(20)  NOT NULL CONSTRAINT DF_Aircraft_Status DEFAULT 'Operational',
    FlightHours  DECIMAL(10,1) NOT NULL CONSTRAINT DF_Aircraft_Hours DEFAULT 0,
    CONSTRAINT UQ_Aircraft_Registration UNIQUE (Registration),
    CONSTRAINT CK_Aircraft_Status CHECK (Status IN ('Operational', 'InMaintenance')),
    CONSTRAINT CK_Aircraft_Hours CHECK (FlightHours >= 0)
);
GO
CREATE TABLE dbo.Inspections (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    AircraftId  INT           NOT NULL,
    Type        NVARCHAR(30)  NOT NULL,
    Description NVARCHAR(300) NOT NULL,
    DueDate     DATE          NOT NULL,
    Status      NVARCHAR(20)  NOT NULL CONSTRAINT DF_Inspections_Status DEFAULT 'Pending',
    CONSTRAINT FK_Inspections_Aircraft FOREIGN KEY (AircraftId) REFERENCES dbo.Aircraft(Id),
    CONSTRAINT CK_Inspections_Status CHECK (Status IN ('Pending', 'InProgress', 'Completed')),
    CONSTRAINT CK_Inspections_Type CHECK (Type IN ('A-Check', 'C-Check', 'Estrutural'))
);
GO
CREATE INDEX IX_Inspections_AircraftId ON dbo.Inspections(AircraftId);
CREATE INDEX IX_Inspections_Status ON dbo.Inspections(Status);
GO