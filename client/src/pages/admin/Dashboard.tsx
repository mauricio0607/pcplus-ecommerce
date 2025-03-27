import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Package,
  TrendingUp,
  Heart 
} from "lucide-react";

const salesData = [
  { name: 'Jan', valor: 4000 },
  { name: 'Fev', valor: 3000 },
  { name: 'Mar', valor: 2000 },
  { name: 'Abr', valor: 2780 },
  { name: 'Mai', valor: 1890 },
  { name: 'Jun', valor: 2390 },
  { name: 'Jul', valor: 3490 },
];

const categoryData = [
  { name: 'Notebooks', value: 400 },
  { name: 'Desktops', value: 300 },
  { name: 'Periféricos', value: 300 },
  { name: 'Componentes', value: 200 },
  { name: 'Acessórios', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+20.1%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+12.2%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+18.7%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+189</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+8.4%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendas (últimos 7 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, 'Vendas']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="valor" fill="#FF5722" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, 'Vendas']}
                  />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Produtos Populares</span>
              <Heart className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notebook Pro X</p>
                    <p className="text-xs text-muted-foreground">32 vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ 2.999</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Monitor UltraWide 29"</p>
                    <p className="text-xs text-muted-foreground">28 vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ 1.589</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Placa de Vídeo RTX 4060</p>
                    <p className="text-xs text-muted-foreground">24 vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ 2.299</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mouse Gamer RGB</p>
                    <p className="text-xs text-muted-foreground">22 vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ 199</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">SSD 1TB NVMe</p>
                    <p className="text-xs text-muted-foreground">19 vendas</p>
                  </div>
                </div>
                <p className="font-medium">R$ 499</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">Pedido</th>
                    <th className="py-3 text-left font-medium">Cliente</th>
                    <th className="py-3 text-left font-medium">Data</th>
                    <th className="py-3 text-left font-medium">Valor</th>
                    <th className="py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-primary font-medium">#87234</td>
                    <td className="py-3">João Silva</td>
                    <td className="py-3">23/03/2023</td>
                    <td className="py-3">R$ 1.234,56</td>
                    <td className="py-3"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregue</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-primary font-medium">#87233</td>
                    <td className="py-3">Maria Santos</td>
                    <td className="py-3">23/03/2023</td>
                    <td className="py-3">R$ 2.345,67</td>
                    <td className="py-3"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Em trânsito</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-primary font-medium">#87232</td>
                    <td className="py-3">Pedro Oliveira</td>
                    <td className="py-3">22/03/2023</td>
                    <td className="py-3">R$ 345,78</td>
                    <td className="py-3"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processando</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-primary font-medium">#87231</td>
                    <td className="py-3">Ana Ferreira</td>
                    <td className="py-3">22/03/2023</td>
                    <td className="py-3">R$ 456,89</td>
                    <td className="py-3"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregue</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 text-primary font-medium">#87230</td>
                    <td className="py-3">Carlos Souza</td>
                    <td className="py-3">21/03/2023</td>
                    <td className="py-3">R$ 567,90</td>
                    <td className="py-3"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Cancelado</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}