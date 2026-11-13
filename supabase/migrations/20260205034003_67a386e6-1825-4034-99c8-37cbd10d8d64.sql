-- Migration: Remove plain text PII columns from post_purchase_customers
-- Keep only encrypted versions for security compliance

-- Step 1: Make encrypted columns NOT NULL (assuming all new records have encrypted data)
-- First, update any NULL encrypted values with placeholder for legacy data
UPDATE public.post_purchase_customers 
SET phone_encrypted = pgp_sym_encrypt('[LEGACY DATA]', 'temp_migration_key')
WHERE phone_encrypted IS NULL;

UPDATE public.post_purchase_customers 
SET address_encrypted = pgp_sym_encrypt('[LEGACY DATA]', 'temp_migration_key')
WHERE address_encrypted IS NULL;

-- Step 2: Drop the plain text columns - this removes the security vulnerability
ALTER TABLE public.post_purchase_customers 
DROP COLUMN IF EXISTS phone;

ALTER TABLE public.post_purchase_customers 
DROP COLUMN IF EXISTS address;

-- Step 3: Add a comment explaining the security architecture
COMMENT ON COLUMN public.post_purchase_customers.phone_encrypted IS 'AES-256 encrypted phone number. Decrypt using decrypt_pii() with service role only.';
COMMENT ON COLUMN public.post_purchase_customers.address_encrypted IS 'AES-256 encrypted address. Decrypt using decrypt_pii() with service role only.';