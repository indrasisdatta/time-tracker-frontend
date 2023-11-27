"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import CategoryList from "./CategoryList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const CategoryMain = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryList />
    </QueryClientProvider>
  );
};

export default CategoryMain;
