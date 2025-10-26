export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string;
          created_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          name: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
      exam_papers: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          title: string;
          year: number;
          exam_type: string;
          file_url: string;
          file_name: string;
          status: string;
          total_questions: number;
          created_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id: string;
          title: string;
          year: number;
          exam_type?: string;
          file_url: string;
          file_name: string;
          status?: string;
          total_questions?: number;
          created_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string;
          title?: string;
          year?: number;
          exam_type?: string;
          file_url?: string;
          file_name?: string;
          status?: string;
          total_questions?: number;
          created_at?: string;
          processed_at?: string | null;
        };
      };
      questions: {
        Row: {
          id: string;
          paper_id: string;
          topic_id: string | null;
          question_text: string;
          question_number: number;
          marks: number;
          difficulty: string;
          keywords: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          paper_id: string;
          topic_id?: string | null;
          question_text: string;
          question_number: number;
          marks?: number;
          difficulty?: string;
          keywords?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          paper_id?: string;
          topic_id?: string | null;
          question_text?: string;
          question_number?: number;
          marks?: number;
          difficulty?: string;
          keywords?: string[];
          created_at?: string;
        };
      };
      study_materials: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          topic_id: string | null;
          title: string;
          type: string;
          description: string;
          file_url: string;
          author: string;
          year: number | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id: string;
          topic_id?: string | null;
          title: string;
          type: string;
          description?: string;
          file_url: string;
          author?: string;
          year?: number | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string;
          topic_id?: string | null;
          title?: string;
          type?: string;
          description?: string;
          file_url?: string;
          author?: string;
          year?: number | null;
          tags?: string[];
          created_at?: string;
        };
      };
    };
  };
}
