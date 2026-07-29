interface NotificationMock {
  id: string;
  lines: string[]; // múltiplas linhas para mensagem
  date: string; // use ISO ("2025-11-21T18:33:00") para facilitar tempo relativo
  type: "product" | "auction";
  read: boolean;
}

export const MOCK_NOTIFICATIONS: NotificationMock[] = [
  {
    id: "1",
    lines: ["Seu produto foi vendido!", "Valor final: R$1.590"],
    type: "product",
    read: false,
    date: "2025-11-24T16:00:00",
  },
  {
    id: "2",
    lines: [
      "Um novo lance foi feito em seu produto!",
      "Atualmente está em R$1040",
    ],
    type: "product",
    read: false,
    date: "2025-11-24T14:41:00",
  },
  {
    id: "3",
    lines: ["Seu lance foi superado no leilão!", "Produto: Tênis Nike Ultra"],
    type: "auction",
    read: true,
    date: "2025-11-23T21:20:00",
  },
  {
    id: "4",
    lines: ["O leilão já vai iniciar.", "Acompanhe e dê seu lance!"],
    type: "auction",
    read: false,
    date: "2025-11-24T13:00:00",
  },
  {
    id: "5",
    lines: ["Você venceu o leilão!", "Aguarde instruções para pagamento."],
    type: "auction",
    read: true,
    date: "2025-11-23T22:00:00",
  },
];
