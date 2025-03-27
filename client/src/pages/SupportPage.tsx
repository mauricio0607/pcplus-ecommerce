import { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";

export default function SupportPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    category: "",
    subject: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setTicketData(prev => ({ ...prev, category: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisa realizada",
        description: `Resultados para: "${searchQuery}"`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulando envio de ticket
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Ticket enviado",
        description: "Seu ticket de suporte foi aberto com sucesso. Em breve entraremos em contato!",
      });
      
      // Resetar formulário
      setTicketData({
        name: "",
        email: "",
        orderNumber: "",
        category: "",
        subject: "",
        description: ""
      });
    }, 1500);
  };

  const faqs = [
    {
      question: "Como posso acompanhar meu pedido?",
      answer: "Você pode acompanhar seu pedido acessando a seção 'Meus Pedidos' em sua conta. Lá você encontrará informações sobre o status do pedido, código de rastreamento e prazo de entrega estimado."
    },
    {
      question: "Qual é o prazo de entrega dos produtos?",
      answer: "O prazo de entrega varia de acordo com a sua localização e o método de envio escolhido. Em geral, trabalhamos com os seguintes prazos: Entrega Econômica (7-12 dias úteis), Entrega Padrão (3-7 dias úteis), Entrega Expressa (1-3 dias úteis). O prazo exato é apresentado durante o processo de checkout."
    },
    {
      question: "Como funciona a garantia dos produtos?",
      answer: "Todos os nossos produtos possuem garantia de fábrica, que varia de 3 meses a 3 anos, dependendo do fabricante. Além disso, oferecemos 7 dias para troca em caso de defeito de fabricação. Para acionar a garantia, entre em contato com nosso suporte técnico com seu número de pedido e descrição detalhada do problema."
    },
    {
      question: "Como faço para trocar ou devolver um produto?",
      answer: "Para solicitar uma troca ou devolução, acesse a seção 'Meus Pedidos' em sua conta, selecione o pedido correspondente e clique em 'Solicitar Troca/Devolução'. É necessário que o produto esteja em sua embalagem original, com todos os acessórios e manuais. Para mais detalhes, consulte nossa política de trocas e devoluções."
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos diversas formas de pagamento, incluindo: cartões de crédito (parcelamento em até 12x), cartões de débito, boleto bancário, transferência bancária, PIX e Mercado Pago. Para pagamentos via boleto, o pedido é processado após a confirmação do pagamento (1-3 dias úteis)."
    },
    {
      question: "Os preços incluem impostos?",
      answer: "Sim, todos os preços exibidos em nosso site já incluem todos os impostos aplicáveis. Não há cobranças adicionais além do valor do produto e do frete apresentado durante o checkout."
    },
    {
      question: "Vocês oferecem assistência técnica para os produtos vendidos?",
      answer: "Sim, oferecemos assistência técnica para todos os produtos vendidos em nossa loja. Para produtos em garantia, o serviço é gratuito. Para produtos fora da garantia, oferecemos orçamento sem compromisso. Entre em contato com nosso suporte técnico para mais informações."
    },
    {
      question: "É possível alterar um pedido já confirmado?",
      answer: "Alterações em pedidos já confirmados são possíveis apenas se o status estiver como 'Em Processamento'. Para solicitar alterações, entre em contato com nosso atendimento imediatamente com seu número de pedido e as alterações desejadas. Pedidos com status 'Em Transporte' ou 'Entregue' não podem ser alterados."
    },
    {
      question: "Como faço para cancelar um pedido?",
      answer: "Para cancelar um pedido, acesse a seção 'Meus Pedidos' em sua conta, selecione o pedido correspondente e clique em 'Solicitar Cancelamento'. Apenas pedidos com status 'Em Processamento' podem ser cancelados. Para pedidos com outros status, entre em contato com nosso atendimento."
    },
    {
      question: "Vocês atendem todo o Brasil?",
      answer: "Sim, realizamos entregas para todo o território nacional. Os prazos e valores de frete variam de acordo com a região e o método de envio escolhido. Para algumas localidades remotas, pode haver um prazo adicional de entrega."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Suporte | PC+</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Central de Suporte</h1>
        <p className="text-center text-gray-600 mb-8">Como podemos ajudar?</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <Input 
              type="text" 
              placeholder="Pesquisar dúvidas frequentes..." 
              className="flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Pesquisar</Button>
          </form>
        </div>
        
        <Tabs defaultValue="faq" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="ticket">Abrir Ticket</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Perguntas Frequentes</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-8 text-center">
              <p className="mb-4">Não encontrou o que procurava? Entre em contato conosco!</p>
              <div className="flex justify-center gap-4">
                <Link href="/contact">
                  <Button variant="outline">Contato</Button>
                </Link>
                <Button
                  onClick={() => document.querySelector('[data-value="ticket"]')?.dispatchEvent(new MouseEvent('click'))}
                >
                  Abrir Ticket
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ticket" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Abrir Ticket de Suporte</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Digite seu nome" 
                    value={ticketData.name} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    value={ticketData.email} 
                    onChange={handleChange} 
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Número do pedido (opcional)</Label>
                  <Input 
                    id="orderNumber" 
                    name="orderNumber" 
                    placeholder="Ex: PC1234567" 
                    value={ticketData.orderNumber} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select onValueChange={handleSelectChange} value={ticketData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-venda">Dúvidas de Pré-Venda</SelectItem>
                      <SelectItem value="pedido">Informações de Pedido</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="problemas">Problemas com Produto</SelectItem>
                      <SelectItem value="garantia">Garantia</SelectItem>
                      <SelectItem value="troca">Trocas e Devoluções</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="tecnico">Suporte Técnico</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="Digite o assunto do ticket" 
                  value={ticketData.subject} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição detalhada</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Descreva seu problema ou dúvida em detalhes..." 
                  rows={6} 
                  value={ticketData.description} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Ticket"}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                Nossa equipe responderá seu ticket em até 24 horas úteis.
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="contact" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Canais de Atendimento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-primary mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Suporte Técnico:</strong> suporte@pcplus.com.br<br />
                      <strong>Vendas:</strong> vendas@pcplus.com.br<br />
                      <strong>SAC:</strong> atendimento@pcplus.com.br
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-primary mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Telefone</h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Central de Atendimento:</strong> (62) 3456-7890<br />
                      <strong>Suporte Técnico:</strong> (62) 3456-7891<br />
                      <strong>Vendas Corporativas:</strong> (62) 3456-7892
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-primary mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Horário de Atendimento</h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Telefônico:</strong><br />
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 9h às 13h<br /><br />
                      
                      <strong>Email/Ticket:</strong><br />
                      24 horas (resposta em até 24h úteis)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">Dicas para um Atendimento Eficiente</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Tenha em mãos o número do seu pedido ou nota fiscal
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Descreva o problema de forma clara e objetiva
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Para problemas técnicos, informe o modelo exato do produto
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Se possível, anexe fotos ou vídeos demonstrando o problema
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verifique nossa seção de FAQs, sua dúvida pode já estar respondida
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Atendimento Prioritário</h4>
                  <p className="text-blue-600 text-sm">
                    Oferecemos atendimento prioritário para idosos, gestantes, pessoas com crianças de colo e pessoas com deficiência, conforme previsto em lei.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="mb-4">Prefere uma conversa detalhada? Visite nossa página de contato</p>
              <Link href="/contact">
                <Button>Ir para Página de Contato</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}