"use client";
import { vars } from "nativewind";

export const config = {
  light: vars({
    /* PRIMARY (Emerald Tailwind base, 700 como base real) */
    "--color-primary-50": "236 253 245",
    "--color-primary-100": "209 250 229",
    "--color-primary-200": "167 243 208",
    "--color-primary-300": "110 231 183",
    "--color-primary-400": "52 211 153",
    "--color-primary-500": "4 120 87", // BASE PRINCIPAL (emerald-700)
    "--color-primary-600": "6 95 70",
    "--color-primary-700": "5 150 105", // ajustado pra não perder o tom progressivo
    "--color-primary-800": "16 185 129",
    "--color-primary-900": "52 211 153",
    "--color-primary-950": "110 231 183",

    /* BACKGROUND */
    "--color-background-0": "255 255 255",
    "--color-background-50": "250 250 250",
    "--color-background-100": "245 245 245",
    "--color-background-200": "229 229 229",
    "--color-background-300": "212 212 212",
    "--color-background-400": "163 163 163",
    "--color-background-500": "115 115 115",
    "--color-background-600": "82 82 82",
    "--color-background-700": "64 64 64",
    "--color-background-800": "38 38 38",
    "--color-background-900": "23 23 23",
    "--color-background-950": "10 10 10",

    /* TEXT */
    "--color-typography-50": "250 250 250",
    "--color-typography-100": "245 245 245",
    "--color-typography-200": "229 229 229",
    "--color-typography-300": "212 212 212",
    "--color-typography-400": "163 163 163",
    "--color-typography-500": "115 115 115",
    "--color-typography-600": "82 82 82",
    "--color-typography-700": "64 64 64",
    "--color-typography-800": "38 38 38",
    "--color-typography-900": "23 23 23",

    /* FEEDBACK */
    "--color-success-500": "34 197 94",
    "--color-error-500": "239 68 68",
    "--color-warning-500": "245 158 11",
    "--color-info-500": "59 130 246",
  }),

  dark: vars({
    /* PRIMARY (inverted, ainda com 700 como base) */
    "--color-primary-50": "2 44 34",
    "--color-primary-100": "6 78 59",
    "--color-primary-200": "6 95 70",
    "--color-primary-300": "4 120 87",
    "--color-primary-400": "5 150 105",
    "--color-primary-500": "4 120 87", // mantém o mesmo tom base
    "--color-primary-600": "16 185 129",
    "--color-primary-700": "52 211 153",
    "--color-primary-800": "110 231 183",
    "--color-primary-900": "167 243 208",
    "--color-primary-950": "236 253 245",

    /* BACKGROUND */
    "--color-background-0": "10 10 10",
    "--color-background-50": "23 23 23",
    "--color-background-100": "38 38 38",
    "--color-background-200": "64 64 64",
    "--color-background-300": "82 82 82",
    "--color-background-400": "115 115 115",
    "--color-background-500": "163 163 163",
    "--color-background-600": "212 212 212",
    "--color-background-700": "229 229 229",
    "--color-background-800": "245 245 245",
    "--color-background-900": "250 250 250",
    "--color-background-950": "255 255 255",

    /* TEXT */
    "--color-typography-50": "23 23 23",
    "--color-typography-100": "38 38 38",
    "--color-typography-200": "64 64 64",
    "--color-typography-300": "82 82 82",
    "--color-typography-400": "115 115 115",
    "--color-typography-500": "140 140 140",
    "--color-typography-600": "163 163 163",
    "--color-typography-700": "212 212 212",
    "--color-typography-800": "229 229 229",
    "--color-typography-900": "245 245 245",

    /* FEEDBACK */
    "--color-success-500": "34 197 94",
    "--color-error-500": "239 68 68",
    "--color-warning-500": "245 158 11",
    "--color-info-500": "59 130 246",
  }),
};
