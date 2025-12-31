import type { InstagramUserResponse } from "../../models/table.models";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export type InstagramUserQuery = {
  sortBy?: "pk_def_insta" | "username" | "fullname" | "followers" | "following" | "gap" | "media_post_total";
  order?: "asc" | "desc";
  is_private?: boolean;
  is_mutual?: boolean;
  search?: string;
  insta_user_id?: number;
  relational_id?: number;
  limit?: number;
};

export const getInstagramUsers = async (
  query?: InstagramUserQuery
): Promise<InstagramUserResponse | null> => {
  try {
    const response = await axios.get<InstagramUserResponse>(
      `${BACKEND_URL}/api/insta-and-relational-user/get/insta-relation-text`,
      {
        params: query,
      }
    )

    if (!response.data.success) {
      throw new Error("Failed to fetch Instagram users")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching Instagram users:", error)
    return null
  }
};