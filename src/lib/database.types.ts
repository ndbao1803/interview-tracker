export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          user_id: string | null;
          position_id: string | null;
          total_rounds: number;
          current_round: number | null;
          status: string | null;
          rejected_round: number | null;
          note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          position_id?: string | null;
          total_rounds: number;
          current_round?: number | null;
          status?: string | null;
          rejected_round?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          position_id?: string | null;
          total_rounds?: number;
          current_round?: number | null;
          status?: string | null;
          rejected_round?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_position_id_fkey";
            columns: ["position_id"];
            referencedRelation: "positions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          location: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          location?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string | null;
          location?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      interview_rounds: {
        Row: {
          id: string;
          application_id: string | null;
          round_number: number;
          feedback: string | null;
          status: string;
          note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          application_id?: string | null;
          round_number: number;
          feedback?: string | null;
          status: string;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          application_id?: string | null;
          round_number?: number;
          feedback?: string | null;
          status?: string;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "interview_rounds_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      positions: {
        Row: {
          id: string;
          company_id: string | null;
          title: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          title: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          title?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey";
            columns: ["company_id"];
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password: string | null;
          google_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          password?: string | null;
          google_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          password?: string | null;
          google_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums = Database['public']['Enums'];
