import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, StarHalf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipos
type ReviewWithUser = Review & {
  user: {
    id: number;
    name: string;
  } | null;
};

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState<string>("5");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  // Buscar as avaliações do produto
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery<ReviewWithUser[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  // Verificar se o usuário pode avaliar o produto
  const { data: canReview } = useQuery<boolean>({
    queryKey: [`/api/products/${productId}/can-review`],
    enabled: !!productId && !!user,
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/products/${productId}/can-review`);
        return await res.json();
      } catch (error) {
        return false;
      }
    },
  });

  // Mutation para enviar uma avaliação
  const reviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; title: string; comment: string }) => {
      const res = await apiRequest("POST", `/api/products/${productId}/reviews`, reviewData);
      return await res.json();
    },
    onSuccess: () => {
      // Após sucesso, fechar o diálogo, limpar os campos e atualizar os dados
      setReviewDialogOpen(false);
      setRating("5");
      setTitle("");
      setComment("");
      
      // Invalidar as consultas para recarregar os dados
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/can-review`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/slug/`] });
      
      toast({
        title: "Avaliação enviada",
        description: "Obrigado por compartilhar sua opinião!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!rating || !title || !comment) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos da avaliação.",
        variant: "destructive",
      });
      return;
    }

    reviewMutation.mutate({
      rating: parseInt(rating),
      title,
      comment,
    });
  };

  // Renderização dos estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-40 mb-4"></div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <div className="h-6 bg-gray-200 w-40"></div>
              </div>
              <div className="h-4 bg-gray-200 w-full mb-4"></div>
              <div className="h-16 bg-gray-200 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro ao carregar as avaliações. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Avaliações ({reviews?.length || 0})</h2>
        {user && canReview && (
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">Avaliar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Avalie este produto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Avaliação</Label>
                  <Select 
                    value={rating} 
                    onValueChange={setRating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma nota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 estrelas - Excelente</SelectItem>
                      <SelectItem value="4">4 estrelas - Muito bom</SelectItem>
                      <SelectItem value="3">3 estrelas - Bom</SelectItem>
                      <SelectItem value="2">2 estrelas - Regular</SelectItem>
                      <SelectItem value="1">1 estrela - Ruim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da avaliação</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Ótimo produto, recomendo!"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comentário</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Compartilhe sua experiência com este produto..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSubmitReview}
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews?.length === 0 ? (
        <div className="p-6 text-center border rounded-lg bg-gray-50">
          <p className="text-gray-600">Este produto ainda não possui avaliações.</p>
          {user && canReview && (
            <p className="mt-2 text-gray-600">
              Seja o primeiro a avaliar!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg">
              <div className="flex items-center mb-1">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < review.rating;
                    const halfFilled = i + 0.5 === review.rating;
                    
                    if (halfFilled) {
                      return <StarHalf key={i} className="h-5 w-5" />;
                    }
                    
                    return <Star key={i} className={`h-5 w-5 ${filled ? "fill-current" : "fill-none"}`} />;
                  })}
                </div>
                <span className="text-gray-600 text-sm ml-2">{review.rating}/5</span>
              </div>
              
              <h3 className="font-semibold">{review.title || "Sem título"}</h3>
              <p className="text-gray-600 mt-1">{review.comment}</p>
              
              <div className="mt-2 text-sm text-gray-400 flex items-center justify-between">
                <span>Por {review.user?.name || "Usuário"}</span>
                <span>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}