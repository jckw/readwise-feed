/*
  Warnings:

  - A unique constraint covering the columns `[user_book_id]` on the table `user_document` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_document_user_book_id_key" ON "user_document"("user_book_id");
