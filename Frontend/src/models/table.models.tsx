// Connector Models
export interface InstagramUserResponse {
  success: boolean;
  total: number;
  data: InstaRelationalData[];
}
export interface InstaRelationalData {
  instagram_detail: InstagramUser;
  relational_detail: RelationalDetail[];
}


// Instagram User Model
export interface InstagramUser {
  id: number
  pk_def_insta: string
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
  last_update: string
}


// Relational Detail Model
export interface RelationalDetailResponse {
  success: boolean;
  total: number;
  data: RelationalDetail[];
}
export interface RelationalDetail {
  id: number;
  relational: string;
  bg_color: string;
  text_color: string;
}