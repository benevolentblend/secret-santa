/*
  Warnings:

  - The values [ADMIN,USER,MODERATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `GameMatch` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('Setup', 'Active', 'Complete');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('Admin', 'User', 'Moderator');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropForeignKey
ALTER TABLE "GameMatch" DROP CONSTRAINT "GameMatch_patronId_fkey";

-- DropForeignKey
ALTER TABLE "GameMatch" DROP CONSTRAINT "GameMatch_userId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'Setup';

-- AlterTable
ALTER TABLE "GameMatch" DROP COLUMN "userId",
ALTER COLUMN "patronId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'User';

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameMatch" ADD CONSTRAINT "GameMatch_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
