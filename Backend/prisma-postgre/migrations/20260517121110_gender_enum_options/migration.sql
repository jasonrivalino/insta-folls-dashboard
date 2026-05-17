/*
  Warnings:

  - The `gender` column on the `Main_Instagram_Data` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Unknown');

-- AlterTable
ALTER TABLE "Main_Instagram_Data" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";
