export type Ticket = {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: string;
    status: TicketStatus;
    updatedAt: string;
    assignedAdminId: string | null;
    comments: Comment[];
}

export type Comment = {
    authorId: string;
    content: string;
    createdAt: string;
}

export const TicketStatus = {
    Open: 0,
    InProgress: 1,
    Resolved: 2,
    Closed: 3,
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const ticketStatusLabels: Record<TicketStatus, string> = {
    [TicketStatus.Open]: "Aberto",
    [TicketStatus.InProgress]: "Em Progresso",
    [TicketStatus.Resolved]: "Resolvido",
    [TicketStatus.Closed]: "Fechado",
};