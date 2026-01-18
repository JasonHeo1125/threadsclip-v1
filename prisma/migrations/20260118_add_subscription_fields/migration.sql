ALTER TABLE "users" 
ADD COLUMN "subscription_tier" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN "subscription_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "subscription_ends_at" TIMESTAMP(3),
ADD COLUMN "storage_limit" INTEGER NOT NULL DEFAULT 1000;

UPDATE "users" 
SET "subscription_tier" = 'legacy', 
    "storage_limit" = 1000
WHERE "created_at" < NOW();
