/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `main_instagram_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `main_instagram_data` DROP COLUMN `profile_picture`;

-- CreateTable
CREATE TABLE `Main_Account_Center` (
    `pk` INTEGER NOT NULL DEFAULT 1,
    `id` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`pk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
