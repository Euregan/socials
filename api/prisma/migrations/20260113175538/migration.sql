/*
  Warnings:

  - You are about to drop the column `userId` on the `Source` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[remoteId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `remoteId` to the `Source` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_userId_fkey";

-- AlterTable
ALTER TABLE "Source" DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "remoteId" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sourceId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_sourceId_key" ON "Subscription"("userId", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_remoteId_key" ON "Source"("remoteId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
