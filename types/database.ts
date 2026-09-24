export type Role = "masyarakat" | "petugas" | "admin";
export type ReportStatus = "pending" | "diproses" | "selesai" | "ditolak";

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

export type Database = { public: { Tables: { reports: { Row: Report; Insert: Omit<Report, "id" | "created_at" | "status" | "is_public" | "categories"> & { status?: ReportStatus; is_public?: boolean }; Update: Partial<Report> }; profiles: { Row: { id: string; full_name: string | null; role: Role } }; categories: { Row: { id: string; name: string; slug: string } }; report_responses: { Row: { id: string; report_id: string; responder_id: string; message: string; created_at: string } } }; } };