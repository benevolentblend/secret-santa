/*
  Warnings:

  - The values [Sorting] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('Setup', 'Matching', 'Active', 'Complete');
ALTER TABLE "Game" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "GameStatus_new" USING (
    CASE "status"::text
        WHEN 'Sorting' THEN 'Matching'
        ELSE "status"::text
    END
)::"GameStatus_new";
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "GameStatus_old";
ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'Setup';
COMMIT;
