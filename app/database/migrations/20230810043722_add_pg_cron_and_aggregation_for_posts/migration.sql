-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "aggregatedHotness" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "aggregatedUpcomingness" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "aggregatedVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAggregated" TIMESTAMP(3);
