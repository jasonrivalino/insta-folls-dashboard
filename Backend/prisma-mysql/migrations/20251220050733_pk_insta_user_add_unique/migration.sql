/*
  Warnings:

  - A unique constraint covering the columns `[pk_def_insta]` on the table `Main_Instagram_Data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Main_Instagram_Data_pk_def_insta_key` ON `Main_Instagram_Data`(`pk_def_insta`);
