-- ============================================================================
-- AeroCheck - Seed Data / Dados Iniciais de Exemplo
-- Reference / Referência: specs/01-spec-inspections.md & specs/02-plan.md
-- ============================================================================

USE AeroCheck;
GO

-- Aeronaves de fabricantes brasileiros (matrículas fictícias)
-- Brazilian aircraft models (fictitious registrations)
INSERT INTO dbo.Aircraft (Registration, Model, Status, FlightHours) VALUES
('PR-AAA', 'E175',       'Operational',   8420.5),
('PR-BBB', 'E190-E2',    'InMaintenance', 3105.0),
('PR-CCC', 'E195-E2',    'Operational',   1250.5),
('PR-DDD', 'Phenom 300', 'Operational',   5890.0),
('PR-EEE', 'KC-390',     'Operational',    940.0);
GO

-- Inspeções (inclui uma atrasada e uma concluída para o dashboard)
-- Inspections (includes one overdue and one completed for the dashboard)
INSERT INTO dbo.Inspections (AircraftId, Type, Description, DueDate, Status) VALUES
(2, 'C-Check',    N'Inspeção de 6000 horas, estrutura e sistemas', DATEADD(DAY,  10, CAST(GETDATE() AS DATE)), 'InProgress'),
(1, 'A-Check',    N'Inspeção de 600 horas',                        DATEADD(DAY,  -5, CAST(GETDATE() AS DATE)), 'Pending'),
(3, 'A-Check',    N'Inspeção de rotina de 600 horas',              DATEADD(DAY,  30, CAST(GETDATE() AS DATE)), 'Pending'),
(4, 'Estrutural', N'Inspeção estrutural da fuselagem',             DATEADD(DAY,  45, CAST(GETDATE() AS DATE)), 'Pending'),
(5, 'A-Check',    N'Primeira inspeção programada',                 DATEADD(DAY, -20, CAST(GETDATE() AS DATE)), 'Completed');
GO