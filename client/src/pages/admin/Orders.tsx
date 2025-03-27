import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Eye, 
  Truck, 
  MoreVertical,
  Loader2
} from "lucide-react";

const mockOrders = [
  {
    id: 87234,
    customer: "João Silva",
    date: "23/03/2023",
    items: 3,
    total: "R$ 1.234,56",
    paymentMethod: "Cartão de Crédito",
    status: "Entregue"
  },
  {
    id: 87233,
    customer: "Maria Santos",
    date: "23/03/2023",
    items: 2,
    total: "R$ 2.345,67",
    paymentMethod: "PIX",
    status: "Em trânsito"
  },
  {
    id: 87232,
    customer: "Pedro Oliveira",
    date: "22/03/2023",
    items: 1,
    total: "R$ 345,78",
    paymentMethod: "Boleto",
    status: "Processando"
  },
  {
    id: 87231,
    customer: "Ana Ferreira",
    date: "22/03/2023",
    items: 4,
    total: "R$ 456,89",
    paymentMethod: "Cartão de Crédito",
    status: "Entregue"
  },
  {
    id: 87230,
    customer: "Carlos Souza",
    date: "21/03/2023",
    items: 1,
    total: "R$ 567,90",
    paymentMethod: "PIX",
    status: "Cancelado"
  },
  {
    id: 87229,
    customer: "Mariana Costa",
    date: "21/03/2023",
    items: 2,
    total: "R$ 678,90",
    paymentMethod: "Cartão de Crédito",
    status: "Aguardando pagamento"
  },
  {
    id: 87228,
    customer: "Rafael Gomes",
    date: "20/03/2023",
    items: 5,
    total: "R$ 789,01",
    paymentMethod: "PIX",
    status: "Entregue"
  },
  {
    id: 87227,
    customer: "Juliana Alves",
    date: "20/03/2023",
    items: 3,
    total: "R$ 890,12",
    paymentMethod: "Cartão de Crédito",
    status: "Processando"
  }
];

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOrders = mockOrders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsUpdateStatusDialogOpen(false);
      // Aqui você adicionaria lógica para atualizar o status
    }, 1000);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-800";
      case "Em trânsito":
        return "bg-blue-100 text-blue-800";
      case "Processando":
        return "bg-yellow-100 text-yellow-800";
      case "Aguardando pagamento":
        return "bg-purple-100 text-purple-800";
      case "Cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout title="Gerenciar Pedidos">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Gerencie os pedidos da loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente ou número do pedido..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsUpdateStatusDialogOpen(true);
                              }}
                            >
                              <Truck className="mr-2 h-4 w-4" /> Atualizar status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Detalhes do Pedido */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Informações completas do pedido.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Informações do Cliente</h3>
                    <p className="text-sm">{selectedOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">cliente@exemplo.com</p>
                    <p className="text-sm text-muted-foreground">(11) 98765-4321</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Informações do Pedido</h3>
                    <p className="text-sm">Data: {selectedOrder.date}</p>
                    <p className="text-sm">Pagamento: {selectedOrder.paymentMethod}</p>
                    <p className="text-sm">Status: {selectedOrder.status}</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-sm mb-2">Itens do Pedido</h3>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Unitário</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Notebook Pro X</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>R$ 2.999,00</TableCell>
                        <TableCell>R$ 2.999,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mouse Gamer RGB</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>R$ 199,00</TableCell>
                        <TableCell>R$ 199,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Headset 7.1 Surround</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>R$ 299,00</TableCell>
                        <TableCell>R$ 299,00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Subtotal:</p>
                    <p className="text-sm text-muted-foreground">Frete:</p>
                    <p className="font-medium">Total:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">R$ 3.497,00</p>
                    <p className="text-sm">R$ 0,00</p>
                    <p className="font-medium">{selectedOrder.total}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDetailsDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Atualização de Status */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedOrder && (
            <form onSubmit={handleUpdateStatus}>
              <DialogHeader>
                <DialogTitle>Atualizar Status do Pedido #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Atualize o status do pedido e adicione informações de rastreamento, se disponíveis.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status do Pedido</Label>
                  <Select defaultValue={selectedOrder.status.toLowerCase().replace(" ", "-")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aguardando-pagamento">Aguardando pagamento</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                      <SelectItem value="em-transito">Em trânsito</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tracking-code">Código de Rastreamento</Label>
                  <Input id="tracking-code" placeholder="BR123456789XX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tracking-url">URL de Rastreamento</Label>
                  <Input id="tracking-url" placeholder="https://..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input id="notes" placeholder="Notas internas sobre o pedido" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)} type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar Status"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}