import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import Cart from "@/components/Cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogIn
} from "lucide-react";

export default function Navbar() {
  const { isCartOpen, toggleCart, getItemsCount } = useCart();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-primary font-bold text-2xl">PC+</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-neutral-text hover:text-primary transition">
                Início
              </Link>
              <div className="relative group">
                <button className="text-neutral-text hover:text-primary transition flex items-center">
                  Categorias <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 hidden group-hover:block">
                  <Link href="/?category=notebooks" className="block px-4 py-2 hover:bg-neutral-50 rounded-md">
                    Notebooks
                  </Link>
                  <Link href="/?category=desktops" className="block px-4 py-2 hover:bg-neutral-50 rounded-md">
                    Desktops
                  </Link>
                  <Link href="/?category=perifericos" className="block px-4 py-2 hover:bg-neutral-50 rounded-md">
                    Periféricos
                  </Link>
                  <Link href="/?category=componentes" className="block px-4 py-2 hover:bg-neutral-50 rounded-md">
                    Componentes
                  </Link>
                  <Link href="/?category=acessorios" className="block px-4 py-2 hover:bg-neutral-50 rounded-md">
                    Acessórios
                  </Link>
                </div>
              </div>
              <Link href="/?featured=true" className="text-neutral-text hover:text-primary transition">
                Ofertas
              </Link>
              <Link href="/support" className="text-neutral-text hover:text-primary transition">
                Suporte
              </Link>
              <Link href="/contact" className="text-neutral-text hover:text-primary transition">
                Contato
              </Link>
            </nav>

            {/* Search, Cart and Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="pl-10 pr-4 py-2 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </form>
              </div>
              
              {/* Cart button */}
              <button
                onClick={toggleCart}
                className="relative"
                aria-label="Abrir carrinho de compras"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-neutral-text hover:text-primary transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {getItemsCount()}
                  </span>
                )}
              </button>
              
              {/* User profile or login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="User menu">
                      <Avatar className="h-8 w-8 bg-primary text-white">
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8 bg-primary text-white">
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Meus Pedidos</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/wishlist">
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Lista de Desejos</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </DropdownMenuItem>
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <DropdownMenuItem>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="mr-2 h-4 w-4" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                          </svg>
                          <span>Painel Administrativo</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{logoutMutation.isPending ? "Saindo..." : "Sair"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-1 items-center">
                    <LogIn className="h-4 w-4 mr-1" />
                    Entrar
                  </Button>
                </Link>
              )}
              
              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Menu móvel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-neutral-text hover:text-primary transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search (Hidden by default) */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="py-2">
              <Link href="/" className="block py-2 text-neutral-text hover:text-primary">
                Início
              </Link>
              <Link href="/?featured=true" className="block py-2 text-neutral-text hover:text-primary">
                Ofertas
              </Link>
              <Link href="/support" className="block py-2 text-neutral-text hover:text-primary">
                Suporte
              </Link>
              <Link href="/contact" className="block py-2 text-neutral-text hover:text-primary">
                Contato
              </Link>
              
              {/* User Authentication Links (Mobile) */}
              {user ? (
                <>
                  <div className="py-2 border-t border-gray-100 mt-2">
                    <div className="font-medium py-2">Minha Conta</div>
                    <Link href="/profile" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                      Meu Perfil
                    </Link>
                    <Link href="/orders" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                      Meus Pedidos
                    </Link>
                    <Link href="/wishlist" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                      Lista de Desejos
                    </Link>
                    <Link href="/profile" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                      Configurações
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                        Painel Administrativo
                      </Link>
                    )}
                    <button 
                      onClick={() => logoutMutation.mutate()} 
                      disabled={logoutMutation.isPending}
                      className="block pl-4 py-1 text-red-500 hover:text-red-700 w-full text-left"
                    >
                      {logoutMutation.isPending ? "Saindo..." : "Sair"}
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/auth" className="block py-2 text-primary font-medium hover:text-primary-dark">
                  Entrar / Cadastrar
                </Link>
              )}
              
              <div className="py-2 border-t border-gray-100 mt-2">
                <div className="font-medium py-2">Categorias</div>
                <Link href="/?category=notebooks" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                  Notebooks
                </Link>
                <Link href="/?category=desktops" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                  Desktops
                </Link>
                <Link href="/?category=perifericos" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                  Periféricos
                </Link>
                <Link href="/?category=componentes" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                  Componentes
                </Link>
                <Link href="/?category=acessorios" className="block pl-4 py-1 text-neutral-text hover:text-primary">
                  Acessórios
                </Link>
              </div>
            </div>
            <form onSubmit={handleSearch} className="relative mt-2">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10 pr-4 py-2 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <Button type="submit" className="sr-only">
                Buscar
              </Button>
            </form>
          </div>
        )}
      </header>

      <Cart isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
}
