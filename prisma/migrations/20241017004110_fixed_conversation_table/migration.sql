/*
  Warnings:

  - You are about to drop the column `lastMessageSent` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `conversations` DROP COLUMN `lastMessageSent`,
    ADD COLUMN `messageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
