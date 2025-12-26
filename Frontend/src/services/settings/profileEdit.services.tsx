// src/services/profileEdit.services.ts
import axios from "axios"
import type { InstaRelationalData } from "../../models/table.models"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Fetch personal profile data including relational text
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

// Fetch to get available Personal Main Instagram Accounts for selection
export const getAvailableMainInstaAccounts = async (): Promise<InstaRelationalData[]> => {
  const res = await axios.get(
    `${BACKEND_URL}/api/insta-and-relational-user/get/insta-relation-text`,
    {
      params: { relational_id: 1 }, // Set default relation_id to 1 for available main accounts
    }
  )

  return res.data?.data ?? []
}

// Update Main Instagram Account
export const updateMainAccountCenter = async (
  payload: { id: number, username: string }
) => {
  const res = await axios.put(
    `${BACKEND_URL}/api/main-account-center/change`,
    payload
  )

  return res.data
}