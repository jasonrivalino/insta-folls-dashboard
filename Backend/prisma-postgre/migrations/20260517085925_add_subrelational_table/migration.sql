/*
  Warnings:

  - A unique constraint covering the columns `[text_color,bg_color,border_color]` on the table `Relation_Status` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Relation_Status_text_color_bg_color_key";

-- AlterTable
ALTER TABLE "Relation_Status" ADD COLUMN     "border_color" CHAR(7);

-- CreateTable
CREATE TABLE "Subrelation_Status" (
    "id" SERIAL NOT NULL,
    "subrelational" TEXT NOT NULL,
    "relationsId" INTEGER,

    CONSTRAINT "Subrelation_Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Main_Instagram_DataToSubrelation_Status" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Main_Instagram_DataToSubrelation_Status_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Main_Instagram_DataToSubrelation_Status_B_index" ON "_Main_Instagram_DataToSubrelation_Status"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_Status_text_color_bg_color_border_color_key" ON "Relation_Status"("text_color", "bg_color", "border_color");

-- AddForeignKey
ALTER TABLE "Subrelation_Status" ADD CONSTRAINT "Subrelation_Status_relationsId_fkey" FOREIGN KEY ("relationsId") REFERENCES "Relation_Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Main_Instagram_DataToSubrelation_Status" ADD CONSTRAINT "_Main_Instagram_DataToSubrelation_Status_A_fkey" FOREIGN KEY ("A") REFERENCES "Main_Instagram_Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Main_Instagram_DataToSubrelation_Status" ADD CONSTRAINT "_Main_Instagram_DataToSubrelation_Status_B_fkey" FOREIGN KEY ("B") REFERENCES "Subrelation_Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
