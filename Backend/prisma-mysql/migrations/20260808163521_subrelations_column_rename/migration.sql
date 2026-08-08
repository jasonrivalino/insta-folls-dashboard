-- Drop existing foreign key
ALTER TABLE `subrelation_status` DROP FOREIGN KEY `Subrelation_Status_relationsId_fkey`;

-- Rename column
ALTER TABLE `subrelation_status` CHANGE COLUMN `relationsId` `relations_id` INTEGER NOT NULL;

-- Drop old unique index
DROP INDEX `Subrelation_Status_subrelational_relationsId_key` ON `subrelation_status`;

-- Create new unique index
CREATE UNIQUE INDEX `Subrelation_Status_subrelational_relations_id_key`
ON `subrelation_status` (`subrelational`, `relations_id`);

-- Add foreign key with new name
ALTER TABLE `subrelation_status`
  ADD CONSTRAINT `Subrelation_Status_relations_id_fkey`
  FOREIGN KEY (`relations_id`)
  REFERENCES `Relation_Status` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;