export const SHIPPING_METHODS = [
  { id: "economic", name: "Entrega Econômica", icon: "truck", price: 20, estimatedDays: "6 a 10 dias úteis" },
  { id: "standard", name: "Entrega Padrão", icon: "truck", price: 30, estimatedDays: "3 a 6 dias úteis" },
  { id: "express", name: "Entrega Expressa", icon: "zap", price: 50, estimatedDays: "1 a 2 dias úteis" }
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
  CREDIT_CARD: "credit_card",
  PIX: "pix",
  BOLETO: "boleto"
};

export const DEFAULT_ORDER_NUMBER = "87654321"; // Used when order creation fails