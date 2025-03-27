import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/ProfilePage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";

// Páginas do cliente
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import SupportPage from "@/pages/SupportPage";
import OrdersPage from "@/pages/OrdersPage";
import WishlistPage from "@/pages/WishlistPage";
import PolicyPage from "@/pages/PolicyPage";
import PaymentMethodsPage from "@/pages/PaymentMethodsPage";
import ShippingPage from "@/pages/ShippingPage";
import ReturnsPage from "@/pages/ReturnsPage";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Categories from "@/pages/admin/Categories";
import Orders from "@/pages/admin/Orders";
import Users from "@/pages/admin/Users";
import Settings from "@/pages/admin/Settings";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  // Se for uma rota de admin, não renderiza o layout normal
  if (isAdminRoute) {
    return (
      <Switch>
        <AdminProtectedRoute path="/admin" component={Dashboard} />
        <AdminProtectedRoute path="/admin/products" component={Products} />
        <AdminProtectedRoute path="/admin/categories" component={Categories} />
        <AdminProtectedRoute path="/admin/orders" component={Orders} />
        <AdminProtectedRoute path="/admin/users" component={Users} />
        <AdminProtectedRoute path="/admin/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:slug" component={ProductDetail} />
      <ProtectedRoute path="/checkout" component={Checkout} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Páginas de informação */}
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/privacy" component={PolicyPage} />
      <Route path="/terms" component={PolicyPage} />
      <Route path="/payment" component={PaymentMethodsPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/returns" component={ReturnsPage} />
      
      {/* Páginas protegidas do usuário */}
      <ProtectedRoute path="/orders" component={OrdersPage} />
      <ProtectedRoute path="/wishlist" component={WishlistPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Navbar />}
            <main className={`${!isAdminRoute ? "flex-grow" : "h-screen"}`}>
              <Router />
            </main>
            {!isAdminRoute && <Footer />}
          </div>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
