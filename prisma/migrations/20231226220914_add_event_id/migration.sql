/*
  Warnings:

  - Added the required column `event_id` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "event_id" TEXT NOT NULL;
