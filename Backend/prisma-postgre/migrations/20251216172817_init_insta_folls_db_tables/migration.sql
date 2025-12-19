-- CreateTable
CREATE TABLE "Main_Instagram_Data" (
    "id" SERIAL NOT NULL,
    "pk_def_insta" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT,
    "profile_picture" VARCHAR(2048) NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "media_post_total" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "biography" TEXT,
    "is_mutual" BOOLEAN NOT NULL,

    CONSTRAINT "Main_Instagram_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation_Status" (
    "id" SERIAL NOT NULL,
    "relational" TEXT NOT NULL,
    "text_color" CHAR(6) NOT NULL,
    "bg_color" CHAR(6) NOT NULL,

    CONSTRAINT "Relation_Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Main_Instagram_DataToRelation_Status" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Main_Instagram_DataToRelation_Status_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Main_Instagram_Data_username_key" ON "Main_Instagram_Data"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_Status_relational_key" ON "Relation_Status"("relational");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_Status_text_color_bg_color_key" ON "Relation_Status"("text_color", "bg_color");

-- CreateIndex
CREATE INDEX "_Main_Instagram_DataToRelation_Status_B_index" ON "_Main_Instagram_DataToRelation_Status"("B");

-- AddForeignKey
ALTER TABLE "_Main_Instagram_DataToRelation_Status" ADD CONSTRAINT "_Main_Instagram_DataToRelation_Status_A_fkey" FOREIGN KEY ("A") REFERENCES "Main_Instagram_Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Main_Instagram_DataToRelation_Status" ADD CONSTRAINT "_Main_Instagram_DataToRelation_Status_B_fkey" FOREIGN KEY ("B") REFERENCES "Relation_Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
