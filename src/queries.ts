import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getLanguages, getUser, getUserPlan } from "./action";
import axios from "axios";
import { PartialTypeNote } from "./lib/types";
import supabase from "./lib/supabase/client";
import { queryClient } from "./provider";

export const STALE_TIME = 1000 * 60 * 60 * 24;

export const useGetUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await getUser();
      if (error) {
        console.error("Error getting user:", error);
        return null;
      }
      return data;
    },
    enabled,
  });
};

export const useGetUserPlan = () => {
  return useQuery({
    queryKey: ["plan"],
    queryFn: async () => {
      const { data, error } = await getUserPlan();
      if (error) {
        console.error("Error getting user plan:", error);
        return null;
      }
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const createNote = async ({
  noteType,
  audioUrl,
  audioFilename,
  youtubeUrl,
  imageUrl,
  text,
  device,
  accessToken,
}: {
  noteType: "audio" | "upload" | "text" | "youtube" | "image";
  audioUrl?: string;
  audioFilename?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  text?: string;
  device: string;
  accessToken: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes`,
      {
        platform: "webapp",
        noteType,
        audioUrl: audioUrl || imageUrl,
        text: text,
        audioFilename,
        youtubeUrl,
        device,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { data: response.data };
  } catch (error: any) {
    let errorMessage;
    if (error.response.data.statusCode === 422) {
      errorMessage = `${error.response.data.message
        .map((e: any) => e.property)
        .join(" ,")} not provided`;
    } else {
      errorMessage = error.response.data.message;
    }

    console.error("Error creating note:", error);
    return { error: errorMessage };
  }
};

export const useGetInitialNotes = (): UseQueryResult<PartialTypeNote[]> => {
  return useQuery({
    queryKey: ["all_notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select(
          "id, folder_id, title, created_at, note_type, favourite, public, is_ready, recommendations, note_type, audio_url, media_duration, attached_image_urls, transcript, tags, youtube_url, file_name"
        )
        .order("created_at", { ascending: false })
        .range(0, 3 - 1);

      if (error) {
        console.error("Error getting initial notes:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      data.forEach((note) => {
        queryClient.setQueryData(["notes", note.id], note);
      });

      return data;
    },
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });
};

export const useGetLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await getLanguages();
      if (error) {
        // errorToast(`${error}`);
        console.error("Error getting languages:", error);
        return [];
      }
      return data || [];
    },
    staleTime: STALE_TIME,
  });
};
