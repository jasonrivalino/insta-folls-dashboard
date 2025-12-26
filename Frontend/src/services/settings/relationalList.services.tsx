import axios from "axios";
import type { RelationalDetail, RelationalDetailResponse } from "../../models/table.models";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch relational status list from backend
export const getRelationalList = async (): Promise<RelationalDetailResponse> => {
  const response = await axios.get<RelationalDetailResponse>(
    `${BACKEND_URL}/api/relational-status-data`
  );

  return response.data;
};

export type RelationalPayload = Omit<
  RelationalDetail,
  | "id"
>;

// Service to add a new Relational Status
export const createRelational = async (payload: RelationalPayload) => {
  const res = await axios.post(
    `${BACKEND_URL}/api/relational-status-data/add`,
    payload
  );
  return res.data;
};

// Service to update an existing Relational Status
export const updateRelational = async (
  relationalId: number,
  payload: RelationalPayload
) => {
  const res = await axios.put(
    `${BACKEND_URL}/api/relational-status-data/edit/${relationalId}`,
    payload
  );
  return res.data;
}

// Service to delete an Relational Status by its ID
export const deleteRelational = async (
  relationalId: number
): Promise<void> => {
  await axios.delete(
    `${BACKEND_URL}/api/relational-status-data/delete/${relationalId}`
  );
};