"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import CategoryList from "./CategoryList";

const queryClient = new QueryClient();

const CategoryMain = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryList />
    </QueryClientProvider>
  );
};

export default CategoryMain;
