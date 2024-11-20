/*
  Warnings:

  - Made the column `patronId` on table `GameMatch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "GameStatus" ADD VALUE 'Sorting';

-- DropForeignKey
ALTER TABLE "GameMatch" DROP CONSTRAINT "GameMatch_patronId_fkey";

-- DropForeignKey
ALTER TABLE "GameMatch" DROP CONSTRAINT "GameMatch_recipientId_fkey";

-- AlterTable
ALTER TABLE "GameMatch" ALTER COLUMN "patronId" SET NOT NULL,
ALTER COLUMN "recipientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GameMatch" ADD CONSTRAINT "GameMatch_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMatch" ADD CONSTRAINT "GameMatch_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
