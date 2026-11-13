export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customer_promotions: {
        Row: {
          created_at: string | null
          customer_id: string
          discount_percentage: number
          expires_at: string
          id: string
          is_sent: boolean | null
          is_used: boolean | null
          promo_code: string
          purchase_id: string
          related_product_id: number
          related_product_name: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          discount_percentage?: number
          expires_at: string
          id?: string
          is_sent?: boolean | null
          is_used?: boolean | null
          promo_code: string
          purchase_id: string
          related_product_id: number
          related_product_name: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          discount_percentage?: number
          expires_at?: string
          id?: string
          is_sent?: boolean | null
          is_used?: boolean | null
          promo_code?: string
          purchase_id?: string
          related_product_id?: number
          related_product_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_promotions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "post_purchase_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_promotions_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "customer_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_purchases: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          price: number
          product_category: string
          product_id: number
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          price: number
          product_category: string
          product_id: number
          product_name: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          price?: number
          product_category?: string
          product_id?: number
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_purchases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "post_purchase_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      post_purchase_customers: {
        Row: {
          accepts_promotions: boolean | null
          address_encrypted: string | null
          city: string
          created_at: string | null
          full_name: string
          id: string
          phone_encrypted: string | null
          updated_at: string | null
        }
        Insert: {
          accepts_promotions?: boolean | null
          address_encrypted?: string | null
          city: string
          created_at?: string | null
          full_name: string
          id?: string
          phone_encrypted?: string | null
          updated_at?: string | null
        }
        Update: {
          accepts_promotions?: boolean | null
          address_encrypted?: string | null
          city?: string
          created_at?: string | null
          full_name?: string
          id?: string
          phone_encrypted?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          created_at: string | null
          customer_name: string
          id: string
          is_approved: boolean | null
          product_id: number
          rating: number
          review_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          id?: string
          is_approved?: boolean | null
          product_id: number
          rating: number
          review_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          id?: string
          is_approved?: boolean | null
          product_id?: number
          rating?: number
          review_text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      review_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          review_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          review_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_review_images: { Args: { review_id: string }; Returns: number }
      decrypt_pii: {
        Args: { encrypted_data: string; encryption_key: string }
        Returns: string
      }
      encrypt_pii: {
        Args: { encryption_key: string; plaintext: string }
        Returns: string
      }
      get_public_reviews: {
        Args: { p_product_id: number }
        Returns: {
          created_at: string
          customer_name: string
          id: string
          product_id: number
          rating: number
          review_text: string
          updated_at: string
        }[]
      }
      get_review_stats: {
        Args: { p_product_id: number }
        Returns: {
          average_rating: number
          total_reviews: number
        }[]
      }
      is_review_approved: { Args: { review_id: string }; Returns: boolean }
      is_review_recent: { Args: { review_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
