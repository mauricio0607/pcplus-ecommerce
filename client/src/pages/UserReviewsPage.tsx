import { useQuery } from "@tanstack/react-query";
import { Review } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Star, StarHalf } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type ReviewWithProduct = Review & {
  product: {
    id: number;
    name: string;
    imageUrl: string;
  } | null;
};

export default function UserReviewsPage() {
  const { user } = useAuth();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery<ReviewWithProduct[]>({
    queryKey: ["/api/user/reviews"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-600">Erro ao carregar suas avaliações. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Minhas Avaliações</h1>

      {reviews?.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium mb-2">Você ainda não avaliou nenhum produto</h3>
          <p className="text-gray-600 mb-4">Depois de comprar e receber um produto, você poderá avaliá-lo.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/">Continuar comprando</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews?.map((review) => (
            <div key={review.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 bg-white">
                <div className="flex items-start">
                  {review.product?.imageUrl && (
                    <Link href={`/product/${review.productId}`}>
                      <img 
                        src={review.product.imageUrl} 
                        alt={review.product?.name || "Produto"} 
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                    </Link>
                  )}
                  <div className="flex-grow">
                    <Link href={`/product/${review.productId}`}>
                      <h3 className="font-semibold text-lg hover:text-primary">
                        {review.product?.name || "Produto"}
                      </h3>
                    </Link>
                    <div className="flex text-yellow-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const filled = i < review.rating;
                        const halfFilled = i + 0.5 === review.rating;
                        
                        if (halfFilled) {
                          return <StarHalf key={i} className="h-5 w-5" />;
                        }
                        
                        return <Star key={i} className={`h-5 w-5 ${filled ? "fill-current" : "fill-none"}`} />;
                      })}
                      <span className="text-gray-600 text-sm ml-2">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium">{review.title || "Sem título"}</h4>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Avaliado em {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}