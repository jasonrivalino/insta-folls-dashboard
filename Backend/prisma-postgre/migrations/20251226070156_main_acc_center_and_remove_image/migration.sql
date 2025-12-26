/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `Main_Instagram_Data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Main_Instagram_Data" DROP COLUMN "profile_picture";

-- CreateTable
CREATE TABLE "Main_Account_Center" (
    "pk" INTEGER NOT NULL DEFAULT 1,
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Main_Account_Center_pkey" PRIMARY KEY ("pk")
);
