import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menus = [
    { title: "Dashboard", link: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "Produtos", link: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { title: "Categorias", link: "/admin/categories", icon: <Tag className="h-5 w-5" /> },
    { title: "Pedidos", link: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Usuários", link: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { title: "Configurações", link: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <aside className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 md:z-auto`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-primary flex items-center">
            PC+ Admin
          </Link>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {menus.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`flex items-center px-4 py-3 transition-colors rounded-lg ${location === item.link ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
                {location === item.link && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>
                {logoutMutation.isPending ? "Saindo..." : "Sair"}
              </span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow h-16 flex items-center px-6">
          <button
            className="md:hidden mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-600 hidden md:block">
              <div>{user.name}</div>
              <div className="text-xs text-gray-500">Administrador</div>
            </div>
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="p-6 overflow-auto" style={{ height: "calc(100vh - 4rem)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}