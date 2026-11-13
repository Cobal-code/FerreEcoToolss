 /**
  * PII Encryption utilities for edge functions
  * Uses PostgreSQL pgcrypto extension for AES-256 encryption
  */
 
 import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
 
 /**
  * Encrypt sensitive PII data using database-level AES encryption
  * @param supabase - Supabase client with service role credentials
  * @param plaintext - The text to encrypt
  * @param encryptionKey - The encryption key from environment
  * @returns Encrypted data as base64 string, or null if input is empty
  */
 export async function encryptPII(
   supabase: SupabaseClient,
   plaintext: string,
   encryptionKey: string
 ): Promise<string | null> {
   if (!plaintext || plaintext.trim() === '') {
     return null;
   }
 
   try {
     const { data, error } = await supabase.rpc('encrypt_pii', {
       plaintext: plaintext,
       encryption_key: encryptionKey
     });
 
     if (error) {
       console.error('Encryption error:', error.message);
       throw new Error('Failed to encrypt data');
     }
 
     return data;
   } catch (err) {
     console.error('Encryption failed:', err);
     throw err;
   }
 }
 
 /**
  * Decrypt PII data encrypted with encryptPII
  * @param supabase - Supabase client with service role credentials  
  * @param encryptedData - The encrypted data (base64 string)
  * @param encryptionKey - The encryption key from environment
  * @returns Decrypted plaintext, or null if input is empty
  */
 export async function decryptPII(
   supabase: SupabaseClient,
   encryptedData: string | null,
   encryptionKey: string
 ): Promise<string | null> {
   if (!encryptedData) {
     return null;
   }
 
   try {
     const { data, error } = await supabase.rpc('decrypt_pii', {
       encrypted_data: encryptedData,
       encryption_key: encryptionKey
     });
 
     if (error) {
       console.error('Decryption error:', error.message);
       return '[ENCRYPTED]';
     }
 
     return data;
   } catch (err) {
     console.error('Decryption failed:', err);
     return '[ENCRYPTED]';
   }
 }