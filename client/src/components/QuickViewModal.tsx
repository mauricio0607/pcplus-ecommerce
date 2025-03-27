import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, RotateCw, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, ProductImage } from "@shared/schema";
import { useCart } from "@/context/CartContext";

// Interface estendida para o produto com informações necessárias para o modal
interface ExtendedProduct extends Product {
  images?: ProductImage[];
  specifications?: { name: string; value: string }[];
}

interface QuickViewModalProps {
  product: ExtendedProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens with a new product
  useEffect(() => {
    if (open && product) {
      setCurrentImageIndex(0);
      setRotation(0);
      setQuantity(1);
    }
  }, [open, product]);

  // Cleanup auto-rotation on unmount
  useEffect(() => {
    return () => {
      if (rotateIntervalRef.current) {
        clearInterval(rotateIntervalRef.current);
      }
    };
  }, []);

  if (!product) return null;

  // Preparar imagens para rotação 360
  // Normalmente, teríamos várias imagens para rotação 360 graus
  // Por enquanto, vamos simular isso com as imagens existentes ou imagem padrão
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: ProductImage) => img.imageUrl) 
    : [product.imageUrl || '/images/default-product.png'];

  // Se tivermos apenas uma imagem, vamos duplicá-la para simular múltiplas vistas
  const rotationImages = productImages.length < 4 
    ? [...productImages, ...productImages, ...productImages, ...productImages].slice(0, 8)
    : productImages;

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isRotating) return;
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isRotating) return;
    
    const currentX = e.clientX;
    const deltaX = currentX - startX;
    
    // Calcula o novo ângulo de rotação
    // Use um fator de sensibilidade para ajustar a velocidade de rotação
    const sensitivity = 0.5;
    const newRotation = rotation + (deltaX * sensitivity);
    
    setRotation(newRotation);
    setStartX(currentX);
    
    // Calcula o índice da imagem com base na rotação
    const totalImages = rotationImages.length;
    const anglePerImage = 360 / totalImages;
    
    // Normaliza a rotação para 0-360
    const normalizedRotation = ((newRotation % 360) + 360) % 360;
    
    // Calcula qual imagem deve ser mostrada com base no ângulo atual
    const newImageIndex = Math.floor(normalizedRotation / anglePerImage) % totalImages;
    setCurrentImageIndex(newImageIndex);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const toggle360Rotation = () => {
    if (isRotating) {
      // Parar rotação
      if (rotateIntervalRef.current) {
        clearInterval(rotateIntervalRef.current);
        rotateIntervalRef.current = null;
      }
      setIsRotating(false);
    } else {
      // Iniciar rotação
      setIsRotating(true);
      rotateIntervalRef.current = setInterval(() => {
        setRotation(prev => prev + 5);
        // Atualiza o índice da imagem a cada intervalo
        setCurrentImageIndex(prev => (prev + 1) % rotationImages.length);
      }, 100);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: productImages[0],
      quantity,
      description: product.description
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visualizador de imagens do produto */}
          <div className="relative">
            <div 
              ref={containerRef}
              className="aspect-square bg-neutral-50 rounded-md flex items-center justify-center overflow-hidden relative"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ touchAction: 'none' }}
            >
              <img 
                src={rotationImages[currentImageIndex]} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-all duration-300 ease-in-out"
              />
              
              {!isRotating && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/50 backdrop-blur-sm rounded-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('prev');
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/50 backdrop-blur-sm rounded-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('next');
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <Button 
                  variant={isRotating ? "default" : "outline"} 
                  size="sm" 
                  className="bg-white/70 backdrop-blur-sm" 
                  onClick={toggle360Rotation}
                >
                  <RotateCw className={`h-4 w-4 mr-2 ${isRotating ? "animate-spin" : ""}`} />
                  {isRotating ? "Parar rotação" : "Visualizar em 360°"}
                </Button>
              </div>
            </div>
            
            {/* Miniaturas */}
            {productImages.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto">
                {productImages.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      idx === currentImageIndex ? "border-primary" : "border-neutral-100"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Imagem ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Informações do produto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {`R$ ${Number(product.price).toFixed(2).replace('.', ',')}`}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {`R$ ${Number(product.oldPrice).toFixed(2).replace('.', ',')}`}
                </span>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-2">Quantidade</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(prev => Math.min(99, prev + 1))}
                  disabled={quantity >= (product.stock || 99)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Especificações</h3>
              <ul className="text-sm space-y-1">
                {product.specifications && product.specifications.map((spec: {name: string; value: string}, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-muted-foreground">{spec.name}:</span>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;