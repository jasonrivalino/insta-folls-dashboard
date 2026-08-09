/*
  Warnings:

  - A unique constraint covering the columns `[instagram_id,update_on]` on the table `Update_Instagram_Data_Log` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Update_Instagram_Data_Log_instagram_id_update_on_key" ON "Update_Instagram_Data_Log"("instagram_id", "update_on");
