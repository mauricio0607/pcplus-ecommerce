import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Tipo para itens da lista de desejos
interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  addedAt: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    oldPrice: string | null;
    rating: string;
    imageUrl: string;
    stock: number;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  // Buscar itens da lista de desejos
  const { data: wishlistItems, isLoading, error } = useQuery<WishlistItem[]>({
    queryKey: ["/api/user/wishlist"],
    enabled: !!user,
  });

  // Remover da lista de desejos
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/user/wishlist/${productId}`);
    },
    onMutate: (productId) => {
      setRemovingIds(prev => [...prev, productId]);
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/wishlist"] });
      toast({
        title: "Item removido",
        description: "O produto foi removido da sua lista de desejos",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover item",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: (_, __, productId) => {
      setRemovingIds(prev => prev.filter(id => id !== productId));
    },
  });

  // Limpar itens sendo removidos ao desmontar o componente
  useEffect(() => {
    return () => {
      setRemovingIds([]);
    };
  }, []);

  // Função para adicionar produto ao carrinho
  const handleAddToCart = (product: WishlistItem["product"]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  // Função para remover da lista de desejos
  const handleRemoveFromWishlist = (productId: number) => {
    removeMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Lista de Desejos | PC+</title>
        </Helmet>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Minha Lista de Desejos</h1>
          
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <Skeleton className="h-20 w-20 rounded-md mr-4" />
                <div className="flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Lista de Desejos | PC+</title>
        </Helmet>
        
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Minha Lista de Desejos</h1>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-red-600 mb-4">Ocorreu um erro ao carregar sua lista de desejos.</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/user/wishlist"] })}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Lista de Desejos | PC+</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Minha Lista de Desejos</h1>
        <p className="text-gray-600 mb-6">Aqui você encontra os produtos que você salvou para comprar depois.</p>
        
        {wishlistItems && wishlistItems.length > 0 ? (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity ${
                  removingIds.includes(item.productId) ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="p-4 flex flex-col sm:flex-row items-center">
                  <div className="sm:w-20 sm:h-20 w-full h-40 mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </Link>
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-medium hover:text-primary cursor-pointer">{item.product.name}</h3>
                    </Link>
                    
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0">
                      <div className="flex items-center justify-center sm:justify-start">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`w-4 h-4 ${parseFloat(item.product.rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-500">({item.product.rating})</span>
                      </div>
                      
                      <span className="hidden sm:block mx-2 text-gray-300">•</span>
                      
                      {item.product.stock > 0 ? (
                        <span className="text-green-600 text-sm">Em estoque</span>
                      ) : (
                        <span className="text-red-600 text-sm">Fora de estoque</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                    <div className="flex items-center mb-2">
                      {item.product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm mr-2">
                          R$ {parseFloat(item.product.oldPrice).toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <span className="font-bold text-lg text-primary">
                        R$ {parseFloat(item.product.price).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product.stock <= 0 || removingIds.includes(item.productId)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Comprar</span>
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                        disabled={removingIds.includes(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <X className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Sua lista de desejos está vazia</h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos à sua lista de desejos para encontrá-los facilmente mais tarde.
            </p>
            <Link href="/">
              <Button>
                Continuar Comprando
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}