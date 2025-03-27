import { Helmet } from "react-helmet";
import { Link } from "wouter";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Entregas e Frete | PC+</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Entregas e Frete</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Informações de Entrega</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-4">Opções de Entrega</h3>
              <div className="space-y-4">
                <div className="flex border rounded-lg p-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-primary mb-1">Entrega Econômica</h4>
                    <p className="text-gray-700 mb-2">
                      Opção mais econômica, ideal para quem não tem pressa em receber o produto.
                    </p>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                      <span>Prazo estimado: 7 a 12 dias úteis</span>
                      <span>Valor: a partir de R$ 9,90</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border rounded-lg p-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-primary mb-1">Entrega Padrão</h4>
                    <p className="text-gray-700 mb-2">
                      Nossa opção mais popular, equilibrando custo e tempo de entrega.
                    </p>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                      <span>Prazo estimado: 3 a 7 dias úteis</span>
                      <span>Valor: a partir de R$ 14,90</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border rounded-lg p-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-primary mb-1">Entrega Expressa</h4>
                    <p className="text-gray-700 mb-2">
                      Opção mais rápida para quem precisa receber o produto com urgência.
                    </p>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                      <span>Prazo estimado: 1 a 3 dias úteis</span>
                      <span>Valor: a partir de R$ 24,90</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-4">Cálculo de Frete</h3>
              <p className="text-gray-700 mb-4">
                O valor do frete é calculado com base nos seguintes fatores:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>CEP de entrega:</strong> A distância entre nosso centro de distribuição e o endereço de entrega influencia diretamente no valor do frete.
                </li>
                <li>
                  <strong>Dimensões e peso do produto:</strong> Produtos maiores ou mais pesados podem ter valores de frete mais elevados.
                </li>
                <li>
                  <strong>Método de entrega escolhido:</strong> Cada opção de entrega (Econômica, Padrão, Expressa) possui valores diferentes.
                </li>
                <li>
                  <strong>Quantidade de itens:</strong> O frete é calculado considerando o volume total da compra.
                </li>
              </ul>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  Para calcular o frete exato para sua região, adicione produtos ao carrinho e informe seu CEP na página do produto ou no carrinho de compras.
                </p>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-4">Áreas Atendidas</h3>
              <p className="text-gray-700 mb-4">
                Realizamos entregas para todo o Brasil, mas os prazos e disponibilidade de entrega podem variar conforme a região:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Regiões Prioritárias</h4>
                  <p className="text-gray-700 mb-2">
                    Nessas áreas oferecemos todas as modalidades de entrega e os melhores prazos:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Estado de Goiás (todas as cidades)</li>
                    <li>Distrito Federal</li>
                    <li>Capitais e regiões metropolitanas</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Regiões Estendidas</h4>
                  <p className="text-gray-700 mb-2">
                    Nestas áreas, a entrega Expressa pode não estar disponível e os prazos podem ser maiores:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Interior de estados das regiões Norte e Nordeste</li>
                    <li>Áreas rurais ou de difícil acesso</li>
                    <li>Algumas ilhas e localidades remotas</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-4">Rastreamento de Pedidos</h3>
              <p className="text-gray-700 mb-4">
                Todos os pedidos enviados são acompanhados por um código de rastreamento que permite verificar o status da entrega em tempo real.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Como rastrear seu pedido:</h4>
                <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                  <li>Acesse a área "Meus Pedidos" na sua conta</li>
                  <li>Selecione o pedido que deseja rastrear</li>
                  <li>Clique no botão "Rastrear Pedido"</li>
                  <li>Ou utilize o código de rastreamento enviado por e-mail diretamente no site da transportadora</li>
                </ol>
              </div>
            </section>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Informações Importantes</h2>
          
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-lg mb-2">Prazo de Entrega</h3>
              <p className="text-gray-700">
                Os prazos de entrega são contados em dias úteis a partir da confirmação do pagamento, não da data do pedido. A contagem do prazo inicia no dia útil seguinte à aprovação do pagamento.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Recebimento de Produtos</h3>
              <p className="text-gray-700 mb-3">
                No momento do recebimento, siga estas recomendações:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Verifique se a embalagem está íntegra, sem sinais de violação ou danos</li>
                <li>Confira se os itens entregues correspondem ao seu pedido</li>
                <li>Teste o produto assim que possível</li>
                <li>Em caso de problemas, entre em contato com nosso suporte em até 7 dias</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Tentativas de Entrega</h3>
              <p className="text-gray-700 mb-3">
                As transportadoras realizam até 3 tentativas de entrega no endereço informado. É importante que haja alguém no local para receber o produto.
              </p>
              <p className="text-gray-700">
                Após a terceira tentativa frustrada, o produto retornará para o nosso centro de distribuição e será necessário agendar uma nova entrega, podendo haver cobrança adicional de frete.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Atrasos na Entrega</h3>
              <p className="text-gray-700">
                Eventualmente, podem ocorrer atrasos nas entregas devido a fatores externos como condições climáticas, bloqueios de estradas, greves ou problemas operacionais das transportadoras. Nesses casos, informaremos a você o novo prazo estimado de entrega.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-1">É possível alterar o endereço de entrega após a finalização do pedido?</h3>
              <p className="text-gray-700">
                Alterações de endereço podem ser solicitadas apenas enquanto o pedido estiver com status "Em processamento". Após o envio, não é possível alterar o endereço de entrega. Entre em contato com nosso suporte o mais rápido possível para solicitar a alteração.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">O que acontece se eu não estiver em casa para receber o produto?</h3>
              <p className="text-gray-700">
                Se você não estiver presente no momento da entrega, a transportadora deixará um aviso de tentativa de entrega e fará mais duas tentativas em dias úteis subsequentes. Se possível, deixe alguém autorizado para receber.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">Realizam entrega aos sábados, domingos e feriados?</h3>
              <p className="text-gray-700">
                Em geral, nossas entregas são realizadas apenas em dias úteis (segunda a sexta-feira). Algumas transportadoras parceiras podem realizar entregas aos sábados em determinadas regiões, mas isso não é garantido para todos os locais.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">É necessário apresentar documento de identificação para receber o produto?</h3>
              <p className="text-gray-700">
                Sim, a pessoa que receber o produto deve apresentar documento de identificação com foto e assinar o comprovante de entrega. Para produtos de maior valor, pode ser exigido que o próprio comprador receba o produto.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="font-medium text-lg mb-1">Ainda tem dúvidas sobre entregas?</h3>
            <p className="text-gray-600">Nossa equipe está à disposição para ajudar.</p>
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