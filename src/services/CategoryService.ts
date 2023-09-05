import { Category, CategoryAddFormValues } from "../models/Category";
import { axios } from "./axios";

export const getCategories = async () => {
  return await axios.get("category");
};

export const getCategory = async (catId: string | undefined) => {
  return await axios.get(`category/${catId}`);
};

export const addCategory = async (data: CategoryAddFormValues) => {
  return await axios.post("category", data);
};

export const updateCategory = async (
  data: CategoryAddFormValues,
  catId: string
) => {
  return await axios.put(`category/${catId}`, data);
};

export const deleteCategory = async (catId: string) => {
  return await axios.delete(`category/${catId}`);
};
