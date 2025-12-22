export interface InstagramUserResponse {
  success: boolean;
  total: number;
  data: InstaRelationalData[];
}

export interface InstaRelationalData {
  instagram_detail: InstagramUser;
  relational_detail: RelationalDetail[];
}

export interface InstagramUser {
  id: number
  pk_def_insta: bigint
  profile_picture: string
  username: string
  fullname: string
  is_private: boolean
  media_post_total: number
  followers: number
  following: number
  gap: number
  biography: string
  is_mutual: boolean
  last_updated: Date
}

export interface RelationalDetail {
  id: number;
  relational: string;
  bg_color: string;
  text_color: string;
}