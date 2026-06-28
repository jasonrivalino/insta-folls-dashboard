import axios from "axios";
import type { InstagramUser, RelationalDetailResponse } from "../../models/table.models";
import { getInstagramUsers } from "../dataVisualization/instaUserList.services";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Service to get all relational details
export const getRelationalDetails = async (): Promise<RelationalDetailResponse> => {
  const response = await axios.get(
    `${BACKEND_URL}/api/relational-status-data`
  );
  return response.data;
}

// Service to add new Instagram user and relational details
export type InstagramUserCreatePayload = Omit<
  InstagramUser,
  | "id"
  | "gap"
  | "last_update"
>;
export const addInstagramUser = async (
  formData: InstagramUserCreatePayload,
  relationalIds: number[],
  subrelationalIds: number[]
): Promise<void> => {
  // Create Instagram user
  const userRes = await axios.post(
    `${BACKEND_URL}/api/insta-user-data/add`,
    formData
  );

  const newInstaUserId: number = userRes.data?.data?.id;

  if (!newInstaUserId) {
    throw new Error("Failed to retrieve new Instagram user ID");
  }

  // Create relations (parallel)
  await Promise.all(
    relationalIds.map((relationalId) =>
      axios.post(`${BACKEND_URL}/api/insta-and-relational-user/add`, {
        insta_user_id: newInstaUserId,
        relational_id: relationalId,
      })
    )
  );

  // Create subrelations (parallel)
  await Promise.all(
    subrelationalIds.map((subrelationalId) =>
      axios.post(`${BACKEND_URL}/api/insta-and-subrelational-user/add`, {
        insta_user_id: newInstaUserId,
        subrelational_id: subrelationalId,
      })
    )
  );
};

// Update Instagram main data
export const updateInstagramUser = async (
  instaUserId: number,
  formData: InstagramUserCreatePayload,
  selectedRelationIds: number[],
  selectedSubrelationalIds: number[]
) => {
  // Update main Instagram data
  await axios.put(
    `${BACKEND_URL}/api/insta-user-data/edit/${instaUserId}`,
    formData
  );
  
  // Get current relations from backend (single source of truth)
  const users = await getInstagramUsers({
    insta_user_id: instaUserId,
  });
  const currentRelations =
    users?.data[0]?.relational_detail?.map((r) => r.id) ?? [];
  const currentSubrelations =
    users?.data[0]?.relational_detail?.flatMap((r) => r.subrelational_list?.map((s) => s.subrelational_id) ?? []) ?? [];

  // Diff relations
  const relationsToAdd = selectedRelationIds.filter(
    (id) => !currentRelations.includes(id)
  );
  const relationsToDelete = currentRelations.filter(
    (id) => !selectedRelationIds.includes(id)
  );

  // Diff subrelations
  const subrelationsToAdd = selectedSubrelationalIds.filter(
    (id) => !currentSubrelations.includes(id)
  );
  const subrelationsToDelete = currentSubrelations.filter(
    (id) => !selectedSubrelationalIds.includes(id)
  );

  // Execute ADD
  await Promise.all(
    relationsToAdd.map((relId) =>
      axios.post(`${BACKEND_URL}/api/insta-and-relational-user/add`, {
        insta_user_id: instaUserId,
        relational_id: relId,
      })
    )
  );

  // Execute DELETE
  await Promise.all(
    relationsToDelete.map((relId) =>
      axios.delete(`${BACKEND_URL}/api/insta-and-relational-user/delete`, {
        data: {
          insta_user_id: instaUserId,
          relational_id: relId,
        },
      })
    )
  );

  // Execute ADD for subrelations
  await Promise.all(
    subrelationsToAdd.map((subrelId) =>
      axios.post(`${BACKEND_URL}/api/insta-and-subrelational-user/add`, {
        insta_user_id: instaUserId,
        subrelational_id: subrelId,
      })
    )
  );

  // Execute DELETE for subrelations
  await Promise.all(
    subrelationsToDelete.map((subrelId) =>
      axios.delete(`${BACKEND_URL}/api/insta-and-subrelational-user/delete`, {
        data: {
          insta_user_id: instaUserId,
          subrelational_id: subrelId,
        },
      })
    )
  );
};

// Service to delete an Instagram user by ID
export const deleteInstagramUser = async (
  instaUserId: number
): Promise<void> => {
  await axios.delete(
    `${BACKEND_URL}/api/insta-user-data/delete/${instaUserId}`
  );
};