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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      awards: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string
          is_published: boolean
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          is_published?: boolean
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          is_published?: boolean
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_clicks: {
        Row: {
          clicked_at: string
          id: string
          type: string
        }
        Insert: {
          clicked_at?: string
          id?: string
          type: string
        }
        Update: {
          clicked_at?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      lead_submissions: {
        Row: {
          budget: string | null
          created_at: string
          detail: string | null
          email: string
          id: string
          line_id: string | null
          name: string
          phone: string
          status: string
          visit_date: string | null
          visit_time: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          detail?: string | null
          email: string
          id?: string
          line_id?: string | null
          name: string
          phone: string
          status?: string
          visit_date?: string | null
          visit_time?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          detail?: string | null
          email?: string
          id?: string
          line_id?: string | null
          name?: string
          phone?: string
          status?: string
          visit_date?: string | null
          visit_time?: string | null
        }
        Relationships: []
      }
      land_inquiries: {
        Row: {
          area_ngan: number | null
          area_rai: number | null
          area_wa: number | null
          asking_price: number | null
          created_at: string | null
          district: string | null
          email: string | null
          first_name: string
          id: string
          images: Json
          land_address: string | null
          last_name: string
          notes: string | null
          pdf_url: string | null
          phone: string
          province: string | null
          status: string
          title_deed_type: string | null
        }
        Insert: {
          area_ngan?: number | null
          area_rai?: number | null
          area_wa?: number | null
          asking_price?: number | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name: string
          id?: string
          images?: Json
          land_address?: string | null
          last_name: string
          notes?: string | null
          pdf_url?: string | null
          phone: string
          province?: string | null
          status?: string
          title_deed_type?: string | null
        }
        Update: {
          area_ngan?: number | null
          area_rai?: number | null
          area_wa?: number | null
          asking_price?: number | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name?: string
          id?: string
          images?: Json
          land_address?: string | null
          last_name?: string
          notes?: string | null
          pdf_url?: string | null
          phone?: string
          province?: string | null
          status?: string
          title_deed_type?: string | null
        }
        Relationships: []
      }
      lifestyle_slides: {
        Row: {
          created_at: string | null
          house_image_url: string
          id: string
          is_published: boolean
          lifestyle_image_url: string
          sort_order: number
          tags: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          house_image_url?: string
          id?: string
          is_published?: boolean
          lifestyle_image_url?: string
          sort_order?: number
          tags?: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          house_image_url?: string
          id?: string
          is_published?: boolean
          lifestyle_image_url?: string
          sort_order?: number
          tags?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          sort_order: number
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      our_family_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          section: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          section: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          section?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_pages: {
        Row: {
          brochure_url: string | null
          created_at: string | null
          description: string | null
          facebook_url: string | null
          facilities: Json
          facility_image_1: string | null
          facility_image_2: string | null
          gallery_images: Json
          hero_image_url: string | null
          highlights: Json
          house_types: Json
          id: string
          is_published: boolean
          line_url: string | null
          map_embed_url: string | null
          map_image_url: string | null
          name: string
          nearby_places: Json
          slug: string | null
          sort_order: number
          subtitle: string | null
          updated_at: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          brochure_url?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          facilities?: Json
          facility_image_1?: string | null
          facility_image_2?: string | null
          gallery_images?: Json
          hero_image_url?: string | null
          highlights?: Json
          house_types?: Json
          id?: string
          is_published?: boolean
          line_url?: string | null
          map_embed_url?: string | null
          map_image_url?: string | null
          name: string
          nearby_places?: Json
          slug?: string | null
          sort_order?: number
          subtitle?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          brochure_url?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          facilities?: Json
          facility_image_1?: string | null
          facility_image_2?: string | null
          gallery_images?: Json
          hero_image_url?: string | null
          highlights?: Json
          house_types?: Json
          id?: string
          is_published?: boolean
          line_url?: string | null
          map_embed_url?: string | null
          map_image_url?: string | null
          name?: string
          nearby_places?: Json
          slug?: string | null
          sort_order?: number
          subtitle?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_published: boolean
          linked_project_page_id: string | null
          logo_url: string | null
          name: string
          sort_order: number
          subtitle: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_published?: boolean
          linked_project_page_id?: string | null
          logo_url?: string | null
          name: string
          sort_order?: number
          subtitle?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_published?: boolean
          linked_project_page_id?: string | null
          logo_url?: string | null
          name?: string
          sort_order?: number
          subtitle?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_linked_project_page_id_fkey"
            columns: ["linked_project_page_id"]
            isOneToOne: false
            referencedRelation: "project_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
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
