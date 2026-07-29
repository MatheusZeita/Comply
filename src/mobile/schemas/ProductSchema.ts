import { ProductCategories, SaleType } from "@/constants/enums/createProduct";
import { ProductCondition } from "@/constants/enums/createProduct";
import z from "zod/v3";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Titulo obrigatório.")
    .max(50, "O título deve conter no máximo 50 caracteres."),
  description: z
    .string()
    .min(1, "Descrição obrigatória.")
    .max(50, "A descrição deve conter no máximo 1000 caracteres."),
  locale: z.string().min(1, "Localizção obrigatória."),
  images: z
    .array(z.any())
    .min(1, "Imagem obrigatória.")
    .max(10, "Deve conter até 10 imagens."),
  condition: z.enum(ProductCondition, {
    required_error: "Condição do produto é obrigatória.",
  }),
  category: z.enum(ProductCategories, {
    required_error: "Categoria do produto é obrigatória.",
  }),
  characteristics: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .min(1, "Uma característica é obrigatória.")
    .max(10, "Deve conter no máximo 10 características."),
  deliveryPreference: z
    .string()
    .min(1, "A preferência de entrega é obrigatória."),
  saleType: z.enum(SaleType, {
    required_error: "É preciso escolher um método de anúncio.",
  }),
  buyPrice: z.coerce
    .number({
      invalid_type_error: "O valor deve ser um número.",
      required_error: "O valor de compra é obrigatório.",
    })
    .positive("Deve ser maior que zero."),
  startBidValue: z.coerce
    .number({
      invalid_type_error: "O valor inicial do lance deve ser um número.",
    })
    .positive("Deve ser maior que zero.")
    .optional(),
  startDate: z.date({
    required_error: "A data de início do leilão é obrigatória.",
  }),
  endDate: z.date({
    required_error: "A data de término do leilão é obrigatória.",
  }),
});
