/*
  Warnings:

  - A unique constraint covering the columns `[remoteId,sourceId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `remoteId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "remoteId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_remoteId_sourceId_key" ON "Item"("remoteId", "sourceId");
