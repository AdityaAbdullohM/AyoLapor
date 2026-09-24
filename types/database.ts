export type Role = "masyarakat" | "petugas" | "admin";
export type ReportStatus = "pending" | "diproses" | "selesai" | "ditolak";

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
};

export type Report = {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  address: string;
  image_path: string | null;
  status: ReportStatus;
  is_public: boolean;
  created_at: string;
  categories?: { name: string } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ReportResponse = {
  id: string;
  report_id: string;
  responder_id: string;
  message: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      reports: {
        Row: Report;
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          address: string;
          image_path?: string | null;
          status?: ReportStatus;
          is_public?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          address: string;
          image_path: string | null;
          status: ReportStatus;
          is_public: boolean;
        }>;
        Relationships: [
          {
            foreignKeyName: "reports_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          role?: Role;
        };
        Update: Partial<{
          full_name: string | null;
          role: Role;
        }>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: Partial<{
          name: string;
          slug: string;
        }>;
        Relationships: [];
      };
      report_responses: {
        Row: ReportResponse;
        Insert: {
          id?: string;
          report_id: string;
          responder_id: string;
          message: string;
          created_at?: string;
        };
        Update: Partial<{
          report_id: string;
          responder_id: string;
          message: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "report_responses_responder_id_fkey";
            columns: ["responder_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};