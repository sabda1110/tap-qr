import type { QueueStatus } from "./queue.schemas";

export type QueueTicketView = {
  id: string;
  number: number;
  name: string;
  service: string;
  status: QueueStatus;
  createdAt: string;
  source: "online" | "walk_in";
};

export type PublicQueueTicket = {
  outletName: string;
  number: number;
  service: string;
  status: QueueStatus;
  dateKey: string;
};
