import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchMessageThread,
  fetchMessages,
  markMessageRead,
  sendMessage,
  type MessageQueryParams
} from "@/lib/services/messages-service";
import type { ComposeMessagePayload, MessageSummary, MessageThread } from "@/types/messages";
import type { PaginatedResponse } from "@/types/common";

const MESSAGES_KEY = "messages";

export function useMessages(params: MessageQueryParams, options?: { enabled?: boolean }) {
  return useQuery<PaginatedResponse<MessageSummary>, Error>({
    queryKey: [MESSAGES_KEY, params],
    queryFn: () => fetchMessages(params),
    enabled: options?.enabled ?? true
  });
}

export function useUnreadMessagesCount(enabled: boolean) {
  return useQuery<number, Error>({
    queryKey: [MESSAGES_KEY, "unread-count"],
    queryFn: async () => {
      const response = await fetchMessages({ page: 1, pageSize: 1, unreadOnly: true });
      return response.total;
    },
    enabled
  });
}

export function useMessageThread(id?: string) {
  return useQuery<MessageThread, Error>({
    queryKey: [MESSAGES_KEY, "thread", id],
    queryFn: () => fetchMessageThread(id!),
    enabled: Boolean(id)
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
    }
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ComposeMessagePayload) => sendMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
    }
  });
}