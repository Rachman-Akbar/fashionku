import { useMutation, useQuery } from "@tanstack/react-query";

export function useCrudList({ queryKey, queryFn, enabled = true, staleTime }) {
  return useQuery({ queryKey, queryFn, enabled, staleTime });
}

export function useCrudMutations({ createFn, updateFn, deleteFn }) {
  const createMutation = useMutation({ mutationFn: createFn });
  const updateMutation = useMutation({ mutationFn: updateFn });
  const deleteMutation = useMutation({ mutationFn: deleteFn });

  return { createMutation, updateMutation, deleteMutation };
}
