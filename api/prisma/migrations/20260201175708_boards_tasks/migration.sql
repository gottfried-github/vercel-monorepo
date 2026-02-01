/*
  Warnings:

  - Added the required column `created_at` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
