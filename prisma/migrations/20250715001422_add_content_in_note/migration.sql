/*
  Warnings:

  - The values [others] on the enum `EducationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EducationStatus_new" AS ENUM ('school', 'college');
ALTER TABLE "UserPreference" ALTER COLUMN "educationStatus" TYPE "EducationStatus_new" USING ("educationStatus"::text::"EducationStatus_new");
ALTER TYPE "EducationStatus" RENAME TO "EducationStatus_old";
ALTER TYPE "EducationStatus_new" RENAME TO "EducationStatus";
DROP TYPE "EducationStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "content" TEXT;
