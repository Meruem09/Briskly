/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPreference` table. All the data in the column will be lost.
  - The `explanationStyle` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userClerkId]` on the table `UserPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userClerkId` to the `UserPreference` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExplanationStyle" AS ENUM ('simple', 'detailed', 'fast_paced');

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropIndex
DROP INDEX "UserPreference_userId_key";

-- AlterTable
ALTER TABLE "UserPreference" DROP COLUMN "userId",
ADD COLUMN     "userClerkId" TEXT NOT NULL,
DROP COLUMN "explanationStyle",
ADD COLUMN     "explanationStyle" "ExplanationStyle";

-- DropEnum
DROP TYPE "ExplainationStyle";

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userClerkId_key" ON "UserPreference"("userClerkId");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
