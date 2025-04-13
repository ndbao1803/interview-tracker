-- Add logo fields to companies table
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "logo_url" TEXT;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "logo_key" VARCHAR(100); 