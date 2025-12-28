// Connector Models
export interface InstagramUserResponse {
  success: boolean;
  general_statistics: GeneralStatistics;
  data: InstaRelationalData[];
}
export interface InstaRelationalData {
  instagram_detail: InstagramUser;
  data_statistics: PersonalInstaRankings;
  relational_detail: RelationalDetail[];
}


// Instagram User Model
export interface InstagramUser {
  id: number
  pk_def_insta: string
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

// General Statistics Model
export interface GeneralStatistics {
  total_data: number;
  average_followers: number;
  average_following: number;
  average_gap: number;
}
export interface PersonalInstaRankings {
  oldest_rank: number;
  followers_rank: number;
  following_rank: number;
  gap_rank: number;
}

// Table Data Model
export interface TableData {
  no: number;
  id: number;
  pk_def_insta: string;
  username: string;
  fullname: string;
  is_private: boolean;
  media_post_total: number;
  followers: number;
  following: number;
  biography: string;
  is_mutual: boolean;
  last_update: string;
  relations: string[];
}