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
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Edit, 
  Trash, 
  Plus, 
  MoreVertical,
  Loader2
} from "lucide-react";

const mockCategories = [
  {
    id: 1,
    name: "Notebooks",
    slug: "notebooks",
    icon: "laptop",
    productCount: 12
  },
  {
    id: 2,
    name: "Desktops",
    slug: "desktops",
    icon: "pc-case",
    productCount: 8
  },
  {
    id: 3,
    name: "Monitores",
    slug: "monitores",
    icon: "monitor",
    productCount: 15
  },
  {
    id: 4,
    name: "Periféricos",
    slug: "perifericos",
    icon: "mouse",
    productCount: 30
  },
  {
    id: 5,
    name: "Componentes",
    slug: "componentes",
    icon: "cpu",
    productCount: 45
  },
  {
    id: 6,
    name: "Acessórios",
    slug: "acessorios",
    icon: "headphones",
    productCount: 27
  },
  {
    id: 7,
    name: "Redes",
    slug: "redes",
    icon: "wifi",
    productCount: 18
  },
  {
    id: 8,
    name: "Smartphones",
    slug: "smartphones",
    icon: "smartphone",
    productCount: 20
  }
];

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = mockCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreateDialogOpen(false);
      // Aqui você adicionaria lógica para adicionar a categoria
    }, 1000);
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditDialogOpen(false);
      // Aqui você adicionaria lógica para editar a categoria
    }, 1000);
  };

  const handleDeleteCategory = () => {
    setIsSubmitting(true);
    
    // Simulação de requisição
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      // Aqui você adicionaria lógica para excluir a categoria
    }, 1000);
  };

  return (
    <AdminLayout title="Gerenciar Categorias">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Gerencie as categorias de produtos da loja
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> 
            Nova Categoria
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar categorias..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.icon}</TableCell>
                      <TableCell>{category.productCount}</TableCell>
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
                                setSelectedCategory(category);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedCategory(category);
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Criação de Categoria */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateCategory}>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova categoria.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input id="name" placeholder="Nome da categoria" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="slug-da-categoria" required />
                <p className="text-sm text-muted-foreground">
                  O slug é usado na URL da categoria (ex: /categoria/seu-slug)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Input id="icon" placeholder="laptop" required />
                <p className="text-sm text-muted-foreground">
                  Nome do ícone (usamos Lucide icons: laptop, monitor, cpu, etc.)
                </p>
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
                  "Criar Categoria"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição de Categoria */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedCategory && (
            <form onSubmit={handleEditCategory}>
              <DialogHeader>
                <DialogTitle>Editar Categoria</DialogTitle>
                <DialogDescription>
                  Altere as informações da categoria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Categoria</Label>
                  <Input 
                    id="edit-name" 
                    defaultValue={selectedCategory.name}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input 
                    id="edit-slug" 
                    defaultValue={selectedCategory.slug}
                    required 
                  />
                  <p className="text-sm text-muted-foreground">
                    O slug é usado na URL da categoria (ex: /categoria/seu-slug)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Ícone</Label>
                  <Input 
                    id="edit-icon" 
                    defaultValue={selectedCategory.icon}
                    required 
                  />
                  <p className="text-sm text-muted-foreground">
                    Nome do ícone (usamos Lucide icons: laptop, monitor, cpu, etc.)
                  </p>
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

      {/* Diálogo de Exclusão de Categoria */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "{selectedCategory?.name}"? 
              Esta ação não pode ser desfeita.
              {selectedCategory?.productCount > 0 && (
                <p className="mt-2 text-red-500">
                  Esta categoria possui {selectedCategory?.productCount} produtos associados. 
                  A exclusão afetará esses produtos.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Excluindo...
                </>
              ) : (
                "Excluir Categoria"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}