/*
  Warnings:

  - The primary key for the `CommentVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `isUp` on the `CommentVote` table. All the data in the column will be lost.
  - The primary key for the `PostVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostVote` table. All the data in the column will be lost.
  - You are about to drop the column `isUp` on the `PostVote` table. All the data in the column will be lost.
  - Added the required column `commentId` to the `CommentVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `CommentVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `PostVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `PostVote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CommentVote_id_key";

-- DropIndex
DROP INDEX "PostVote_id_key";

-- AlterTable
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_pkey",
DROP COLUMN "id",
DROP COLUMN "isUp",
ADD COLUMN     "commentId" INTEGER NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL,
ADD CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("commentId", "voterId");

-- AlterTable
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_pkey",
DROP COLUMN "id",
DROP COLUMN "isUp",
ADD COLUMN     "postId" INTEGER NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL,
ADD CONSTRAINT "PostVote_pkey" PRIMARY KEY ("postId", "voterId");

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
