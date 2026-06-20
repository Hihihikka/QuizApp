/*
  Warnings:

  - The `difficulty` column on the `Quiz` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'medium';
