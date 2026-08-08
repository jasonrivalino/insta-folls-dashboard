-- AlterTable
ALTER TABLE "Main_Instagram_Data" ADD COLUMN     "snapshot_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Update_Instagram_Data_Log" (
    "id" SERIAL NOT NULL,
    "instagram_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT,
    "is_private" BOOLEAN NOT NULL,
    "media_post_total" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "biography" TEXT,
    "update_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_Instagram_Data_Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Update_Instagram_Data_Log_username_key" ON "Update_Instagram_Data_Log"("username");

-- AddForeignKey
ALTER TABLE "Update_Instagram_Data_Log" ADD CONSTRAINT "Update_Instagram_Data_Log_instagram_id_fkey" FOREIGN KEY ("instagram_id") REFERENCES "Main_Instagram_Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
