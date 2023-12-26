/*
  Warnings:

  - A unique constraint covering the columns `[type,event_id]` on the table `activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "activity_type_event_id_key" ON "activity"("type", "event_id");
