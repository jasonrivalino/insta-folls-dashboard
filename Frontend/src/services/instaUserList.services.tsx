import type { InstagramUser, InstagramUserResponse } from "../models/models";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export type InstagramUserQuery = {
  sortBy?: "followers" | "following" | "media_post_total" | "last_updated";
  order?: "asc" | "desc";
  is_private?: boolean;
  is_mutual?: boolean;
};

export const getInstagramUsers = async (
  query?: InstagramUserQuery
): Promise<InstagramUser[]> => {
  try {
    const response = await axios.get<InstagramUserResponse>(
      `${BACKEND_URL}/api/insta-user-data`,
      {
        params: query, // 👈 auto builds ?sortBy=...&order=...
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch Instagram users");
    }

    return response.data.data.map((user) => ({
      id: user.id,
      pk_def_insta: user.pk_def_insta,
      profile_picture: user.profile_picture,
      username: user.username,
      fullname: user.fullname,
      is_private: user.is_private,
      media_post_total: user.media_post_total,
      followers: user.followers,
      following: user.following,
      biography: user.biography,
      is_mutual: user.is_mutual,
      last_updated: new Date(user.last_updated),
    }));
  } catch (error) {
    console.error("Error fetching Instagram users:", error);
    return [];
  }
};