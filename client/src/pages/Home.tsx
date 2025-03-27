import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Get categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery<Category[]>({ 
    queryKey: ['/api/categories'],
  });

  // Get featured products
  const {
    data: featuredProducts,
    isLoading: productsLoading,
    error: productsError
  } = useQuery<Product[]>({ 
    queryKey: ['/api/products/featured'],
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição realizada!",
      description: "Você agora receberá nossas ofertas por email.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="pb-16">
      {/* Hero Banner */}
      <section className="relative bg-neutral-50 overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Tecnologia de ponta para você</h1>
            <p className="text-lg mb-8">Encontre os melhores produtos de informática com os melhores preços e condições de pagamento.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Ver Ofertas
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-neutral-50">
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1603302576837-37561b2e2302" 
              alt="Notebook moderno" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 p-4 rounded-lg h-32"></div>
            ))
          ) : categoriesError ? (
            <p className="col-span-full text-center text-red-500">Erro ao carregar categorias</p>
          ) : (
            categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Ofertas em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 p-4 rounded-lg h-80"></div>
            ))
          ) : productsError ? (
            <p className="col-span-full text-center text-red-500">Erro ao carregar produtos</p>
          ) : (
            featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-neutral-50">
            Ver Mais Produtos
          </Button>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">Por que escolher a TechStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Enviamos seu pedido no mesmo dia para compras realizadas até as 15h.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Compra Segura</h3>
              <p className="text-gray-600">Seus dados estão protegidos e processados em ambiente seguro.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Diversas Formas de Pagamento</h3>
              <p className="text-gray-600">Pague com cartão, boleto ou PIX com o MercadoPago.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-10 text-center">O que nossos clientes dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">"Entrega super rápida e produtos de qualidade. O notebook que comprei superou minhas expectativas e o atendimento foi excelente!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary font-semibold">AM</span>
              </div>
              <div>
                <h4 className="font-medium">Ana Maria</h4>
                <p className="text-xs text-gray-500">Cliente desde 2022</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(4)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className="text-gray-300" />
                </svg>
            </div>
            <p className="text-gray-600 mb-4">"Ótimos preços e promoções frequentes. Já comprei vários itens e recomendo a todos que precisam de produtos de informática confiáveis."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary font-semibold">JS</span>
              </div>
              <div>
                <h4 className="font-medium">João Silva</h4>
                <p className="text-xs text-gray-500">Cliente desde 2021</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">"O pagamento via PIX foi super prático e recebi um desconto adicional! Tive um pequeno problema com um produto e o suporte resolveu rapidamente."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary font-semibold">CP</span>
              </div>
              <div>
                <h4 className="font-medium">Carlos Pereira</h4>
                <p className="text-xs text-gray-500">Cliente desde 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Receba nossas ofertas</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">Cadastre-se para receber promoções exclusivas, novidades e descontos especiais diretamente no seu e-mail.</p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2" onSubmit={handleSubscribe}>
            <Input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-1 px-4 py-3 bg-white" 
              required
            />
            <Button type="submit" variant="secondary" className="py-3 px-6 bg-white text-primary hover:bg-gray-100 font-semibold">
              Cadastrar
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
