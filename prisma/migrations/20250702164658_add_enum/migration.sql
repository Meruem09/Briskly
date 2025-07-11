/*
  Warnings:

  - The `gender` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `educationStatus` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `explanationStyle` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `comfortLanguage` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "EducationStatus" AS ENUM ('school', 'college', 'others');

-- CreateEnum
CREATE TYPE "ExplainationStyle" AS ENUM ('simple', 'detailed', 'fast_paced');

-- CreateEnum
CREATE TYPE "ComfortLanguage" AS ENUM ('english', 'hindi', 'gujrati', 'bengali', 'others');

-- AlterTable
ALTER TABLE "UserPreference" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "educationStatus",
ADD COLUMN     "educationStatus" "EducationStatus",
DROP COLUMN "explanationStyle",
ADD COLUMN     "explanationStyle" "ExplainationStyle",
DROP COLUMN "comfortLanguage",
ADD COLUMN     "comfortLanguage" "ComfortLanguage";
