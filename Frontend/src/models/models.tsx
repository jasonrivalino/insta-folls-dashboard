export interface InstagramUser {
  id: number
  pk_def_insta: bigint
  profile_picture: string
  username: string
  full_name: string
  is_private: boolean
  media_post_total: number
  followers: number
  following: number
  biography: string
  is_mutual: boolean
  last_updated: Date
}