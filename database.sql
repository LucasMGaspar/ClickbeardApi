
-- Script de criação do banco de dados ClickBeard


-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS `click-beard` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `click-beard`;

-- Tabela: User

CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  INDEX `User_email_idx` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Tabela: Barber

CREATE TABLE `Barber` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `age` INTEGER NOT NULL,
  `hireDate` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  INDEX `Barber_name_idx` (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela: Specialty

CREATE TABLE `Specialty` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `Specialty_name_key` (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Tabela: BarberSpecialty (Relacionamento N:N)

CREATE TABLE `BarberSpecialty` (
  `id` VARCHAR(191) NOT NULL,
  `barberId` VARCHAR(191) NOT NULL,
  `specialtyId` VARCHAR(191) NOT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `BarberSpecialty_barberId_specialtyId_key` (`barberId`, `specialtyId`),
  KEY `BarberSpecialty_specialtyId_idx` (`specialtyId`),
  
  CONSTRAINT `BarberSpecialty_barberId_fkey` 
    FOREIGN KEY (`barberId`) 
    REFERENCES `Barber` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    
  CONSTRAINT `BarberSpecialty_specialtyId_fkey` 
    FOREIGN KEY (`specialtyId`) 
    REFERENCES `Specialty` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Tabela: Appointment

CREATE TABLE `Appointment` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `barberId` VARCHAR(191) NOT NULL,
  `specialtyId` VARCHAR(191) NOT NULL,
  `appointmentDate` DATETIME(3) NOT NULL,
  `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  KEY `Appointment_userId_idx` (`userId`),
  KEY `Appointment_barberId_idx` (`barberId`),
  KEY `Appointment_specialtyId_idx` (`specialtyId`),
  KEY `Appointment_appointmentDate_idx` (`appointmentDate`),
  KEY `Appointment_status_idx` (`status`),
  
  -- Constraint única comentada por causa do problema com cancelamentos
  -- UNIQUE KEY `Appointment_barberId_appointmentDate_key` (`barberId`, `appointmentDate`),
  
  CONSTRAINT `Appointment_userId_fkey` 
    FOREIGN KEY (`userId`) 
    REFERENCES `User` (`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
    
  CONSTRAINT `Appointment_barberId_fkey` 
    FOREIGN KEY (`barberId`) 
    REFERENCES `Barber` (`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
    
  CONSTRAINT `Appointment_specialtyId_fkey` 
    FOREIGN KEY (`specialtyId`) 
    REFERENCES `Specialty` (`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Inserir dados iniciais (opcional)


-- Inserir especialidades padrão
INSERT INTO `Specialty` (`id`, `name`) VALUES 
  (UUID(), 'Corte de Cabelo'),
  (UUID(), 'Barba'),
  (UUID(), 'Corte + Barba'),
  (UUID(), 'Sobrancelha'),
  (UUID(), 'Pigmentação'),
  (UUID(), 'Platinado');

-- Inserir barbeiros de exemplo
INSERT INTO `Barber` (`id`, `name`, `age`, `hireDate`) VALUES 
  (UUID(), 'João Silva', 28, '2023-01-15'),
  (UUID(), 'Pedro Santos', 35, '2022-06-20'),
  (UUID(), 'Carlos Oliveira', 42, '2020-03-10');

-- Criar usuário admin de exemplo (senha: admin123)
-- Senha hash gerada com bcrypt
INSERT INTO `User` (`id`, `email`, `name`, `password`, `role`) VALUES 
  (UUID(), 'admin@clickbeard.com', 'Administrador', '$2a$08$jJoX3SYwxrwKz3QH2eYeVuEbfLx3mXVLFGXQjVObDJ1Gf/e5P/Kxm', 'ADMIN');



-- Procedure para limpar agendamentos antigos
DELIMITER //
CREATE PROCEDURE CleanOldAppointments()
BEGIN
  UPDATE `Appointment` 
  SET `status` = 'COMPLETED' 
  WHERE `appointmentDate` < NOW() 
    AND `status` = 'SCHEDULED';
END //
DELIMITER ;



-- View para agendamentos do dia
CREATE VIEW `TodayAppointments` AS
SELECT 
  a.id,
  a.appointmentDate,
  a.status,
  u.name AS userName,
  u.email AS userEmail,
  b.name AS barberName,
  s.name AS specialtyName
FROM `Appointment` a
JOIN `User` u ON a.userId = u.id
JOIN `Barber` b ON a.barberId = b.id
JOIN `Specialty` s ON a.specialtyId = s.id
WHERE DATE(a.appointmentDate) = CURDATE()
  AND a.status != 'CANCELLED'
ORDER BY a.appointmentDate;