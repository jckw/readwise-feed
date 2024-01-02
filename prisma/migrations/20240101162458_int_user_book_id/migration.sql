/*
  Warnings:

  - Changed the type of `user_book_id` on the `user_document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_document" DROP COLUMN "user_book_id",
ADD COLUMN     "user_book_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_document_user_book_id_key" ON "user_document"("user_book_id");
