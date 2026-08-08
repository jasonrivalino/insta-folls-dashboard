-- AlterTable
ALTER TABLE `main_instagram_data` ADD COLUMN `snapshot_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Update_Instagram_Data_Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instagram_id` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NULL,
    `is_private` BOOLEAN NOT NULL,
    `media_post_total` INTEGER NOT NULL,
    `followers` INTEGER NOT NULL,
    `following` INTEGER NOT NULL,
    `biography` VARCHAR(191) NULL,
    `update_on` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Update_Instagram_Data_Log_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Update_Instagram_Data_Log` ADD CONSTRAINT `Update_Instagram_Data_Log_instagram_id_fkey` FOREIGN KEY (`instagram_id`) REFERENCES `Main_Instagram_Data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
