import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EntryIdVisitorRecord } from '../backend';

interface VisitorFormData {
  fullName: string;
  email: string;
  address: string;
  jobInfo: string;
  incomeLevel: string;
  reasonForVisit: string;
  visitType: string;
}

export function useGetVisitorRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<EntryIdVisitorRecord[]>({
    queryKey: ['visitorRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSortedVisitorRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVisitorRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VisitorFormData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVisitorRecord(
        data.fullName,
        data.email,
        data.address,
        data.jobInfo,
        data.incomeLevel,
        data.reasonForVisit,
        data.visitType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorRecords'] });
    },
  });
}

export function useAdminLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminLogin(password);
    },
  });
}

export function useExportVisitorRecords() {
  const { actor } = useActor();

  return useQuery<EntryIdVisitorRecord[]>({
    queryKey: ['exportVisitorRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.exportVisitorRecords();
    },
    enabled: false,
  });
}
