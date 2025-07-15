
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_barberId_fkey`;

-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_specialtyId_fkey`;

-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `barber_specialties` DROP FOREIGN KEY `barber_specialties_barberId_fkey`;

-- DropForeignKey
ALTER TABLE `barber_specialties` DROP FOREIGN KEY `barber_specialties_specialtyId_fkey`;

-- DropIndex
DROP INDEX `appointments_barberId_fkey` ON `appointments`;

-- DropIndex
DROP INDEX `appointments_specialtyId_fkey` ON `appointments`;

-- DropIndex
DROP INDEX `barber_specialties_specialtyId_fkey` ON `barber_specialties`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `date`,
    DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `appointmentDate` DATETIME(3) NOT NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE `barber_specialties` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `barbers` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `specialties` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `appointments_appointmentDate_idx` ON `appointments`(`appointmentDate`);

-- CreateIndex
CREATE INDEX `appointments_status_idx` ON `appointments`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `appointments_barberId_appointmentDate_key` ON `appointments`(`barberId`, `appointmentDate`);

-- CreateIndex
CREATE UNIQUE INDEX `barber_specialties_barberId_specialtyId_key` ON `barber_specialties`(`barberId`, `specialtyId`);

-- AddForeignKey
ALTER TABLE `barber_specialties` ADD CONSTRAINT `barber_specialties_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `barbers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barber_specialties` ADD CONSTRAINT `barber_specialties_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `barbers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `appointments` RENAME INDEX `appointments_userId_fkey` TO `appointments_userId_idx`;
