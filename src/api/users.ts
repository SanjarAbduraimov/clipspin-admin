import { User } from "../types";

import axios from "./axios";

export const getUsers = async (
  page: number,
  limit: number,
): Promise<{ data: User[]; total: number }> => {
  const response = await axios.get(`/users?_page=${page}&_limit=${limit}`);
  return response.data;
};

export const updateUserRole = async (
  id: string,
  role: string,
): Promise<User> => {
  const response = await axios.patch(`/users/${id}/role`, { role });
  return response.data;
};

export const updateUserCredits = async (
  id: string,
  amount: number,
): Promise<User> => {
  const response = await axios.patch(`/users/${id}/credits`, {
    operation: "add",
    amount,
  });
  return response.data;
};
