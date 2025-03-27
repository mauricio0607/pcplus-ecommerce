import { Request, Response } from "express";

// Tabela de preços por região
const SHIPPING_RATES = {
  // Regiões do Brasil
  norte: {
    base: 40,
    perKg: 2.5,
    freeShippingThreshold: 1500,
    estimatedDays: "7 a 12 dias úteis"
  },
  nordeste: {
    base: 35,
    perKg: 2.0,
    freeShippingThreshold: 1200,
    estimatedDays: "6 a 10 dias úteis"
  },
  centrooeste: {
    base: 30,
    perKg: 1.8,
    freeShippingThreshold: 1000,
    estimatedDays: "5 a 8 dias úteis"
  },
  sudeste: {
    base: 20,
    perKg: 1.2,
    freeShippingThreshold: 800,
    estimatedDays: "2 a 5 dias úteis"
  },
  sul: {
    base: 25,
    perKg: 1.5,
    freeShippingThreshold: 900,
    estimatedDays: "3 a 7 dias úteis"
  }
};

// Mapeia estados para regiões
const STATE_TO_REGION: Record<string, keyof typeof SHIPPING_RATES> = {
  // Norte
  AC: "norte",
  AM: "norte",
  AP: "norte",
  PA: "norte",
  RO: "norte",
  RR: "norte",
  TO: "norte",
  
  // Nordeste
  AL: "nordeste",
  BA: "nordeste",
  CE: "nordeste",
  MA: "nordeste",
  PB: "nordeste",
  PE: "nordeste",
  PI: "nordeste",
  RN: "nordeste",
  SE: "nordeste",
  
  // Centro-Oeste
  DF: "centrooeste",
  GO: "centrooeste",
  MT: "centrooeste",
  MS: "centrooeste",
  
  // Sudeste
  ES: "sudeste",
  MG: "sudeste",
  RJ: "sudeste",
  SP: "sudeste",
  
  // Sul
  PR: "sul",
  RS: "sul",
  SC: "sul"
};

// Dados de peso por produto (em kg)
const PRODUCT_WEIGHTS: Record<number, number> = {
  1: 2.5,  // Notebook Pro X
  2: 0.5,  // Mouse Gamer RGB
  3: 5.0,  // Monitor UltraWide 29"
  4: 1.2,  // Teclado Mecânico
  5: 1.5,  // Placa de Vídeo RTX 4060
  6: 0.2,  // SSD 1TB NVMe
  7: 10.0, // Desktop Gamer
  8: 0.3,  // Webcam HD
  9: 0.4,  // Headset 7.1 Surround
  10: 0.8  // Processador Intel i7
};

interface ShippingItem {
  productId: number;
  quantity: number;
}

interface ShippingRequest {
  items: ShippingItem[];
  postalCode: string;
  state: string;
  total?: number;
}

interface ShippingOption {
  name: string;
  price: number;
  estimatedDays: string;
}

export function calculateShipping(request: ShippingRequest): ShippingOption[] {
  const { items, state, total = 0 } = request;
  
  // Identifica a região com base no estado
  const region = STATE_TO_REGION[state.toUpperCase()] || "sudeste"; // Default para sudeste
  const rates = SHIPPING_RATES[region];
  
  // Calcula o peso total em kg
  const totalWeight = items.reduce((acc, item) => {
    const weight = PRODUCT_WEIGHTS[item.productId] || 1; // Default 1kg se não encontrar
    return acc + (weight * item.quantity);
  }, 0);
  
  // Verifica se é elegível para frete grátis
  const isFreeShipping = total >= rates.freeShippingThreshold;
  
  // Calcula o preço do frete padrão (entrega normal)
  const standardPrice = isFreeShipping ? 0 : rates.base + (totalWeight * rates.perKg);
  
  // Calcula o preço do frete expresso (70% mais caro que o padrão)
  const expressPrice = standardPrice * 1.7;
  
  // Calcula o preço do frete econômico (30% mais barato que o padrão)
  const economicPrice = isFreeShipping ? 0 : Math.max(rates.base * 0.7, standardPrice * 0.7);
  
  // Estima os dias de entrega
  const [minDays, maxDays] = rates.estimatedDays.split(" a ")[0].split(" ")[0].split(" a ");
  const minDaysNum = parseInt(minDays);
  const maxDaysNum = parseInt(maxDays);
  
  // Prepara as opções de frete
  const options: ShippingOption[] = [
    {
      name: "Entrega Econômica",
      price: economicPrice,
      estimatedDays: `${minDaysNum + 3} a ${maxDaysNum + 5} dias úteis`
    },
    {
      name: "Entrega Padrão",
      price: standardPrice,
      estimatedDays: rates.estimatedDays
    },
    {
      name: "Entrega Expressa",
      price: expressPrice,
      estimatedDays: `${Math.max(1, minDaysNum - 1)} a ${Math.max(3, maxDaysNum - 2)} dias úteis`
    }
  ];
  
  return options;
}

export function registerShippingRoutes(app: any) {
  app.post("/api/shipping/calculate", (req: Request, res: Response) => {
    const { items, postalCode, state, total } = req.body;
    
    // Validação básica
    if (!items || !items.length || !state) {
      return res.status(400).json({ 
        error: "Dados incompletos para cálculo de frete" 
      });
    }
    
    try {
      const options = calculateShipping({ items, postalCode, state, total });
      
      return res.status(200).json({
        options,
        region: STATE_TO_REGION[state.toUpperCase()] || "sudeste"
      });
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      return res.status(500).json({ 
        error: "Erro ao calcular opções de frete" 
      });
    }
  });
}