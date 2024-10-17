/*
  Warnings:

  - You are about to drop the column `lastMessageSentAt` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `conversations` DROP COLUMN `lastMessageSentAt`;
