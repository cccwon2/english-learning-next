/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."profiles" DROP CONSTRAINT "profiles_user_id_fkey";

-- DropIndex
DROP INDEX "auth"."users_id_idx";

-- AlterTable
ALTER TABLE "auth"."users" ADD COLUMN     "class" SMALLINT NOT NULL,
ADD COLUMN     "grade" SMALLINT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."profiles";
