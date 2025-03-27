import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./queryClient";

// Interface for the MercadoPago global object
declare global {
  interface Window {
    MercadoPago?: any;
  }
}

// Initialize MercadoPago SDK
export const initMercadoPago = () => {
  if (window.MercadoPago) {
    return window.MercadoPago;
  }
  return null;
};

// Create payment preference
export const createPreference = async (
  items: Array<{ id: number; name: string; price: string; quantity: number }>,
  buyer: {
    name: string;
    email: string;
    document: string;
  },
  orderId: number
) => {
  try {
    const baseUrl = window.location.origin;
    const backUrls = {
      success: `${baseUrl}/checkout/success`,
      failure: `${baseUrl}/checkout/failure`,
      pending: `${baseUrl}/checkout/pending`,
    };

    const response = await apiRequest(
      "POST",
      "/api/payment/preference",
      {
        items,
        buyer,
        backUrls,
        orderId,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error creating payment preference:", error);
    throw error;
  }
};

// Generate PIX payment
export const generatePixPayment = async (
  amount: number,
  buyer: {
    name: string;
    email: string;
    document: string;
  },
  description: string,
  orderId: number
) => {
  try {
    const response = await apiRequest(
      "POST",
      "/api/payment/pix",
      {
        amount,
        buyer,
        description,
        orderId,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error generating PIX payment:", error);
    throw error;
  }
};

// Copy PIX code to clipboard
export const copyToClipboard = (text: string) => {
  const { toast } = useToast();
  
  navigator.clipboard.writeText(text)
    .then(() => {
      toast({
        title: "Código PIX copiado!",
        description: "Cole o código no app do seu banco para pagar.",
      });
    })
    .catch((error) => {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Erro ao copiar código",
        description: "Tente selecionar o código manualmente e copiá-lo.",
        variant: "destructive",
      });
    });
};

// Format credit card information
export const formatCreditCardNumber = (value: string) => {
  if (!value) return value;
  
  const input = value.replace(/\D/g, '');
  const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  return formatted.substring(0, 19);
};

export const formatExpiryDate = (value: string) => {
  if (!value) return value;
  
  const input = value.replace(/\D/g, '');
  
  if (input.length > 2) {
    return `${input.substring(0, 2)}/${input.substring(2, 4)}`;
  }
  
  return input;
};

export const formatCVV = (value: string) => {
  if (!value) return value;
  
  return value.replace(/\D/g, '').substring(0, 4);
};
