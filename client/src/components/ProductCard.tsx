import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { Product } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      quantity: 1,
      imageUrl: product.imageUrl,
      description: product.description.substring(0, 50) + "...",
    });

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const formattedPrice = parseFloat(product.price.toString()).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const formattedOldPrice = product.oldPrice 
    ? parseFloat(product.oldPrice.toString()).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    : null;

  const installmentPrice = (parseFloat(product.price.toString()) / 10).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <Link href={`/product/${product.slug}`}>
      <a 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {product.discountPercentage && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discountPercentage}%
            </span>
          )}
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={(e) => e.preventDefault()}
              className="bg-white text-primary py-2 px-4 rounded-md font-medium mx-1 hover:bg-primary hover:text-white transition"
            >
              Ver Detalhes
            </button>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white py-2 px-4 rounded-md font-medium mx-1 hover:bg-primary/90 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Adicionar
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description.substring(0, 50)}...</p>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = parseFloat(product.rating?.toString() || "0");
                const filled = i < Math.floor(rating);
                const halfFilled = !filled && i < Math.ceil(rating) && rating % 1 !== 0;
                
                return (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={filled ? "currentColor" : (halfFilled ? "url(#half)" : "#E5E7EB")}>
                    {halfFilled && (
                      <defs>
                        <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="50%" stopColor="currentColor" />
                          <stop offset="50%" stopColor="#E5E7EB" />
                        </linearGradient>
                      </defs>
                    )}
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {formattedOldPrice && (
                <span className="text-gray-500 line-through text-sm">{formattedOldPrice}</span>
              )}
              <p className="text-primary font-bold text-xl">{formattedPrice}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              10x sem juros
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
