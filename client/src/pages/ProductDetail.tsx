import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";

type ProductResponse = Product & { images: ProductImage[] };

export default function ProductDetail() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addToCart, toggleCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductResponse>({
    queryKey: [`/api/products/slug/${slug}`],
    enabled: !!slug,
  });

  const {
    data: similarProducts,
    isLoading: loadingSimilar,
  } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    select: (data) => data.filter(p => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 4),
    enabled: !!product,
  });

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      quantity,
      imageUrl: product.imageUrl,
      description: product.description.substring(0, 50) + "...",
    });

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-40 mb-4"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/5">
              <div className="bg-gray-200 h-96 w-full rounded-lg"></div>
            </div>
            <div className="lg:w-3/5">
              <div className="h-10 bg-gray-200 w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 w-1/2 mb-6"></div>
              <div className="h-24 bg-gray-200 w-full mb-6"></div>
              <div className="h-40 bg-gray-200 w-full mb-6"></div>
              <div className="h-12 bg-gray-200 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <p className="mb-8">O produto que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
          Voltar para a loja
        </Button>
      </div>
    );
  }

  const mainImageUrl = selectedImage || product.imageUrl;
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

  // Parse specs from string to array
  const specs = product.specs.split('\n').filter(spec => spec.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a loja
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-2/5">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <img src={mainImageUrl} alt={product.name} className="w-full h-auto rounded-md" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={image.id}
                className={`bg-white p-2 rounded-lg shadow-md cursor-pointer ${
                  mainImageUrl === image.imageUrl ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <img src={image.imageUrl} alt={`${product.name} - Imagem ${index + 1}`} className="w-full h-16 object-cover rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-3/5">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = parseFloat(product.rating?.toString() || "0");
                const filled = i < Math.floor(rating);
                const halfFilled = !filled && i < Math.ceil(rating) && rating % 1 !== 0;
                
                return halfFilled ? (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <defs>
                      <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="url(#half)" />
                  </svg>
                ) : (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={filled ? "currentColor" : "#E5E7EB"}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-sm text-gray-500 ml-1">({product.reviewCount} avaliações)</span>
            <span className="text-sm text-gray-500 ml-3">Código: {product.sku}</span>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            {product.oldPrice && (
              <div className="flex items-center">
                <span className="text-gray-500 line-through text-lg">{formattedOldPrice}</span>
                <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">-{product.discountPercentage}%</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary font-bold text-3xl">{formattedPrice}</p>
                <p className="text-gray-600 text-sm">à vista no PIX com 5% de desconto</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                {product.stock > 0 ? 'Em estoque' : 'Sem estoque'}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              ou 10x de {(parseFloat(product.price.toString()) / 10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Especificações</h3>
            <ul className="text-gray-600 space-y-1">
              {specs.map((spec, index) => {
                const [key, value] = spec.split(':').map(s => s.trim());
                return (
                  <li key={index}>
                    <span className="font-medium">{key}:</span> {value}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex items-center border border-gray-300 rounded-md mr-4">
              <button 
                className="px-3 py-1 text-xl"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button 
                className="px-3 py-1 text-xl"
                onClick={() => setQuantity(q => q + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {product.stock} unidades disponíveis
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Adicionar ao Carrinho
            </Button>
            <Button onClick={handleBuyNow} className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Comprar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Produtos Similares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingSimilar ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 p-4 rounded-lg h-80"></div>
            ))
          ) : (
            similarProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
