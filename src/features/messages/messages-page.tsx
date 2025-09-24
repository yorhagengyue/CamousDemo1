import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inbox, MailPlus, Send, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMessages, useMessageThread, useMarkMessageRead, useSendMessage } from "@/hooks/use-messages";
import type { MessageChannel, MessageSummary } from "@/types/messages";

const composeSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  body: z.string().min(10, "Message body must be at least 10 characters"),
  channel: z.enum(["announcement", "direct", "system"]),
  recipients: z.string().min(3, "Please provide at least one recipient")
});

type ComposeFormValues = z.infer<typeof composeSchema>;

const CHANNEL_FILTERS: Array<{ label: string; value: "all" | MessageChannel }> = [
  { label: "All", value: "all" },
  { label: "Announcements", value: "announcement" },
  { label: "Direct", value: "direct" },
  { label: "System", value: "system" }
];

export function MessagesPage() {
  const [channelFilter, setChannelFilter] = useState<(typeof CHANNEL_FILTERS)[number]["value"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>(undefined);

  const messagesQuery = useMessages(
    {
      channel: channelFilter !== "all" ? channelFilter : undefined,
      page,
      pageSize: 10
    },
    { enabled: true }
  );

  const messageThreadQuery = useMessageThread(selectedMessageId);
  const markReadMutation = useMarkMessageRead();
  const sendMessageMutation = useSendMessage();

  const filteredMessages = useMemo(() => {
    if (!messagesQuery.data) return [];
    if (!searchTerm) return messagesQuery.data.data;
    return messagesQuery.data.data.filter((message) =>
      [message.subject, message.preview, message.senderName]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [messagesQuery.data, searchTerm]);

  const handleSelectMessage = (message: MessageSummary) => {
    setSelectedMessageId(message.id);
    if (!message.isRead) {
      markReadMutation.mutate(message.id);
    }
  };

  const composeForm = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      subject: "",
      body: "",
      channel: "announcement",
      recipients: ""
    }
  });

  const onSubmitCompose = (values: ComposeFormValues) => {
    const recipients = values.recipients
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    sendMessageMutation.mutate(
      {
        subject: values.subject,
        body: values.body,
        channel: values.channel,
        recipients
      },
      {
        onSuccess: () => {
          composeForm.reset();
        }
      }
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="h-4 w-4" /> Inbox
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <MailPlus className="mr-2 h-4 w-4" /> Compose
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compose Message</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={composeForm.handleSubmit(onSubmitCompose)}>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...composeForm.register("subject")} />
                  {composeForm.formState.errors.subject ? (
                    <p className="text-xs text-destructive">{composeForm.formState.errors.subject.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients (comma separated IDs)</Label>
                  <Input id="recipients" {...composeForm.register("recipients")} />
                  {composeForm.formState.errors.recipients ? (
                    <p className="text-xs text-destructive">{composeForm.formState.errors.recipients.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <select
                    id="channel"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...composeForm.register("channel")}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="direct">Direct</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea id="body" rows={6} {...composeForm.register("body")} />
                  {composeForm.formState.errors.body ? (
                    <p className="text-xs text-destructive">{composeForm.formState.errors.body.message}</p>
                  ) : null}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={sendMessageMutation.isPending}>
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {CHANNEL_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={channelFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setChannelFilter(filter.value);
                  setPage(1);
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search subject or sender"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Separator />
          <ScrollArea className="h-[520px]">
            <div className="space-y-2">
              {filteredMessages.map((message) => {
                const isActive = selectedMessageId === message.id;
                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full rounded-md border p-3 text-left transition hover:bg-muted ${
                      isActive ? "border-primary bg-primary/10" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{message.subject}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleDateString()} {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{message.senderName}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{message.preview}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={message.isRead ? "outline" : "secondary"}>
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {message.channel}
                      </Badge>
                    </div>
                  </button>
                );
              })}
              {!filteredMessages.length && !messagesQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">No messages found.</p>
              ) : null}
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">Page {page}</span>
            <Button
              variant="ghost"
              size="sm"
              disabled={(messagesQuery.data?.data.length ?? 0) < 10}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="text-base">Message Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMessageId && messageThreadQuery.data ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold">{messageThreadQuery.data.subject}</h2>
                <p className="text-sm text-muted-foreground">
                  {messageThreadQuery.data.senderName} ? {new Date(messageThreadQuery.data.createdAt).toLocaleString()}
                </p>
              </div>
              <Separator />
              <div className="prose max-w-none text-sm text-muted-foreground">
                <p>{messageThreadQuery.data.body}</p>
              </div>
              {messageThreadQuery.data.attachments?.length ? (
                <div>
                  <h3 className="text-sm font-medium">Attachments</h3>
                  <ul className="text-sm text-primary">
                    {messageThreadQuery.data.attachments.map((attachment) => (
                      <li key={attachment.id}>
                        <a href={attachment.url} className="hover:underline">
                          {attachment.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center text-sm text-muted-foreground">
              Select a message to view the conversation.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}