// src/services/profileEdit.services.ts
import axios from "axios"
import type { InstaRelationalData } from "../../models/table.models"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const getPersonalProfileData = async (
  instaUserId: number
): Promise<InstaRelationalData | null> => {
  const res = await axios.get(
    `${BACKEND_URL}/api/insta-and-relational-user/get/insta-relation-text`,
    {
      params: {
        insta_user_id: instaUserId,
      },
    }
  )

  const data = res.data?.data
  if (!data || data.length === 0) return null

  return data[0]
}