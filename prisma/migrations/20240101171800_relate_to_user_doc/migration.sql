/*
  Warnings:

  - Added the required column `user_id` to the `user_document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "user_document_id" UUID;

-- AlterTable
ALTER TABLE "user_document" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_document_id_fkey" FOREIGN KEY ("user_document_id") REFERENCES "user_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_document" ADD CONSTRAINT "user_document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
