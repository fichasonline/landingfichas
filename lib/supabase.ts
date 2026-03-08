import "server-only";

import { createClient } from "@supabase/supabase-js";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Database = {
  public: {
    Tables: {
      leads_agenda_semanal: {
        Row: {
          id: string;
          nombre: string;
          email: string;
          whatsapp: string | null;
          consent_email: boolean;
          created_at: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_term: string | null;
          referrer: string | null;
          landing_path: string | null;
          source_url: string | null;
          event_id: string | null;
          fbp: string | null;
          fbc: string | null;
          ip: string | null;
          user_agent: string | null;
        };
        Insert: {
          nombre: string;
          email: string;
          whatsapp?: string | null;
          consent_email: boolean;
          created_at?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          referrer?: string | null;
          landing_path?: string | null;
          source_url?: string | null;
          event_id?: string | null;
          fbp?: string | null;
          fbc?: string | null;
          ip?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          nombre?: string;
          email?: string;
          whatsapp?: string | null;
          consent_email?: boolean;
          created_at?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          referrer?: string | null;
          landing_path?: string | null;
          source_url?: string | null;
          event_id?: string | null;
          fbp?: string | null;
          fbc?: string | null;
          ip?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type LeadRecordInsert =
  Database["public"]["Tables"]["leads_agenda_semanal"]["Insert"];

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
