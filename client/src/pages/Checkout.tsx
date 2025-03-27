import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SHIPPING_METHODS, BRAZILIAN_STATES, PIX_DISCOUNT_PERCENTAGE, PAYMENT_METHODS, DEFAULT_ORDER_NUMBER } from "@/lib/constants";
import { generatePixPayment, formatCreditCardNumber, formatExpiryDate, formatCVV } from "@/lib/mercadopago";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema for customer information
const customerSchema = z.object({
  name: z.string().min(3, { message: "Nome completo é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  document: z.string().min(11, { message: "CPF inválido" }),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(8, { message: "CEP inválido" }),
  shippingMethod: z.string().min(1, { message: "Selecione um método de envio" }),
  paymentMethod: z.string().min(1, { message: "Selecione um método de pagamento" }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [pixData, setPixData] = useState<any>(null);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(SHIPPING_METHODS[0]);
  const shippingCost = selectedShippingMethod.price;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS.PIX);
  
  // Calculate discount if PIX payment method is selected
  const discount = selectedPaymentMethod === PAYMENT_METHODS.PIX 
    ? (subtotal * PIX_DISCOUNT_PERCENTAGE / 100) 
    : 0;
  
  const total = subtotal + shippingCost - discount;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Setup form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      shippingMethod: selectedShippingMethod.id,
      paymentMethod: selectedPaymentMethod,
    },
  });

  // Handle shipping method change
  const handleShippingMethodChange = (methodId: string) => {
    const method = SHIPPING_METHODS.find(m => m.id === methodId);
    if (method) {
      setSelectedShippingMethod(method);
      form.setValue("shippingMethod", methodId);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    form.setValue("paymentMethod", method);
  };

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerDocument: data.document,
        shippingAddress: `${data.address}, ${data.number}${data.complement ? `, ${data.complement}` : ''}, ${data.neighborhood}`,
        shippingCity: data.city,
        shippingState: data.state,
        shippingZip: data.zipCode,
        shippingMethod: data.shippingMethod,
        shippingCost: shippingCost,
        paymentMethod: data.paymentMethod,
        totalAmount: total,
        status: "pending",
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price),
          totalPrice: parseFloat(item.price) * item.quantity,
        })),
      };

      // Create order
      const response = await apiRequest("POST", "/api/orders", orderData);
      const order = await response.json();
      setOrderId(order.id);

      // Process payment based on method
      if (data.paymentMethod === PAYMENT_METHODS.PIX) {
        // Generate PIX payment
        const pixPaymentData = await generatePixPayment(
          total,
          {
            name: data.name,
            email: data.email,
            document: data.document,
          },
          `Pedido #${order.id || DEFAULT_ORDER_NUMBER} - TechStore`,
          order.id || 0
        );
        
        setPixData(pixPaymentData);
      }

      // Move to next step
      setCheckoutStep(4); // Go directly to confirmation
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (checkoutStep === 1 && cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setCheckoutStep(prev => Math.min(prev + 1, 4));
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCheckoutStep(prev => Math.max(prev - 1, 1));
  };

  // Handle order completion
  const handleCompletePurchase = () => {
    clearCart();
    navigate("/");
    toast({
      title: "Pedido finalizado!",
      description: "Obrigado por comprar conosco.",
    });
  };

  // Get ZIP code information
  const fetchAddressByZipCode = async (zipCode: string) => {
    if (zipCode.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue("address", data.logradouro);
        form.setValue("neighborhood", data.bairro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
      }
    } catch (error) {
      console.error("Error fetching ZIP code:", error);
    }
  };

  // Render progress indicator
  const renderProgress = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
              checkoutStep >= 1 ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
            } font-bold`}>1</div>
            <span className="text-sm font-medium mt-2">Produtos</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2">
            <div className="h-full bg-primary" style={{ width: `${Math.max(0, (checkoutStep - 1) * 33.33)}%` }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
              checkoutStep >= 2 ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
            } font-bold`}>2</div>
            <span className="text-sm font-medium mt-2">Dados</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2">
            <div className="h-full bg-primary" style={{ width: `${Math.max(0, (checkoutStep - 2) * 50)}%` }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
              checkoutStep >= 3 ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
            } font-bold`}>3</div>
            <span className="text-sm font-medium mt-2">Pagamento</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2">
            <div className="h-full bg-primary" style={{ width: `${Math.max(0, (checkoutStep - 3) * 100)}%` }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
              checkoutStep >= 4 ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
            } font-bold`}>4</div>
            <span className="text-sm font-medium mt-2">Confirmação</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a loja
        </Link>
        <h1 className="text-2xl font-bold mt-4">Finalizar Compra</h1>
      </div>

      {renderProgress()}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Products and Forms */}
        <div className="lg:w-2/3">
          {/* Step 1: Review Products */}
          {checkoutStep === 1 && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Produtos no Carrinho</h2>
                
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                    <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                      Adicionar Produtos
                    </Button>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row border-b border-gray-200 py-4">
                        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                        <div className="md:ml-4 flex-1 mt-4 md:mt-0">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <div className="mt-2 md:mt-0 text-right md:text-left">
                              <p className="font-semibold">{formatCurrency(parseFloat(item.price) * item.quantity)}</p>
                              <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-6">
                      <div className="flex justify-between font-semibold">
                        <span>Frete estimado:</span>
                        <span>{formatCurrency(selectedShippingMethod.price)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Cálculo final na próxima etapa.</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Cupom de Desconto</h2>
                <div className="flex">
                  <Input 
                    type="text" 
                    placeholder="Código do cupom" 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white rounded-r-md"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleNextStep}
                  disabled={cartItems.length === 0}
                  className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition"
                >
                  Continuar 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2 and 3: Customer Information and Payment */}
          {(checkoutStep === 2 || checkoutStep === 3) && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {checkoutStep === 2 && (
                  <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Seu nome completo" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="document"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Seu CPF (apenas números)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="seu@email.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="(00) 00000-0000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CEP</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="00000-000"
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">&nbsp;</Label>
                            <Button 
                              type="button"
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={() => fetchAddressByZipCode(form.getValues("zipCode"))}
                            >
                              Buscar
                            </Button>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Rua, Avenida, etc." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Número" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="complement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Apto, Bloco, etc." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="neighborhood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bairro</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Seu bairro" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Sua cidade" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {BRAZILIAN_STATES.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                      {state.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">Opções de Envio</h2>
                      <FormField
                        control={form.control}
                        name="shippingMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleShippingMethodChange(value);
                                }}
                                defaultValue={field.value}
                                className="space-y-4"
                              >
                                {SHIPPING_METHODS.map((method) => (
                                  <div key={method.id} className="flex items-start p-4 border border-gray-200 rounded-md hover:border-primary cursor-pointer">
                                    <RadioGroupItem 
                                      value={method.id} 
                                      id={method.id} 
                                      className="mt-1 mr-3" 
                                    />
                                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                                      <div className="flex items-center">
                                        <span className="font-medium">{method.name}</span>
                                        <span className="ml-auto font-semibold">{formatCurrency(method.price)}</span>
                                      </div>
                                      <p className="text-sm text-gray-600">Receba em {method.days}</p>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {checkoutStep === 3 && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                handlePaymentMethodChange(value);
                              }}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center p-4 bg-neutral-50 cursor-pointer">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.PIX} 
                                    id="payment-pix" 
                                    className="mr-3" 
                                  />
                                  <Label htmlFor="payment-pix" className="font-medium flex items-center cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 512 512" fill="currentColor">
                                      <path d="M112,96h288a0,0,0,0,1,0,0V416a0,0,0,0,1,0,0H112a16,16,0,0,1-16-16V112A16,16,0,0,1,112,96Z" />
                                      <path fill="#fff" d="M280,176H232a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V184A8,8,0,0,0,280,176Zm-8,64H240V192h32Z" />
                                      <path fill="#fff" d="M336,176H320a8,8,0,0,0,0,16h8v40H320a8,8,0,0,0,0,16h16a8,8,0,0,0,8-8V184A8,8,0,0,0,336,176Z" />
                                      <rect fill="#fff" x="176" y="176" width="16" height="80" rx="8" />
                                      <rect fill="#fff" x="208" y="176" width="16" height="80" rx="8" />
                                    </svg>
                                    PIX ({PIX_DISCOUNT_PERCENTAGE}% de desconto)
                                  </Label>
                                </div>
                                {selectedPaymentMethod === PAYMENT_METHODS.PIX && (
                                  <div className="p-4 border-t border-gray-200">
                                    <div className="flex flex-col items-center justify-center p-4">
                                      <p className="text-center text-sm text-gray-600 mb-4">
                                        Ao finalizar o pedido, você receberá um QR Code para pagamento via PIX.
                                        <br />
                                        O pagamento é processado instantaneamente.
                                      </p>
                                      <div className="bg-green-50 p-3 rounded-md text-green-800 flex items-start w-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm">
                                          <p className="font-semibold">Pagamento Seguro</p>
                                          <p>Seus dados estão protegidos e o pagamento é processado em ambiente seguro.</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center p-4 bg-neutral-50 cursor-pointer">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.CREDIT_CARD} 
                                    id="payment-credit" 
                                    className="mr-3" 
                                  />
                                  <Label htmlFor="payment-credit" className="font-medium flex items-center cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                    </svg>
                                    Cartão de Crédito
                                  </Label>
                                </div>
                                {selectedPaymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                                  <div className="p-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div className="md:col-span-2">
                                        <Label>Número do Cartão</Label>
                                        <Input 
                                          type="text" 
                                          placeholder="0000 0000 0000 0000"
                                          onChange={(e) => {
                                            e.target.value = formatCreditCardNumber(e.target.value);
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <Label>Nome no Cartão</Label>
                                        <Input type="text" placeholder="Nome como aparece no cartão" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Validade</Label>
                                          <Input 
                                            type="text" 
                                            placeholder="MM/AA"
                                            onChange={(e) => {
                                              e.target.value = formatExpiryDate(e.target.value);
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Label>CVV</Label>
                                          <Input 
                                            type="text" 
                                            placeholder="123"
                                            onChange={(e) => {
                                              e.target.value = formatCVV(e.target.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="md:col-span-2">
                                        <Label>Parcelas</Label>
                                        <Select defaultValue="1">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione o número de parcelas" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1">1x de {formatCurrency(total)} sem juros</SelectItem>
                                            <SelectItem value="2">2x de {formatCurrency(total / 2)} sem juros</SelectItem>
                                            <SelectItem value="3">3x de {formatCurrency(total / 3)} sem juros</SelectItem>
                                            <SelectItem value="4">4x de {formatCurrency(total / 4)} sem juros</SelectItem>
                                            <SelectItem value="5">5x de {formatCurrency(total / 5)} sem juros</SelectItem>
                                            <SelectItem value="6">6x de {formatCurrency(total / 6)} sem juros</SelectItem>
                                            <SelectItem value="7">7x de {formatCurrency(total / 7)} sem juros</SelectItem>
                                            <SelectItem value="8">8x de {formatCurrency(total / 8)} sem juros</SelectItem>
                                            <SelectItem value="9">9x de {formatCurrency(total / 9)} sem juros</SelectItem>
                                            <SelectItem value="10">10x de {formatCurrency(total / 10)} sem juros</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center p-4 bg-neutral-50 cursor-pointer">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.BOLETO} 
                                    id="payment-boleto" 
                                    className="mr-3" 
                                  />
                                  <Label htmlFor="payment-boleto" className="font-medium flex items-center cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM7 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H8a1 1 0 01-1-1V4zm2 2V5h1v1H9zM7 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3zm2 2v-1h1v1H9zM11 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1zM11 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1zM3 16a1 1 0 011-1h15a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Boleto Bancário
                                  </Label>
                                </div>
                                {selectedPaymentMethod === PAYMENT_METHODS.BOLETO && (
                                  <div className="p-4 border-t border-gray-200">
                                    <p className="mb-4 text-gray-600">O boleto será gerado após a confirmação do pedido e você poderá imprimi-lo ou pagar online.</p>
                                    <div className="bg-yellow-50 p-3 rounded-md text-yellow-800 flex items-start">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                      </svg>
                                      <div className="text-sm">
                                        <p className="font-semibold">Informação Importante</p>
                                        <p>O boleto tem vencimento em 3 dias úteis. O pedido será confirmado somente após a confirmação do pagamento.</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button 
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="py-3 px-8 border border-primary text-primary hover:bg-neutral-50 font-semibold rounded-md transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Voltar
                  </Button>
                  
                  {checkoutStep === 2 ? (
                    <Button 
                      type="button"
                      onClick={handleNextStep}
                      className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition"
                    >
                      Continuar 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition"
                    >
                      Finalizar Pedido 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}
          
          {/* Step 4: Confirmation */}
          {checkoutStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Pedido Realizado com Sucesso!</h2>
              <p className="text-lg text-gray-600 mb-6">Obrigado por comprar na TechStore.</p>
              <div className="bg-neutral-50 p-4 rounded-md mb-6 inline-block">
                <p className="font-semibold">Número do pedido: <span className="text-primary">#{orderId || DEFAULT_ORDER_NUMBER}</span></p>
                <p className="text-sm text-gray-600">Guarde este número para acompanhar seu pedido</p>
              </div>
              
              {selectedPaymentMethod === PAYMENT_METHODS.PIX && pixData && (
                <div className="border border-primary rounded-lg p-4 max-w-md mx-auto mb-8">
                  <h3 className="text-lg font-bold text-primary mb-2">Pagamento via PIX</h3>
                  <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code abaixo ou copie o código PIX para finalizar seu pagamento:</p>
                  
                  <div className="border-4 border-primary p-2 rounded-lg mb-4">
                    <div className="w-48 h-48 bg-neutral-50 flex items-center justify-center mx-auto">
                      <img 
                        src={pixData.point_of_interaction?.transaction_data?.qr_code_base64 || 
                             "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNDAgMEgyMEMxNC42OTU3IDAgOS42MDg2MiAyLjEwNzE0IDUuODU3ODcgNS44NTc4N0MyLjEwNzE0IDkuNjA4NjIgMCAxNC42OTU3IDAgMjBWMTQwQzAgMTQ1LjMwNCAyLjEwNzE0IDE1MC4zOTEgNS44NTc4NyAxNTQuMTQyQzkuNjA4NjIgMTU3Ljg5MyAxNC42OTU3IDE2MCAyMCAxNjBIMTQwQzE0NS4zMDQgMTYwIDE1MC4zOTEgMTU3Ljg5MyAxNTQuMTQyIDE1NC4xNDJDMTU3Ljg5MyAxNTAuMzkxIDE2MCAxNDUuMzA0IDE2MCAxNDBWMjBDMTYwIDE0LjY5NTcgMTU3Ljg5MyA5LjYwODYyIDE1NC4xNDIgNS44NTc4N0MxNTAuMzkxIDIuMTA3MTQgMTQ1LjMwNCAwIDE0MCAwVjBaTTIwIDQwSDE0MFYxMjBIMjBWNDBaIiBmaWxsPSIjRkY2QjAwIi8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI0ZGNkIwMCIvPgo8L3N2Zz4K"} 
                        alt="QR Code PIX" 
                        className="w-36 h-36 mx-auto"
                      />
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600 mb-2">Escaneie o QR Code com o app do seu banco</p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.point_of_interaction?.transaction_data?.qr_code || "");
                        toast({
                          title: "Código copiado!",
                          description: "Cole no app do seu banco para pagar.",
                        });
                      }}
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                      Copiar Código
                    </Button>
                    {pixData.point_of_interaction?.transaction_data?.ticket_url && (
                      <a 
                        href={pixData.point_of_interaction.transaction_data.ticket_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Baixar
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
                <div className="flex justify-between mb-1">
                  <span>Produtos:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Frete:</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-1">
                    <span>Desconto PIX ({PIX_DISCOUNT_PERCENTAGE}%):</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Você receberá um e-mail com os detalhes do seu pedido.<br />
                Se tiver qualquer dúvida, entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleCompletePurchase}
                  className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition"
                >
                  Voltar para a Loja
                </Button>
                <Button
                  variant="outline"
                  className="py-3 px-8 border border-primary text-primary hover:bg-neutral-50 font-semibold rounded-md transition"
                >
                  Acompanhar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Frete</span>
                <span id="shipping-cost">{formatCurrency(shippingCost)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Desconto PIX ({PIX_DISCOUNT_PERCENTAGE}%)</span>
                  <span id="pix-discount">-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-primary" id="total-amount">{formatCurrency(total)}</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-green-800">Compra 100% Segura</p>
                  <p className="text-sm text-green-700">Seus dados estão protegidos e sua compra é garantida.</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Aceitamos</h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-neutral-50 rounded p-1">
                  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-10 text-blue-800">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff"/>
                    <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                    <path d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm4.5-3.67h-1.02v-.96h1.02v.96zm-1.02 4.5h1.02v-3.92h-1.02v3.92zm4.53-4.5h-.98v4.5h.98v-4.5zm4.88 4.5h-1.41V9.66c.05-.39.22-.83.89-.83.31 0 .52.07.69.16l.22-.9c-.22-.11-.55-.2-.92-.2-.53 0-.92.2-1.19.52-.31.39-.49.92-.49 1.57v1.93h.89V10.6h.61v.83zm5.82-2.93c-.43-.55-1.08-.84-1.89-.84-1.33 0-2.49 1.09-2.49 2.52 0 1.43 1.16 2.52 2.49 2.52.81 0 1.47-.29 1.89-.84v.77h.98V9.13h-.98v.77zm-.15 1.68c0 .83-.65 1.51-1.51 1.51-.85 0-1.5-.68-1.5-1.51 0-.83.65-1.51 1.5-1.51.86 0 1.51.67 1.51 1.51z" fill="#00579F"/>
                  </svg>
                </div>
                <div className="bg-neutral-50 rounded p-1">
                  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-10">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff"/>
                    <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                    <path d="M21.3 9.7h-3.7v8.7h3.7c1.5 0 2.7-.5 3.4-1.3.7-.9 1.1-2.1 1.1-3 0-2.1-1.7-4.4-4.5-4.4zm0 7.3h-2.1v-5.8h2.1c1.7 0 2.9 1.4 2.9 3 0 1.5-1.2 2.8-2.9 2.8zm-10.2-3.8c0 2.1 1.7 3.8 3.8 3.8 1.1 0 1.9-.4 2.4-.8V17h1.6v-8.7h-1.6v.8c-.5-.5-1.4-.9-2.4-.9-2.1 0-3.8 1.7-3.8 3.8zm3.8-2.3c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" fill="#E61C24"/>
                    <circle cx="16.3" cy="7.1" r="1" fill="#E61C24"/>
                  </svg>
                </div>
                <div className="bg-neutral-50 rounded p-1">
                  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-10 text-blue-600">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff"/>
                    <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                    <path d="M19 11.2c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM9.8 6h4.4v1.5h-4.4V6zm12.5 0h-2.2v7.5h2.2V6zm4.5 0h-2.2v7.5h2.2V6zm3 0h-2.3v1.5h2.3V6zm-12.8 0h-2.3v1.5h2.3V6z" fill="#006FCF"/>
                  </svg>
                </div>
                <div className="bg-neutral-50 rounded p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-8 text-primary" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M112,96h288a0,0,0,0,1,0,0V416a0,0,0,0,1,0,0H112a16,16,0,0,1-16-16V112A16,16,0,0,1,112,96Z" />
                    <path fill="#fff" d="M280,176H232a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V184A8,8,0,0,0,280,176Zm-8,64H240V192h32Z" />
                    <path fill="#fff" d="M336,176H320a8,8,0,0,0,0,16h8v40H320a8,8,0,0,0,0,16h16a8,8,0,0,0,8-8V184A8,8,0,0,0,336,176Z" />
                    <rect fill="#fff" x="176" y="176" width="16" height="80" rx="8" />
                    <rect fill="#fff" x="208" y="176" width="16" height="80" rx="8" />
                  </svg>
                </div>
                <div className="bg-neutral-50 rounded p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-10 text-gray-700" viewBox="0 0 512 512" fill="currentColor">
                    <rect x="48" y="96" width="416" height="320" rx="56" ry="56" fill="#fff" stroke="currentColor" strokeWidth="32"/>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M128 128h256M128 192h256M128 256h256M128 320h256M128 384h256"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Precisa de ajuda? <Link href="/contact" className="text-primary hover:underline">Entre em contato</Link></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
