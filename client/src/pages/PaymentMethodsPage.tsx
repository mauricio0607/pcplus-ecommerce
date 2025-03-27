import { Helmet } from "react-helmet";
import { Link } from "wouter";

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Formas de Pagamento | PC+</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Formas de Pagamento</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Opções de Pagamento Disponíveis</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Cartão de Crédito</h3>
              </div>
              
              <div className="pl-16">
                <p className="text-gray-700 mb-4">
                  Aceitamos as principais bandeiras de cartões de crédito para pagamento em até 12x sem juros, dependendo do valor da compra.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logopng.com.br/logos/visa-5.png" alt="Visa" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Mastercard" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logodownload.org/wp-content/uploads/2017/04/elo-logo-2.png" alt="Elo" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logospng.org/download/american-express/logo-american-express-icon-1024.png" alt="American Express" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logodownload.org/wp-content/uploads/2017/08/hipercard-logo-2.png" alt="Hipercard" className="h-8" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Regras de parcelamento:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>De R$ 100,00 a R$ 499,99: até 3x sem juros</li>
                    <li>De R$ 500,00 a R$ 999,99: até 6x sem juros</li>
                    <li>De R$ 1.000,00 a R$ 2.999,99: até 10x sem juros</li>
                    <li>Acima de R$ 3.000,00: até 12x sem juros</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">PIX</h3>
              </div>
              
              <div className="pl-16">
                <p className="text-gray-700 mb-4">
                  Pagamento instantâneo, com 5% de desconto sobre o valor total da compra.
                </p>
                
                <div className="bg-gray-100 p-2 rounded inline-block mb-4">
                  <img src="https://logopng.com.br/logos/pix-106.png" alt="PIX" className="h-8" />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Como funciona:</h4>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                    <li>Selecione PIX como forma de pagamento no checkout</li>
                    <li>Um QR Code será gerado para pagamento</li>
                    <li>Escaneie o QR Code com seu aplicativo bancário ou copie o código</li>
                    <li>Após o pagamento, a confirmação é instantânea</li>
                    <li>Seu pedido será processado imediatamente</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Boleto Bancário</h3>
              </div>
              
              <div className="pl-16">
                <p className="text-gray-700 mb-4">
                  Pagamento por boleto bancário, com 3% de desconto sobre o valor total da compra.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Informações importantes:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>O boleto tem vencimento em 3 dias úteis</li>
                    <li>O pedido será processado somente após a confirmação do pagamento (1-3 dias úteis)</li>
                    <li>Não é possível parcelar compras no boleto</li>
                    <li>Após o vencimento, o boleto não poderá ser pago e o pedido será cancelado automaticamente</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Cartão de Débito</h3>
              </div>
              
              <div className="pl-16">
                <p className="text-gray-700 mb-4">
                  Pagamento direto com seu cartão de débito, com 2% de desconto sobre o valor total da compra.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logopng.com.br/logos/visa-5.png" alt="Visa Electron" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Mastercard" className="h-8" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src="https://logodownload.org/wp-content/uploads/2017/04/elo-logo-2.png" alt="Elo" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Mercado Pago</h3>
              </div>
              
              <div className="pl-16">
                <p className="text-gray-700 mb-4">
                  Plataforma completa de pagamento com múltiplas opções, incluindo cartões de crédito, débito, saldo Mercado Pago e mais.
                </p>
                
                <div className="bg-gray-100 p-2 rounded inline-block mb-4">
                  <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-5.png" alt="Mercado Pago" className="h-8" />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Vantagens:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Segurança adicional em todas as transações</li>
                    <li>Diversas opções de pagamento em uma única plataforma</li>
                    <li>Processo de pagamento simplificado</li>
                    <li>As mesmas condições de parcelamento para cartões de crédito</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">O pagamento é seguro?</h3>
              <p className="text-gray-700">
                Sim, todas as transações são protegidas com criptografia SSL e processadas por gateways de pagamento reconhecidos e seguros. Seus dados financeiros nunca são armazenados em nossos servidores.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Posso alterar a forma de pagamento após finalizar o pedido?</h3>
              <p className="text-gray-700">
                Não é possível alterar a forma de pagamento após a finalização do pedido. Caso deseje utilizar outra forma de pagamento, será necessário cancelar o pedido atual e realizar um novo.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Em caso de troca ou devolução, como funciona o reembolso?</h3>
              <p className="text-gray-700">
                O reembolso será realizado pela mesma forma de pagamento utilizada na compra. Para cartões de crédito, o estorno ocorre na próxima fatura ou em até duas faturas. Para outras formas de pagamento, o reembolso é processado em até 7 dias úteis.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Fazem nota fiscal eletrônica?</h3>
              <p className="text-gray-700">
                Sim, emitimos Nota Fiscal Eletrônica (NF-e) para todas as compras. A nota fiscal é enviada por e-mail após o faturamento do pedido.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="font-medium text-lg mb-1">Precisa de ajuda com pagamentos?</h3>
            <p className="text-gray-600">Nossa equipe está à disposição para esclarecer suas dúvidas.</p>
          </div>
          <Link href="/contact" className="mt-4 md:mt-0">
            <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Fale Conosco
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}