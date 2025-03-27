export const SHIPPING_METHODS = [
  {
    id: "express",
    name: "Entrega Expressa",
    price: 29.90,
    days: "até 3 dias úteis"
  },
  {
    id: "normal",
    name: "Entrega Normal",
    price: 19.90,
    days: "até 7 dias úteis"
  },
  {
    id: "economic",
    name: "Entrega Econômica",
    price: 9.90,
    days: "até 12 dias úteis"
  }
];

export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
];

export const PIX_DISCOUNT_PERCENTAGE = 5;

export const PAYMENT_METHODS = {
  PIX: "pix",
  CREDIT_CARD: "credit_card",
  BOLETO: "boleto"
};

export const DEFAULT_ORDER_NUMBER = "87654321"; // Used when order creation fails
