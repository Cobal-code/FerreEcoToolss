-- Enable pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns for sensitive data
ALTER TABLE public.post_purchase_customers 
ADD COLUMN IF NOT EXISTS phone_encrypted bytea,
ADD COLUMN IF NOT EXISTS address_encrypted bytea;

-- Create encryption helper function for encrypting data
-- Uses AES-256 encryption with a server-side key
CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, encryption_key text)
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;
  -- Use AES encryption with the provided key
  RETURN pgp_sym_encrypt(plaintext, encryption_key);
END;
$$;

-- Create decryption helper function
CREATE OR REPLACE FUNCTION public.decrypt_pii(encrypted_data bytea, encryption_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF encrypted_data IS NULL THEN
    RETURN NULL;
  END IF;
  -- Decrypt using the same key
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
EXCEPTION
  WHEN OTHERS THEN
    -- Return masked value if decryption fails
    RETURN '[ENCRYPTED]';
END;
$$;

-- Revoke public access to encryption functions (only callable via service role)
REVOKE ALL ON FUNCTION public.encrypt_pii(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decrypt_pii(bytea, text) FROM PUBLIC;