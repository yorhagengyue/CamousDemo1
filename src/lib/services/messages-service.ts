import type { ComposeMessagePayload, MessageSummary, MessageThread } from "@/types/messages";
import type { PaginatedResponse } from "@/types/common";
import { apiGet, apiPatch, apiPost } from "@/lib/http";

export interface MessageQueryParams {
  channel?: string;
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}

export async function fetchMessages(params: MessageQueryParams) {
  const query = new URLSearchParams();
  if (params.channel) query.append("channel", params.channel);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));
  if (params.unreadOnly) query.append("unreadOnly", "true");
  const search = query.toString();
  return apiGet<PaginatedResponse<MessageSummary>>(`/messages${search ? `?${search}` : ""}`);
}

export function fetchMessageThread(id: string) {
  return apiGet<MessageThread>(`/messages/${id}`);
}

export function markMessageRead(id: string) {
  return apiPatch<MessageThread>(`/messages/${id}`, { action: "markRead" });
}

export function sendMessage(payload: ComposeMessagePayload) {
  return apiPost<MessageThread>("/messages", payload);
}