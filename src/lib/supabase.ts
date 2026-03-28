import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          phone: string
          name: string | null
          upi_id: string | null
          store_slug: string | null
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          name?: string | null
          upi_id?: string | null
          store_slug?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string | null
          upi_id?: string | null
          store_slug?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          merchant_id: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          in_stock?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string | null
          merchant_id: string | null
          buyer_phone: string | null
          buyer_pincode: string | null
          buyer_address: string | null
          is_lead: boolean
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          merchant_id?: string | null
          buyer_phone?: string | null
          buyer_pincode?: string | null
          buyer_address?: string | null
          is_lead?: boolean
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          merchant_id?: string | null
          buyer_phone?: string | null
          buyer_pincode?: string | null
          buyer_address?: string | null
          is_lead?: boolean
          status?: string
          created_at?: string
        }
      }
      service_pincodes: {
        Row: {
          id: string
          merchant_id: string
          pincode: string
          area_name: string | null
        }
        Insert: {
          id?: string
          merchant_id: string
          pincode: string
          area_name?: string | null
        }
        Update: {
          id?: string
          merchant_id?: string
          pincode?: string
          area_name?: string | null
        }
      }
    }
  }
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
