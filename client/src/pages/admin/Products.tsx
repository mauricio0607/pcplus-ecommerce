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
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Edit, 
  Trash, 
  Plus, 
  MoreVertical,
  Star,
  Loader2
} from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Notebook Pro X",
    price: "R$ 2.999,00",
    stock: 45,
    category: "Notebooks",
    featured: true,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 2,
    name: "Mouse Gamer RGB",
    price: "R$ 199,00",
    stock: 120,
    category: "Periféricos",
    featured: false,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 3,
    name: "Monitor UltraWide 29\"",
    price: "R$ 1.589,00",
    stock: 25,
    category: "Monitores",
    featured: true,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 4,
    name: "Teclado Mecânico",
    price: "R$ 349,00",
    stock: 78,
    category: "Periféricos",
    featured: false,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 5,
    name: "Placa de Vídeo RTX 4060",
    price: "R$ 2.299,00",
    stock: 18,
    category: "Componentes",
    featured: true,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 6,
    name: "SSD 1TB NVMe",
    price: "R$ 499,00",
    stock: 60,
    category: "Componentes",
    featured: false,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 7,
    name: "Desktop Gamer",
    price: "R$ 5.499,00",
    stock: 12,
    category: "Desktops",
    featured: true,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 8,
    name: "Webcam HD",
    price: "R$ 199,00",
    stock: 95,
    category: "Periféricos",
    featured: false,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 9,
    name: "Headset 7.1 Surround",
    price: "R$ 299,00",
    stock: 53,
    category: "Periféricos",
    featured: false,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 10,
    name: "Processador Intel i7",
    price: "R$ 1.899,00",
    stock: 30,
    category: "Componentes",
    featured: true,
    image: "https://via.placeholder.com/50"
  }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreateDialogOpen(false);
      // Aqui você adicionaria lógica para adicionar o produto
    }, 1000);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditDialogOpen(false);
      // Aqui você adicionaria lógica para editar o produto
    }, 1000);
  };

  const handleDeleteProduct = () => {
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      // Aqui você adicionaria lógica para excluir o produto
    }, 1000);
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Gerencie os produtos da loja
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> 
            Novo Produto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
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
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 rounded-md mr-3 object-cover"
                          />
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? "text-red-500 font-medium" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.featured ? (
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <Star className="h-5 w-5 text-gray-300" />
                        )}
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
                                setSelectedProduct(product);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Criação de Produto */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleCreateProduct}>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar um novo produto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input id="name" placeholder="Nome do produto" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input id="price" placeholder="0,00" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notebooks">Notebooks</SelectItem>
                      <SelectItem value="desktops">Desktops</SelectItem>
                      <SelectItem value="componentes">Componentes</SelectItem>
                      <SelectItem value="perifericos">Periféricos</SelectItem>
                      <SelectItem value="monitores">Monitores</SelectItem>
                      <SelectItem value="acessorios">Acessórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input id="stock" type="number" min="0" placeholder="0" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descrição detalhada do produto" 
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input id="image" placeholder="https://..." required />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Produto em destaque</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Criando...
                  </>
                ) : (
                  "Criar Produto"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição de Produto */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProduct && (
            <form onSubmit={handleEditProduct}>
              <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogDescription>
                  Edite as informações do produto.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nome do Produto</Label>
                    <Input 
                      id="edit-name" 
                      defaultValue={selectedProduct.name} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Preço (R$)</Label>
                    <Input 
                      id="edit-price" 
                      defaultValue={selectedProduct.price.replace("R$ ", "")} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Select defaultValue={selectedProduct.category.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notebooks">Notebooks</SelectItem>
                        <SelectItem value="desktops">Desktops</SelectItem>
                        <SelectItem value="componentes">Componentes</SelectItem>
                        <SelectItem value="perifericos">Periféricos</SelectItem>
                        <SelectItem value="monitores">Monitores</SelectItem>
                        <SelectItem value="acessorios">Acessórios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Estoque</Label>
                    <Input 
                      id="edit-stock" 
                      type="number" 
                      min="0" 
                      defaultValue={selectedProduct.stock} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea 
                    id="edit-description" 
                    defaultValue="Descrição do produto aqui"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-image">URL da Imagem</Label>
                  <Input 
                    id="edit-image" 
                    defaultValue={selectedProduct.image} 
                    required 
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-featured" defaultChecked={selectedProduct.featured} />
                  <Label htmlFor="edit-featured">Produto em destaque</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão de Produto */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduct?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Excluindo...
                </>
              ) : (
                "Excluir Produto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}