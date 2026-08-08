-- Drop existing foreign key
ALTER TABLE "Subrelation_Status" DROP CONSTRAINT "Subrelation_Status_relationsId_fkey";

-- Rename column
ALTER TABLE "Subrelation_Status" RENAME COLUMN "relationsId" TO "relations_id";

-- Drop old unique index
DROP INDEX "Subrelation_Status_subrelational_relationsId_key";

-- Create new unique index
CREATE UNIQUE INDEX "Subrelation_Status_subrelational_relations_id_key"
  ON "Subrelation_Status" ("subrelational", "relations_id");

-- Add foreign key with new name
ALTER TABLE "Subrelation_Status"
  ADD CONSTRAINT "Subrelation_Status_relations_id_fkey"
  FOREIGN KEY ("relations_id")
  REFERENCES "Relation_Status"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;