// Généré depuis le projet Supabase « forevercars » (ne pas modifier à la main : regénérer après chaque migration).
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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: number
          payload: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: never
          payload?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: never
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_costs: {
        Row: {
          purchase_price: number | null
          repair_cost: number
          revision: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          purchase_price?: number | null
          repair_cost?: number
          revision?: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          purchase_price?: number | null
          repair_cost?: number
          revision?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_costs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_documents: {
        Row: {
          created_at: string
          created_by: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          id: string
          storage_path: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          id?: string
          storage_path: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          doc_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          storage_path?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_photos: {
        Row: {
          created_at: string
          height: number | null
          id: string
          position: number
          revision: number
          storage_path: string
          updated_at: string
          vehicle_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          position: number
          revision?: number
          storage_path: string
          updated_at?: string
          vehicle_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          position?: number
          revision?: number
          storage_path?: string
          updated_at?: string
          vehicle_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          body: Database["public"]["Enums"]["body_type"] | null
          brand: string
          color: string
          created_at: string
          created_by: string | null
          critair: number | null
          description: string
          description_is_auto: boolean
          equipment: string[]
          file_number: string
          first_registration: string | null
          fiscal_hp: number | null
          fuel: Database["public"]["Enums"]["fuel_type"]
          gearbox: Database["public"]["Enums"]["gearbox_type"]
          id: string
          is_featured: boolean
          is_new: boolean
          mileage: number
          model: string
          owners: number | null
          plate: string | null
          power_hp: number | null
          price: number
          published_at: string | null
          revision: number
          slug: string
          sold_at: string | null
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
          updated_by: string | null
          version: string
          vin: string | null
          warranty_months: number
          year: number
        }
        Insert: {
          body?: Database["public"]["Enums"]["body_type"] | null
          brand: string
          color?: string
          created_at?: string
          created_by?: string | null
          critair?: number | null
          description?: string
          description_is_auto?: boolean
          equipment?: string[]
          file_number: string
          first_registration?: string | null
          fiscal_hp?: number | null
          fuel: Database["public"]["Enums"]["fuel_type"]
          gearbox: Database["public"]["Enums"]["gearbox_type"]
          id?: string
          is_featured?: boolean
          is_new?: boolean
          mileage: number
          model: string
          owners?: number | null
          plate?: string | null
          power_hp?: number | null
          price: number
          published_at?: string | null
          revision?: number
          slug: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          updated_by?: string | null
          version?: string
          vin?: string | null
          warranty_months?: number
          year: number
        }
        Update: {
          body?: Database["public"]["Enums"]["body_type"] | null
          brand?: string
          color?: string
          created_at?: string
          created_by?: string | null
          critair?: number | null
          description?: string
          description_is_auto?: boolean
          equipment?: string[]
          file_number?: string
          first_registration?: string | null
          fiscal_hp?: number | null
          fuel?: Database["public"]["Enums"]["fuel_type"]
          gearbox?: Database["public"]["Enums"]["gearbox_type"]
          id?: string
          is_featured?: boolean
          is_new?: boolean
          mileage?: number
          model?: string
          owners?: number | null
          plate?: string | null
          power_hp?: number | null
          price?: number
          published_at?: string | null
          revision?: number
          slug?: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          updated_by?: string | null
          version?: string
          vin?: string | null
          warranty_months?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "seller"
      body_type:
        | "berline"
        | "suv"
        | "coupe"
        | "break"
        | "citadine"
        | "utilitaire"
        | "cabriolet"
        | "monospace"
      document_type:
        | "carte_grise"
        | "controle_technique"
        | "non_gage"
        | "factures_entretien"
        | "bon_de_commande"
        | "cession"
        | "facture_vente"
      fuel_type: "essence" | "diesel" | "hybride" | "electrique"
      gearbox_type: "manuelle" | "automatique"
      vehicle_status: "draft" | "online" | "reserved" | "sold"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seller"],
      body_type: [
        "berline",
        "suv",
        "coupe",
        "break",
        "citadine",
        "utilitaire",
        "cabriolet",
        "monospace",
      ],
      document_type: [
        "carte_grise",
        "controle_technique",
        "non_gage",
        "factures_entretien",
        "bon_de_commande",
        "cession",
        "facture_vente",
      ],
      fuel_type: ["essence", "diesel", "hybride", "electrique"],
      gearbox_type: ["manuelle", "automatique"],
      vehicle_status: ["draft", "online", "reserved", "sold"],
    },
  },
} as const
