import type { TicketStatus } from "@/types/ticket";
import api from "../axios";

export interface CreateTicketParams {
    Title: string;
    Description: string;
}
export interface AddCommentParams {
    Content: string;
}
export interface UpdateTicketStatusParams {
    newStatus: TicketStatus;
}

export class TicketsApi {
    private readonly baseUrl = "tickets";

    async getAll() {
        const { data } = await api.get(this.baseUrl);
        return data;
    }

    async getMyTickets() {
        const { data } = await api.get(`${this.baseUrl}/me`);
        return data;
    }

    async getById(ticketId: string) {
        const { data } = await api.get(`${this.baseUrl}/${ticketId}`);
        return data;
    }

    async create(params: CreateTicketParams) {
        const { data } = await api.post(this.baseUrl, params);
        return data;
    }

    async updateStatus(ticketId: string, status: TicketStatus) {
        const { data } = await api.put(`${this.baseUrl}/${ticketId}/status`, {
            newStatus: status,
        });
        return data;
    }

    async addComment(ticketId: string, params: AddCommentParams) {
        const { data } = await api.post(`${this.baseUrl}/${ticketId}/comment`, params);
        return data;
    }
}

export const ticketsApi = new TicketsApi();