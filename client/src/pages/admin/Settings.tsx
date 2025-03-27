import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  SaveIcon, 
  Loader2, 
  RefreshCw, 
  Package, 
  TruckIcon,
  CreditCard,
  BellIcon,
  SettingsIcon,
  Mail,
  GlobeIcon
} from "lucide-react";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);
    
    try {
      // Coletar dados do formulário
      const formElements = e.target as HTMLFormElement;
      
      // Dados gerais
      const siteName = (formElements.querySelector('#site-name') as HTMLInputElement)?.value;
      const siteUrl = (formElements.querySelector('#site-url') as HTMLInputElement)?.value;
      const siteDescription = (formElements.querySelector('#site-description') as HTMLTextAreaElement)?.value;
      const contactEmail = (formElements.querySelector('#contact-email') as HTMLInputElement)?.value;
      const contactPhone = (formElements.querySelector('#contact-phone') as HTMLInputElement)?.value;
      
      // Obter valores de switches
      const inventoryTracking = (formElements.querySelector('#inventory-tracking') as HTMLInputElement)?.checked;
      const allowReviews = (formElements.querySelector('#allow-reviews') as HTMLInputElement)?.checked;
      const maintenanceMode = (formElements.querySelector('#maintenance-mode') as HTMLInputElement)?.checked;
      const debugMode = (formElements.querySelector('#debug-mode') as HTMLInputElement)?.checked;
      
      // Criando objeto de configurações para enviar para a API
      const settings = {
        siteName,
        siteUrl,
        siteDescription,
        contactEmail,
        contactPhone,
        enableMaintenance: maintenanceMode,
        enableDebug: debugMode
      };
      
      // Enviar configurações para a API
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar configurações. Tente novamente.');
      }
      
      setToast({
        type: 'success',
        message: 'Configurações salvas com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setToast({
        type: 'error',
        message: (error as Error).message || 'Erro ao salvar configurações. Tente novamente.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-64 flex-shrink-0">
              <CardContent className="p-4">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                  <TabsTrigger value="general" className="w-full justify-start">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="store" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Loja
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagamentos
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="w-full justify-start">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Entrega
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start">
                    <BellIcon className="h-4 w-4 mr-2" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="email" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    Menus
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="w-full justify-start">
                    <GlobeIcon className="h-4 w-4 mr-2" />
                    Avançado
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
            
            <div className="flex-1 space-y-6">
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                    <CardDescription>
                      Configure as informações básicas da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Nome da Loja</Label>
                        <Input id="store-name" defaultValue="PC+" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-url">URL da Loja</Label>
                        <Input id="store-url" defaultValue="https://pcplus.com.br" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Descrição da Loja</Label>
                      <Textarea 
                        id="store-description" 
                        defaultValue="Loja especializada em produtos de informática e tecnologia."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email Administrativo</Label>
                        <Input id="admin-email" type="email" defaultValue="admin@pcplus.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Email de Suporte</Label>
                        <Input id="support-email" type="email" defaultValue="suporte@pcplus.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="(11) 1234-5678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input id="whatsapp" defaultValue="(11) 98765-4321" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>
                      Informe o endereço físico da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address-street">Endereço</Label>
                        <Input id="address-street" defaultValue="Rua Exemplo, 123" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-complement">Complemento</Label>
                        <Input id="address-complement" defaultValue="Sala 45" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address-city">Cidade</Label>
                        <Input id="address-city" defaultValue="São Paulo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-state">Estado</Label>
                        <Select defaultValue="SP">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-zip">CEP</Label>
                        <Input id="address-zip" defaultValue="01234-567" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="store" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Loja</CardTitle>
                    <CardDescription>
                      Configure as opções da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Moeda</Label>
                        <Select defaultValue="BRL">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Real (R$)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-rate">Taxa de Imposto (%)</Label>
                        <Input id="tax-rate" type="number" defaultValue="10" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                        <p className="text-sm text-muted-foreground">
                          Ative para exibir uma página de manutenção para os visitantes
                        </p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inventory-tracking">Controle de Estoque</Label>
                        <p className="text-sm text-muted-foreground">
                          Ative para controlar o estoque dos produtos
                        </p>
                      </div>
                      <Switch id="inventory-tracking" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-reviews">Permitir Avaliações</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que clientes avaliem os produtos
                        </p>
                      </div>
                      <Switch id="allow-reviews" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="guest-checkout">Checkout sem Cadastro</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que visitantes comprem sem criar uma conta
                        </p>
                      </div>
                      <Switch id="guest-checkout" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Resetar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Pagamento</CardTitle>
                    <CardDescription>
                      Configure as opções de pagamento da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="mercadopago">Mercado Pago</Label>
                          <p className="text-sm text-muted-foreground">
                            Ative para aceitar pagamentos via Mercado Pago
                          </p>
                        </div>
                        <Switch id="mercadopago" defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="mercadopago-access-token">Access Token</Label>
                          <Input 
                            id="mercadopago-access-token" 
                            type="password" 
                            defaultValue="TEST-1234567890123456789012345678901234" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mercadopago-public-key">Public Key</Label>
                          <Input 
                            id="mercadopago-public-key" 
                            defaultValue="TEST-1234567890123456789012345678901234" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pix-enabled">PIX</Label>
                          <p className="text-sm text-muted-foreground">
                            Ative para aceitar pagamentos via PIX
                          </p>
                        </div>
                        <Switch id="pix-enabled" defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="pix-discount">Desconto PIX (%)</Label>
                          <Input id="pix-discount" type="number" defaultValue="5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="boleto-enabled">Boleto</Label>
                          <p className="text-sm text-muted-foreground">
                            Ative para aceitar pagamentos via Boleto
                          </p>
                        </div>
                        <Switch id="boleto-enabled" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Entrega</CardTitle>
                    <CardDescription>
                      Configure as opções de entrega da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="free-shipping">Frete Grátis</Label>
                          <p className="text-sm text-muted-foreground">
                            Oferecer frete grátis para pedidos acima de um valor
                          </p>
                        </div>
                        <Switch id="free-shipping" defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="free-shipping-min">Valor Mínimo para Frete Grátis (R$)</Label>
                          <Input id="free-shipping-min" type="number" defaultValue="299" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="correios-enabled">Correios</Label>
                          <p className="text-sm text-muted-foreground">
                            Ative para cálculo de frete via Correios
                          </p>
                        </div>
                        <Switch id="correios-enabled" defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="correios-code">Código de Serviço</Label>
                          <Input id="correios-code" defaultValue="04014" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correios-password">Senha</Label>
                          <Input id="correios-password" type="password" defaultValue="123456" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="local-pickup">Retirada na Loja</Label>
                          <p className="text-sm text-muted-foreground">
                            Permitir que clientes retirem pedidos na loja
                          </p>
                        </div>
                        <Switch id="local-pickup" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificações</CardTitle>
                    <CardDescription>
                      Configure as notificações da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-notifications">Notificações de Pedidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações para novos pedidos
                        </p>
                      </div>
                      <Switch id="order-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="stock-notifications">Alertas de Estoque</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber alertas quando o estoque estiver baixo
                        </p>
                      </div>
                      <Switch id="stock-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="review-notifications">Notificações de Avaliações</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações para novas avaliações de produtos
                        </p>
                      </div>
                      <Switch id="review-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="customer-notifications">Notificações de Clientes</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações para novos cadastros de clientes
                        </p>
                      </div>
                      <Switch id="customer-notifications" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Email</CardTitle>
                    <CardDescription>
                      Configure as opções de email da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Servidor SMTP</Label>
                        <Input id="smtp-host" defaultValue="smtp.exemplo.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Porta SMTP</Label>
                        <Input id="smtp-port" defaultValue="587" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">Usuário SMTP</Label>
                        <Input id="smtp-user" defaultValue="contato@pcplus.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">Senha SMTP</Label>
                        <Input id="smtp-password" type="password" defaultValue="********" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-sender">Nome do Remetente</Label>
                      <Input id="email-sender" defaultValue="PC+ Informática" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-order-confirmation">Email de Confirmação de Pedido</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar email de confirmação para novos pedidos
                        </p>
                      </div>
                      <Switch id="email-order-confirmation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-shipping-confirmation">Email de Confirmação de Envio</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar email quando o pedido for enviado
                        </p>
                      </div>
                      <Switch id="email-shipping-confirmation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-welcome">Email de Boas-vindas</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar email de boas-vindas para novos clientes
                        </p>
                      </div>
                      <Switch id="email-welcome" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="menu" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Menu</CardTitle>
                    <CardDescription>
                      Configure os itens do menu de navegação do site
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium mb-3">Menu Principal</h3>
                      <div className="space-y-3 border rounded-md p-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="font-medium">Início</div>
                          <div className="flex items-center space-x-2">
                            <Switch id="menu-home-visible" defaultChecked />
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="font-medium">Categorias</div>
                          <div className="flex items-center space-x-2">
                            <Switch id="menu-categories-visible" defaultChecked />
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="font-medium">Ofertas</div>
                          <div className="flex items-center space-x-2">
                            <Switch id="menu-offers-visible" defaultChecked />
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="font-medium">Suporte</div>
                          <div className="flex items-center space-x-2">
                            <Switch id="menu-support-visible" defaultChecked />
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Contato</div>
                          <div className="flex items-center space-x-2">
                            <Switch id="menu-contact-visible" defaultChecked />
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Adicionar Item
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Menu do Rodapé</h3>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-3 text-sm text-muted-foreground">Informações</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-3">
                              <div className="font-medium">Sobre Nós</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-about-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-b pb-3">
                              <div className="font-medium">Política de Privacidade</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-privacy-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-b pb-3">
                              <div className="font-medium">Termos e Condições</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-terms-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-b pb-3">
                              <div className="font-medium">Formas de Pagamento</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-payment-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-b pb-3">
                              <div className="font-medium">Entregas e Frete</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-shipping-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Trocas e Devoluções</div>
                              <div className="flex items-center space-x-2">
                                <Switch id="footer-returns-visible" defaultChecked />
                                <Button variant="outline" size="sm" className="h-7 px-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            
                            <Button className="w-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              Adicionar Item
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Button variant="outline" className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Adicionar Nova Seção
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Resetar Padrões</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                    <CardDescription>
                      Configurações avançadas da sua loja
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cache-ttl">Tempo de Cache (segundos)</Label>
                      <Input id="cache-ttl" defaultValue="3600" type="number" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Chave de API</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="api-key" 
                          defaultValue="pc_plus_api_key_12345678901234567890" 
                          className="flex-1"
                          disabled
                        />
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Gerar Nova
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debug-mode">Modo de Depuração</Label>
                        <p className="text-sm text-muted-foreground">
                          Ative para registrar informações detalhadas para depuração
                        </p>
                      </div>
                      <Switch id="debug-mode" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header-scripts">Scripts de Cabeçalho (Head)</Label>
                      <Textarea 
                        id="header-scripts" 
                        placeholder="<!-- Adicione scripts personalizados aqui -->"
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Adicione scripts personalizados que serão incluídos no cabeçalho da página.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer-scripts">Scripts de Rodapé (Footer)</Label>
                      <Textarea 
                        id="footer-scripts" 
                        placeholder="<!-- Adicione scripts personalizados aqui -->"
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Adicione scripts personalizados que serão incluídos no rodapé da página.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Resetar</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
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
                </Card>
                
                <Card className="border-red-200">
                  <CardHeader className="text-red-500">
                    <CardTitle>Zona de Perigo</CardTitle>
                    <CardDescription className="text-red-500/80">
                      Ações que podem causar consequências irreversíveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-md">
                      <h3 className="font-medium mb-2">Limpar Cache</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Isso irá limpar todo o cache do sistema. O site pode ficar mais lento temporariamente.
                      </p>
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        Limpar Cache
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-red-200 rounded-md">
                      <h3 className="font-medium mb-2">Redefinir Configurações</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Isso irá redefinir todas as configurações para os valores padrão.
                      </p>
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        Redefinir Configurações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}