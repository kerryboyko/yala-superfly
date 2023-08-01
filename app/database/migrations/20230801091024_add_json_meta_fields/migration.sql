-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommentReaction" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommentTag" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommentVote" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommunityBan" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommunityModerators" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "CommunitySubscribers" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "PostReaction" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "PostTag" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "PostVote" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "meta" JSONB;
