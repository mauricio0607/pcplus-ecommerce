import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Loader2, 
  SaveIcon,
  Star
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações pessoais foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    
    setTimeout(() => {
      setIsChangingPassword(false);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
    }, 1000);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Você precisa estar logado para acessar esta página.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>
      
      <Tabs defaultValue="personal">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64 flex-shrink-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-6 pt-2">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                <TabsTrigger value="personal" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Meus Pedidos
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Lista de Desejos
                </TabsTrigger>
                <TabsTrigger value="reviews" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Minhas Avaliações
                </TabsTrigger>
                <TabsTrigger value="addresses" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <TabsContent value="personal">
              <Card>
                <form onSubmit={handlePersonalInfoSubmit}>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" defaultValue={user.name} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Data de Nascimento</Label>
                        <Input id="dob" type="date" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document">CPF</Label>
                      <Input id="document" placeholder="000.000.000-00" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Salvando...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="mr-2 h-4 w-4" /> 
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>
                    Visualize o histórico e status dos seus pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-primary font-medium">#87234</td>
                          <td className="px-6 py-4 whitespace-nowrap">23/03/2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">R$ 1.234,56</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Entregue
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Ver detalhes</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-primary font-medium">#87233</td>
                          <td className="px-6 py-4 whitespace-nowrap">23/03/2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">R$ 2.345,67</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Em trânsito
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Ver detalhes</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Desejos</CardTitle>
                  <CardDescription>
                    Itens que você salvou para comprar mais tarde
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                          <img 
                            src="https://via.placeholder.com/300" 
                            alt="Produto"
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <h3 className="font-medium mb-1">Notebook Pro X</h3>
                        <p className="text-lg font-bold text-primary">R$ 2.999</p>
                        <div className="flex space-x-2 mt-3">
                          <Button className="flex-1" size="sm">Comprar</Button>
                          <Button variant="outline" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                          <img 
                            src="https://via.placeholder.com/300" 
                            alt="Produto"
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <h3 className="font-medium mb-1">Monitor UltraWide 29"</h3>
                        <p className="text-lg font-bold text-primary">R$ 1.589</p>
                        <div className="flex space-x-2 mt-3">
                          <Button className="flex-1" size="sm">Comprar</Button>
                          <Button variant="outline" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Avaliações</CardTitle>
                  <CardDescription>
                    Avaliações que você fez dos produtos comprados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const { data: reviews = [], isLoading, error } = useQuery<any[]>({
                      queryKey: ["/api/user/reviews"],
                      enabled: !!user,
                    });

                    if (isLoading) {
                      return (
                        <div className="flex justify-center p-6">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      );
                    }

                    if (error) {
                      return (
                        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                          <p className="text-red-600">Erro ao carregar suas avaliações. Por favor, tente novamente mais tarde.</p>
                        </div>
                      );
                    }

                    if (reviews.length === 0) {
                      return (
                        <div className="p-8 text-center border rounded-lg bg-gray-50">
                          <h3 className="text-lg font-medium mb-2">Você ainda não avaliou nenhum produto</h3>
                          <p className="text-gray-600 mb-4">Depois de comprar e receber um produto, você poderá avaliá-lo.</p>
                          <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link to="/">Continuar comprando</Link>
                          </Button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {reviews.map((review: any) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start pt-2">
                                {review.product?.imageUrl && (
                                  <Link to={`/product/${review.productId}`}>
                                    <img 
                                      src={review.product.imageUrl} 
                                      alt={review.product?.name || "Produto"} 
                                      className="w-20 h-20 object-cover rounded-md mr-4"
                                    />
                                  </Link>
                                )}
                                <div className="flex-grow">
                                  <Link to={`/product/${review.productId}`}>
                                    <h3 className="font-semibold text-lg hover:text-primary">
                                      {review.product?.name || "Produto"}
                                    </h3>
                                  </Link>
                                  <div className="flex text-yellow-400 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < review.rating ? "fill-current" : "fill-none"}`} 
                                      />
                                    ))}
                                    <span className="text-gray-600 text-sm ml-2">{review.rating}/5</span>
                                  </div>
                                  
                                  <h4 className="font-medium mt-2">{review.title || "Sem título"}</h4>
                                  <p className="text-gray-600 mt-1">{review.comment}</p>
                                  <p className="text-sm text-gray-400 mt-2">
                                    Avaliado em {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/user-reviews'}
                  >
                    <Star className="mr-2 h-4 w-4" /> 
                    Ver todas as avaliações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Endereços</CardTitle>
                  <CardDescription>
                    Gerencie seus endereços de entrega
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2 border-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Casa</div>
                          <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Principal</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>João Silva</p>
                          <p>Rua Exemplo, 123</p>
                          <p>Bairro Centro</p>
                          <p>São Paulo - SP</p>
                          <p>CEP: 01234-567</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">Editar</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="font-medium mb-2">Trabalho</div>
                        <div className="text-sm text-muted-foreground">
                          <p>João Silva</p>
                          <p>Av. Comercial, 456, Sala 789</p>
                          <p>Bairro Empresarial</p>
                          <p>São Paulo - SP</p>
                          <p>CEP: 04567-890</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">Editar</Button>
                          <Button variant="outline" size="sm">Definir como principal</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <MapPin className="mr-2 h-4 w-4" /> 
                    Adicionar Novo Endereço
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <form onSubmit={handlePasswordSubmit}>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Altere sua senha e gerencie a segurança da conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input id="confirm-password" type="password" required />
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Requisitos de senha:</p>
                      <ul className="list-disc pl-5">
                        <li>Mínimo de 8 caracteres</li>
                        <li>Pelo menos uma letra maiúscula</li>
                        <li>Pelo menos um número</li>
                        <li>Pelo menos um caractere especial</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Alterando...
                        </>
                      ) : (
                        "Alterar Senha"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificações</CardTitle>
                  <CardDescription>
                    Gerencie como você recebe notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificações via Email</h3>
                        <p className="text-sm text-muted-foreground">Receba emails sobre pedidos, promoções, etc.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Atualizações de Pedidos</h3>
                        <p className="text-sm text-muted-foreground">Receba notificações sobre o status dos seus pedidos</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="order-updates"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Promoções e Descontos</h3>
                        <p className="text-sm text-muted-foreground">Receba ofertas exclusivas e descontos</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="promotions"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">Receba nossa newsletter com novidades</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="newsletter"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Salvar Preferências</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}