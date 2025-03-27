import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [, navigate] = useLocation();

  const proceedToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(getCartTotal());

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Carrinho de Compras</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Fechar carrinho"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <Button 
                onClick={onClose} 
                className="bg-primary hover:bg-primary/90"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex border-b border-gray-200 py-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <button 
                        className="w-6 h-6 bg-neutral-50 rounded-full flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        className="w-6 h-6 bg-neutral-50 rounded-full flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(parseFloat(item.price) * item.quantity)}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-primary hover:underline text-sm flex items-center mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">{formattedTotal}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Frete</span>
              <span className="font-semibold">R$ 0,00</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-primary">{formattedTotal}</span>
            </div>
            <Button 
              onClick={proceedToCheckout}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition"
            >
              Finalizar Compra
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full py-3 mt-2 border border-primary text-primary hover:bg-neutral-50 font-semibold rounded-md transition"
            >
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
