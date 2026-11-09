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
      client_locations: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          created_at: string
          customer_id: string
          id: string
          is_main: boolean
          label: string
          location_no: string | null
          postcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          created_at?: string
          customer_id: string
          id?: string
          is_main?: boolean
          label: string
          location_no?: string | null
          postcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_main?: boolean
          label?: string
          location_no?: string | null
          postcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_locations_customer_same_company_fkey"
            columns: ["company_id", "customer_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_id: string | null
          contact_language: string | null
          contact_person: string | null
          created_at: string
          customer_no: string | null
          email: string | null
          id: string
          is_archived: boolean
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id?: string | null
          contact_language?: string | null
          contact_person?: string | null
          created_at?: string
          customer_no?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string | null
          contact_language?: string | null
          contact_person?: string | null
          created_at?: string
          customer_no?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_id: string
          company_name: string
          language: string
          settings_data: Json
          timezone: string
          updated_at: string
          welcome_email_template: string
          welcome_sms_template: string
        }
        Insert: {
          company_id: string
          company_name: string
          language?: string
          settings_data?: Json
          timezone?: string
          updated_at?: string
          welcome_email_template?: string
          welcome_sms_template?: string
        }
        Update: {
          company_id?: string
          company_name?: string
          language?: string
          settings_data?: Json
          timezone?: string
          updated_at?: string
          welcome_email_template?: string
          welcome_sms_template?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          company_id: string
          created_at: string
          description: string
          id: string
          job_id: string | null
          reported_by: string
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          id?: string
          job_id?: string | null
          reported_by: string
          type: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          job_id?: string | null
          reported_by?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_job_same_company_fkey"
            columns: ["company_id", "job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "incidents_reporter_same_company_fkey"
            columns: ["company_id", "reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      job_photo_documentation: {
        Row: {
          caption: string | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          job_id: string
          photo_url: string
        }
        Insert: {
          caption?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          job_id: string
          photo_url: string
        }
        Update: {
          caption?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          job_id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photo_documentation_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photo_documentation_creator_same_company_fkey"
            columns: ["company_id", "created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "job_photo_documentation_job_same_company_fkey"
            columns: ["company_id", "job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      jobs: {
        Row: {
          check_in_at: string | null
          check_in_latitude: number | null
          check_in_longitude: number | null
          check_out_at: string | null
          check_out_latitude: number | null
          check_out_longitude: number | null
          checklist: Json
          client_id: string | null
          company_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          priority: string
          scheduled_date: string
          staff_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          check_in_at?: string | null
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_out_at?: string | null
          check_out_latitude?: number | null
          check_out_longitude?: number | null
          checklist?: Json
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          priority?: string
          scheduled_date?: string
          staff_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          check_in_at?: string | null
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_out_at?: string | null
          check_out_latitude?: number | null
          check_out_longitude?: number | null
          checklist?: Json
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          priority?: string
          scheduled_date?: string
          staff_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_same_company_fkey"
            columns: ["company_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "jobs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_staff_same_company_fkey"
            columns: ["company_id", "staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      key_registers: {
        Row: {
          company_id: string
          created_at: string
          customer_id: string
          id: string
          key_code: string
          notes: string | null
          picked_up_at: string | null
          returned_at: string | null
          staff_id: string | null
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_id: string
          id?: string
          key_code: string
          notes?: string | null
          picked_up_at?: string | null
          returned_at?: string | null
          staff_id?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          key_code?: string
          notes?: string | null
          picked_up_at?: string | null
          returned_at?: string | null
          staff_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_registers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_registers_customer_same_company_fkey"
            columns: ["company_id", "customer_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "key_registers_staff_same_company_fkey"
            columns: ["company_id", "staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      material_requests: {
        Row: {
          company_id: string
          created_at: string
          id: string
          material_id: string
          notes: string | null
          quantity: number
          requested_by: string | null
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          material_id: string
          notes?: string | null
          quantity: number
          requested_by?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          material_id?: string
          notes?: string | null
          quantity?: number
          requested_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_requests_material_same_company_fkey"
            columns: ["company_id", "material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "material_requests_requester_same_company_fkey"
            columns: ["company_id", "requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      material_transfers: {
        Row: {
          company_id: string
          created_at: string
          from_location: string
          id: string
          material_id: string
          notes: string | null
          quantity: number
          to_location: string
          transferred_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          from_location: string
          id?: string
          material_id: string
          notes?: string | null
          quantity: number
          to_location: string
          transferred_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          from_location?: string
          id?: string
          material_id?: string
          notes?: string | null
          quantity?: number
          to_location?: string
          transferred_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_transfers_actor_same_company_fkey"
            columns: ["company_id", "transferred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "material_transfers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_transfers_material_same_company_fkey"
            columns: ["company_id", "material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      materials: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string
          id: string
          is_archived: boolean
          minimum_quantity: number
          name: string
          product_no: string | null
          quantity: number
          storage_location: string | null
          unit: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          minimum_quantity?: number
          name: string
          product_no?: string | null
          quantity?: number
          storage_location?: string | null
          unit?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          minimum_quantity?: number
          name?: string
          product_no?: string | null
          quantity?: number
          storage_location?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          company_id: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          company_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          company_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_same_company_fkey"
            columns: ["company_id", "recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "messages_sender_same_company_fkey"
            columns: ["company_id", "sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      nfc_tags: {
        Row: {
          client_id: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          job_id: string | null
          label: string
          last_scanned_at: string | null
          tag_code: string
        }
        Insert: {
          client_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          job_id?: string | null
          label: string
          last_scanned_at?: string | null
          tag_code: string
        }
        Update: {
          client_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          job_id?: string | null
          label?: string
          last_scanned_at?: string | null
          tag_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "nfc_tags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfc_tags_customer_same_company_fkey"
            columns: ["company_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["company_id", "id"]
          },
          {
            foreignKeyName: "nfc_tags_job_same_company_fkey"
            columns: ["company_id", "job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role: string
        }
        Insert: {
          company_id: string
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          role: string
        }
        Update: {
          company_id?: string
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          profile_id: string | null
          role: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_profile_same_company_fkey"
            columns: ["company_id", "profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["company_id", "id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
