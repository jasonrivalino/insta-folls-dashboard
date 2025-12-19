-- CreateTable
CREATE TABLE `Main_Instagram_Data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pk_def_insta` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NULL,
    `profile_picture` VARCHAR(2048) NOT NULL,
    `is_private` BOOLEAN NOT NULL,
    `media_post_total` INTEGER NOT NULL,
    `followers` INTEGER NOT NULL,
    `following` INTEGER NOT NULL,
    `biography` VARCHAR(191) NULL,
    `is_mutual` BOOLEAN NOT NULL,

    UNIQUE INDEX `Main_Instagram_Data_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relation_Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `relational` VARCHAR(191) NOT NULL,
    `text_color` CHAR(6) NOT NULL,
    `bg_color` CHAR(6) NOT NULL,

    UNIQUE INDEX `Relation_Status_relational_key`(`relational`),
    UNIQUE INDEX `Relation_Status_text_color_bg_color_key`(`text_color`, `bg_color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Main_Instagram_DataToRelation_Status` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Main_Instagram_DataToRelation_Status_AB_unique`(`A`, `B`),
    INDEX `_Main_Instagram_DataToRelation_Status_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Main_Instagram_DataToRelation_Status` ADD CONSTRAINT `_Main_Instagram_DataToRelation_Status_A_fkey` FOREIGN KEY (`A`) REFERENCES `Main_Instagram_Data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Main_Instagram_DataToRelation_Status` ADD CONSTRAINT `_Main_Instagram_DataToRelation_Status_B_fkey` FOREIGN KEY (`B`) REFERENCES `Relation_Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
