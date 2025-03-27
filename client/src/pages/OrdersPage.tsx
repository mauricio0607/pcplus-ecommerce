import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package2,
  Search,
  ShoppingBag,
  ExternalLink,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";

// Tipos para pedidos
interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string | null;
  shippingMethod: string;
  shippingPrice: string;
  total: string;
  createdAt: string;
  trackingCode: string | null;
  trackingUrl: string | null;
  items: OrderItem[];
  address: {
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Buscar pedidos do usuário
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["/api/user/orders"],
    enabled: !!user,
  });

  // Filtrar e ordenar pedidos
  const filteredOrders = orders
    ? orders
        .filter((order) => {
          // Filtrar por status
          if (statusFilter !== "all" && order.status !== statusFilter) {
            return false;
          }

          // Filtrar por busca (número do pedido)
          if (
            searchQuery &&
            !order.id.toString().includes(searchQuery) &&
            !order.items.some((item) =>
              item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          // Ordenar por data (mais recente primeiro)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
    : [];

  // Mapear status para exibição formatada
  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; icon: React.ReactNode }
    > = {
      pending: {
        label: "Aguardando Pagamento",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <FileText className="h-4 w-4 mr-1" />,
      },
      processing: {
        label: "Em Processamento",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Package2 className="h-4 w-4 mr-1" />,
      },
      shipped: {
        label: "Enviado",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <ShoppingBag className="h-4 w-4 mr-1" />,
      },
      delivered: {
        label: "Entregue",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <Package2 className="h-4 w-4 mr-1" />,
      },
      cancelled: {
        label: "Cancelado",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <Package2 className="h-4 w-4 mr-1" />,
      },
      refunded: {
        label: "Reembolsado",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Package2 className="h-4 w-4 mr-1" />,
      },
    };

    return (
      statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Package2 className="h-4 w-4 mr-1" />,
      }
    );
  };

  // Formatação de datas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Formatação de preços
  const formatPrice = (priceString: string) => {
    return `R$ ${parseFloat(priceString).toFixed(2).replace(".", ",")}`;
  };

  // Conteúdo de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Meus Pedidos | PC+</title>
        </Helmet>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mensagem de erro
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Meus Pedidos | PC+</title>
        </Helmet>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-red-600 mb-4">
              Ocorreu um erro ao carregar seus pedidos.
            </p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["/api/user/orders"] })
              }
            >
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
        <title>Meus Pedidos | PC+</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
        <p className="text-gray-600 mb-6">
          Acompanhe o status e o histórico dos seus pedidos.
        </p>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pedidos</SelectItem>
                  <SelectItem value="pending">Aguardando Pagamento</SelectItem>
                  <SelectItem value="processing">Em Processamento</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por número de pedido ou produto..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const total = parseFloat(order.total) + parseFloat(order.shippingPrice);

                return (
                  <AccordionItem
                    key={order.id}
                    value={`order-${order.id}`}
                    className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-left">
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold">Pedido #{order.id}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <Badge
                              className={`${statusInfo.color} flex items-center`}
                              variant="outline"
                            >
                              {statusInfo.icon}
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0 text-right">
                          <div className="font-medium">{formatPrice(total.toString())}</div>
                          <div className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {/* Detalhes do pedido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Informações do Pedido</h3>
                            <dl className="space-y-1 text-sm">
                              <div className="flex">
                                <dt className="w-1/2 text-gray-500">Data:</dt>
                                <dd>{formatDate(order.createdAt)}</dd>
                              </div>
                              <div className="flex">
                                <dt className="w-1/2 text-gray-500">Status do Pedido:</dt>
                                <dd>
                                  <Badge
                                    className={statusInfo.color}
                                    variant="outline"
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </dd>
                              </div>
                              <div className="flex">
                                <dt className="w-1/2 text-gray-500">Forma de Pagamento:</dt>
                                <dd className="capitalize">{order.paymentMethod}</dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                            <address className="not-italic text-sm">
                              {order.address.street}, {order.address.number}
                              {order.address.complement && `, ${order.address.complement}`}<br />
                              {order.address.neighborhood}, {order.address.city} - {order.address.state}<br />
                              CEP: {order.address.zipCode}<br />
                            </address>
                          </div>
                        </div>
                        
                        {/* Rastreamento */}
                        {order.trackingCode && (
                          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-blue-800">Informações de Rastreamento</h3>
                                <p className="text-sm text-blue-700 mt-1">Código: {order.trackingCode}</p>
                              </div>
                              {order.trackingUrl && (
                                <a
                                  href={order.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  Rastrear Pedido
                                  <ExternalLink className="ml-1 h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Produtos */}
                        <div>
                          <h3 className="font-medium mb-3">Produtos</h3>
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Produto</TableHead>
                                  <TableHead className="text-center">Qtd</TableHead>
                                  <TableHead className="text-center">Preço</TableHead>
                                  <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 mr-3 flex-shrink-0">
                                          <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                        <Link href={`/product/${item.product.slug}`}>
                                          <span className="hover:text-primary cursor-pointer">
                                            {item.product.name}
                                          </span>
                                        </Link>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-center">{formatPrice(item.price)}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        
                        {/* Resumo */}
                        <div className="flex justify-end">
                          <div className="w-full md:w-64">
                            <div className="text-sm space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Frete:</span>
                                <span>{formatPrice(order.shippingPrice)}</span>
                              </div>
                              <div className="flex justify-between font-medium pt-2 border-t">
                                <span>Total:</span>
                                <span>{formatPrice(total.toString())}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ações */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href="/support">
                                <span className="flex items-center">
                                  Precisa de ajuda?
                                </span>
                              </Link>
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/product/${order.items[0]?.product.slug}?review=true`}>
                                  <span className="flex items-center">
                                    Avaliar
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                  </span>
                                </Link>
                              </Button>
                            )}
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                            >
                              <Link href="/">
                                <span className="flex items-center">
                                  Comprar Novamente
                                  <ShoppingBag className="ml-1 h-4 w-4" />
                                </span>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            {searchQuery || statusFilter !== "all" ? (
              <>
                <h2 className="text-xl font-medium mb-2">Nenhum pedido encontrado</h2>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros para encontrar seus pedidos.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  Limpar Filtros
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium mb-2">Você ainda não realizou nenhum pedido</h2>
                <p className="text-gray-600 mb-6">
                  Quando você realizar um pedido, ele aparecerá aqui para acompanhamento.
                </p>
                <Link href="/">
                  <Button>
                    Começar a Comprar
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}