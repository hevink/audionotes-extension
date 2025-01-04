import { Database } from "../../database.types";

export type TypeNote = Database["public"]["Tables"]["notes"]["Row"];

export type TypeUser = Database["public"]["Tables"]["users"]["Row"];

export type PartialTypeNote = Pick<
  TypeNote,
  | "id"
  | "folder_id"
  | "title"
  | "created_at"
  | "note_type"
  | "favourite"
  | "public"
  | "is_ready"
  | "recommendations"
  | "audio_url"
  | "media_duration"
  | "attached_image_urls"
  | "transcript"
  | "tags"
  | "youtube_url"
  | "file_name"
> &
  Partial<
    Omit<
      TypeNote,
      | "id"
      | "folder_id"
      | "title"
      | "created_at"
      | "note_type"
      | "favourite"
      | "public"
      | "is_ready"
      | "recommendations"
      | "audio_url"
      | "media_duration"
      | "attached_image_urls"
      | "transcript"
      | "tags"
      | "youtube_url"
      | "file_name"
    >
  >;
