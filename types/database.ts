export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      saved_threads: {
        Row: {
          id: string;
          user_id: string;
          original_url: string;
          content_snippet: string | null;
          image_url: string | null;
          author_name: string | null;
          author_username: string | null;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_url: string;
          content_snippet?: string | null;
          image_url?: string | null;
          author_name?: string | null;
          author_username?: string | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_url?: string;
          content_snippet?: string | null;
          image_url?: string | null;
          author_name?: string | null;
          author_username?: string | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      thread_tags: {
        Row: {
          thread_id: string;
          tag_id: string;
        };
        Insert: {
          thread_id: string;
          tag_id: string;
        };
        Update: {
          thread_id?: string;
          tag_id?: string;
        };
      };
    };
    Functions: {
      search_threads: {
        Args: {
          p_user_id: string;
          p_query: string;
          p_limit?: number;
        };
        Returns: {
          id: string;
          original_url: string;
          content_snippet: string | null;
          image_url: string | null;
          author_name: string | null;
          created_at: string;
          score: number;
        }[];
      };
    };
  };
};

export type SavedThread = Database['public']['Tables']['saved_threads']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type SavedThreadWithTags = SavedThread & {
  tags: Tag[];
};
