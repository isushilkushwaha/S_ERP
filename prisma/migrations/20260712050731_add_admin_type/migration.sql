-- CreateEnum
CREATE TYPE "AdminType" AS ENUM ('PRIMARY', 'SECONDARY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminType" "AdminType";
