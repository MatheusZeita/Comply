// mocks/userMock.ts
import { User, Role, DeliveryAddress } from "@/types/user";

// Mock de endereços de entrega
const mockDeliveryAddresses: DeliveryAddress[] = [
  {
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    isDefault: true,
  },
  {
    street: "Av. Paulista",
    number: "1000",
    complement: undefined,
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    isDefault: false,
  },
];

// Mock do usuário principal (u011)
export const mockUser: User = {
  id: "u011",
  name: "Luan Fernando",
  email: "luanfernando25@gmail.com",
  passwordHash: "$2a$10$FakeHashForDevelopment123456789", // Hash fake
  phoneNumber: "+55 11 98765-4321",
  profilePic: undefined,
  role: Role.User,
  createdAt: "2024-06-15T10:30:00Z",
  deliveryAddresses: mockDeliveryAddresses,
  watchList: [
    "1", // Drone Dji Neo
    "5", // Steam Deck
    "7", // RTX 4080
    "19", // Relógio Vintage
  ],
};

// Mock de usuário Admin (para testes de permissões)
export const mockAdminUser: User = {
  id: "u001",
  name: "Admin User",
  email: "admin@comply.com",
  passwordHash: "$2a$10$FakeAdminHashForDevelopment123",
  phoneNumber: "+55 11 91234-5678",
  profilePic: undefined,
  role: Role.Admin,
  createdAt: "2023-01-10T08:00:00Z",
  deliveryAddresses: [],
  watchList: [],
};

// Mock de usuário Moderador
export const mockModeratorUser: User = {
  id: "u002",
  name: "Moderator User",
  email: "moderator@comply.com",
  passwordHash: "$2a$10$FakeModHashForDevelopment123",
  phoneNumber: "+55 11 99876-5432",
  profilePic: undefined,
  role: Role.Moderator,
  createdAt: "2023-03-20T14:00:00Z",
  deliveryAddresses: [mockDeliveryAddresses[0]],
  watchList: ["2", "4"],
};

// Array com todos os usuários mock
export const mockUsers: User[] = [mockUser, mockAdminUser, mockModeratorUser];

// Helper functions para facilitar testes
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

export const isUserAdmin = (user: User): boolean => {
  return user.role === Role.Admin;
};

export const isUserModerator = (user: User): boolean => {
  return user.role === Role.Moderator;
};

export const hasRole = (user: User, role: Role): boolean => {
  return user.role === role;
};

export const isProductInWatchlist = (
  user: User,
  productId: string
): boolean => {
  return user.watchList.includes(productId);
};
