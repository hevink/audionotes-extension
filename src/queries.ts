import { useQuery } from "@tanstack/react-query";
import { getUser, getUserPlan } from "./action";
import axios from "axios";

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
