/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_googleUserId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "googleUserId" DROP NOT NULL,
ALTER COLUMN "googleAccessToken" DROP NOT NULL,
ALTER COLUMN "googleRefreshToken" DROP NOT NULL;
