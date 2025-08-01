import { useQuery, useMutation } from "@tanstack/react-query";

import { getUsers, updateUserRole, updateUserCredits } from "@/api";

import { toast } from "../useToast";

export const useUsers = (page: number, limit: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsers(page, limit),
  });

  return {
    data,
    isLoading,
    error,
  };
};

export const useUpdateUserRole = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (params: { id: string; role: string }) =>
      updateUserRole(params.id, params.role),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update user role: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    mutateAsync,
  };
};

export const useUpdateUserCredits = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: { id: string; amount: number }) =>
      updateUserCredits(params.id, params.amount),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User credits updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update user credits: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
