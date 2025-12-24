import type { InstagramUserResponse, InstaRelationalData } from "../models/models";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export type InstagramUserQuery = {
  sortBy?: "pk_def_insta" | "username" | "fullname" | "followers" | "following" | "gap" | "media_post_total";
  order?: "asc" | "desc";
  is_private?: boolean;
  is_mutual?: boolean;
  search?: string;
};

export const getInstagramUsers = async (
  query?: InstagramUserQuery
): Promise<InstaRelationalData[]> => {
  try {
    const response = await axios.get<InstagramUserResponse>(
      `${BACKEND_URL}/api/insta-and-relational-user/get/insta-relation-text`,
      {
        params: query,
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch Instagram users");
    }

    return response.data.data.map((user) => ({
      instagram_detail: {
        id: user.instagram_detail.id,
        pk_def_insta: user.instagram_detail.pk_def_insta,
        profile_picture: user.instagram_detail.profile_picture,
        username: user.instagram_detail.username,
        fullname: user.instagram_detail.fullname,
        is_private: user.instagram_detail.is_private,
        media_post_total: user.instagram_detail.media_post_total,
        followers: user.instagram_detail.followers,
        following: user.instagram_detail.following,
        gap: user.instagram_detail.gap,
        biography: user.instagram_detail.biography,
        is_mutual: user.instagram_detail.is_mutual,
        last_updated: new Date(user.instagram_detail.last_updated),
      },
      relational_detail: user.relational_detail || [],
    }));
  } catch (error) {
    console.error("Error fetching Instagram users:", error);
    return [];
  }
};