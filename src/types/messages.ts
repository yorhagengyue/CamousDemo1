import type { ISODateString } from "@/types/common";
import type { UserRole } from "@/types/auth";

export type MessageChannel = "announcement" | "direct" | "system";

export interface MessageSummary {
  id: string;
  subject: string;
  preview: string;
  channel: MessageChannel;
  senderId: string;
  senderName: string;
  recipientIds: string[];
  createdAt: ISODateString;
  readAt?: ISODateString;
  isRead: boolean;
  tags: string[];
  roleVisibility: UserRole[];
}

export interface MessageThread extends MessageSummary {
  body: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export interface ComposeMessagePayload {
  subject: string;
  body: string;
  channel: MessageChannel;
  recipients: string[];
  tags?: string[];
}