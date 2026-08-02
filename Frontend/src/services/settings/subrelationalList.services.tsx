import axios from "axios";
import type { SubRelationalDetailResponse, SubRelationalDetail } from "../../models/table.models";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch subrelational detail list from backend
export const getSubrelationalList = async (relationsId?: number, haveSubrelational?: boolean): Promise<SubRelationalDetailResponse> => {
  const response = await axios.get<SubRelationalDetailResponse>(
    `${BACKEND_URL}/api/subrelational-status-data`,
    {
      params: {
        relationsId,
        haveSubrelational,
      },
    }
  );
  return response.data;
};

export type SubRelationalCreatePayload = Omit<
  SubRelationalDetail,
  | "id"
>;
export type SubRelationalUpdatePayload = Omit<
  SubRelationalDetail,
  | "id"
  | "relationsId"
>;

// Service to add a new SubRelational Detail
export const createSubrelational = async (payload: SubRelationalCreatePayload) => {
  const res = await axios.post(
    `${BACKEND_URL}/api/subrelational-status-data/add`,
    payload
  );
  return res.data;
};

// Service to update an existing Subrelational Detail
export const updateSubrelational = async (
  subrelationalId: number,
  payload: SubRelationalUpdatePayload
) => {
  const res = await axios.put(
    `${BACKEND_URL}/api/subrelational-status-data/edit/${subrelationalId}`,
    payload
  );
  return res.data;
}

// Service to delete an Subrelational Detail by its ID
export const deleteSubrelational = async (
  subrelationalId: number
): Promise<void> => {
  await axios.delete(
    `${BACKEND_URL}/api/subrelational-status-data/delete/${subrelationalId}`
  );
};