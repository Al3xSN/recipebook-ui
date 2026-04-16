-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_REQUEST', 'COMMENT', 'RATING');

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userAId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userBId_fkey";

-- Migrate FriendRequest.status from Int to FriendRequestStatus enum
-- Preserve existing data: 0=PENDING, 1=ACCEPTED, 2=REJECTED
ALTER TABLE "FriendRequest" ADD COLUMN "status_new" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING';
UPDATE "FriendRequest" SET "status_new" = CASE
  WHEN status = 1 THEN 'ACCEPTED'::"FriendRequestStatus"
  WHEN status = 2 THEN 'REJECTED'::"FriendRequestStatus"
  ELSE 'PENDING'::"FriendRequestStatus"
END;
ALTER TABLE "FriendRequest" DROP COLUMN "status";
ALTER TABLE "FriendRequest" RENAME COLUMN "status_new" TO "status";

-- Migrate Friendship rows to accepted FriendRequests before dropping the table
-- Insert a canonical accepted FriendRequest for each Friendship row that doesn't already have one
INSERT INTO "FriendRequest" (id, "senderId", "receiverId", status, "createdAt")
SELECT
  gen_random_uuid(),
  f."userAId",
  f."userBId",
  'ACCEPTED'::"FriendRequestStatus",
  NOW()
FROM "Friendship" f
WHERE NOT EXISTS (
  SELECT 1 FROM "FriendRequest" r
  WHERE r.status = 'ACCEPTED'::"FriendRequestStatus"
    AND (
      (r."senderId" = f."userAId" AND r."receiverId" = f."userBId")
      OR (r."senderId" = f."userBId" AND r."receiverId" = f."userAId")
    )
);

-- DropTable
DROP TABLE "Friendship";

-- AlterTable Comment: add updatedAt defaulting to createdAt for existing rows
ALTER TABLE "Comment" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "Comment" SET "updatedAt" = "createdAt";
ALTER TABLE "Comment" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable Ingredient: add order defaulting to 0 for existing rows
ALTER TABLE "Ingredient" ADD COLUMN "order" INTEGER;
UPDATE "Ingredient" SET "order" = 0;
ALTER TABLE "Ingredient" ALTER COLUMN "order" SET NOT NULL;

-- Migrate Recipe.visibility from Int to Visibility enum
-- Existing values: 1=PUBLIC, 2=FRIENDS_ONLY, 3=PRIVATE
ALTER TABLE "Recipe" ADD COLUMN "visibility_new" "Visibility";
UPDATE "Recipe" SET "visibility_new" = CASE
  WHEN visibility = 2 THEN 'FRIENDS_ONLY'::"Visibility"
  WHEN visibility = 3 THEN 'PRIVATE'::"Visibility"
  ELSE 'PUBLIC'::"Visibility"
END;
ALTER TABLE "Recipe" DROP COLUMN "visibility";
ALTER TABLE "Recipe" RENAME COLUMN "visibility_new" TO "visibility";
ALTER TABLE "Recipe" ALTER COLUMN "visibility" SET NOT NULL;

-- Migrate Recipe.difficulty from Int to Difficulty enum (nullable)
-- No established mapping existed, so existing Int values are nullified safely
ALTER TABLE "Recipe" ADD COLUMN "difficulty_new" "Difficulty";
UPDATE "Recipe" SET "difficulty_new" = CASE
  WHEN difficulty = 0 THEN 'EASY'::"Difficulty"
  WHEN difficulty = 1 THEN 'MEDIUM'::"Difficulty"
  WHEN difficulty = 2 THEN 'HARD'::"Difficulty"
  ELSE NULL
END;
ALTER TABLE "Recipe" DROP COLUMN "difficulty";
ALTER TABLE "Recipe" RENAME COLUMN "difficulty_new" TO "difficulty";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "referenceId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
