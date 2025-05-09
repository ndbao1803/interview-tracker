export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string | null
          current_round: number | null
          id: string
          note: string | null
          position_id: string | null
          rejected_round: number | null
          status: string | null
          total_rounds: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_round?: number | null
          id?: string
          note?: string | null
          position_id?: string | null
          rejected_round?: number | null
          status?: string | null
          total_rounds: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_round?: number | null
          id?: string
          note?: string | null
          position_id?: string | null
          rejected_round?: number | null
          status?: string | null
          total_rounds?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          industry_id: string | null
          location: string | null
          logo: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          location?: string | null
          logo?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          location?: string | null
          logo?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industry"
            referencedColumns: ["id"]
          },
        ]
      }
      industry: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interview_rounds: {
        Row: {
          application_id: string | null
          created_at: string | null
          feedback: string | null
          id: string
          note: string | null
          round_number: number
          status: string
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          note?: string | null
          round_number: number
          status: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          note?: string | null
          round_number?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_rounds_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          google_id: string | null
          id: string
          password: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          google_id?: string | null
          id?: string
          password?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          google_id?: string | null
          id?: string
          password?: string | null
          updated_at?: string | null
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums = Database['public']['Enums'];
