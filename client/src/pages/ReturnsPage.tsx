import { Helmet } from "react-helmet";
import { Link } from "wouter";

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Trocas e Devoluções | PC+</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Trocas e Devoluções</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Política de Trocas e Devoluções</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-3">Direito de Arrependimento</h3>
              <p className="text-gray-700 mb-4">
                De acordo com o Código de Defesa do Consumidor (Art. 49), você tem até 7 dias corridos após o recebimento do produto para solicitar o cancelamento da compra e devolução do produto, independentemente do motivo.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  <strong>Importante:</strong> Para exercer o direito de arrependimento, o produto deve estar em sua embalagem original, sem sinais de uso, com todos os acessórios, manuais e nota fiscal.
                </p>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Troca e Devolução por Defeito</h3>
              <p className="text-gray-700 mb-4">
                Em caso de defeito no produto, você tem as seguintes garantias:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Defeito nos primeiros 7 dias</h4>
                  <p className="text-gray-700 mb-3">
                    Se o produto apresentar defeito em até 7 dias após o recebimento, você pode escolher entre:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Troca imediata por outro produto igual</li>
                    <li>Devolução e reembolso integral</li>
                    <li>Abatimento proporcional no preço</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Defeito após 7 dias (Garantia)</h4>
                  <p className="text-gray-700 mb-3">
                    Após o período de 7 dias, entra em vigor a garantia contratual do fabricante:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>O produto será enviado para análise técnica</li>
                    <li>O reparo deve ser realizado em até 30 dias</li>
                    <li>Se não for possível o reparo, você escolhe entre substituição do produto, devolução ou abatimento proporcional</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Erros de Entrega</h3>
              <p className="text-gray-700 mb-4">
                Em caso de problemas na entrega, temos as seguintes políticas:
              </p>
              
              <div className="space-y-3">
                <div className="flex border-b pb-3">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Produto diferente do solicitado</h4>
                    <p className="text-gray-700">
                      Se você receber um produto diferente do que foi comprado, entre em contato conosco em até 7 dias após o recebimento. Enviaremos o produto correto sem custo adicional de frete e providenciaremos a coleta do produto enviado por engano.
                    </p>
                  </div>
                </div>
                
                <div className="flex border-b pb-3">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Produto danificado no transporte</h4>
                    <p className="text-gray-700">
                      Se o produto chegar danificado, recuse o recebimento ou registre o problema no ato da entrega. Caso perceba o dano após o recebimento, entre em contato em até 48 horas com fotos da embalagem e do produto danificado.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Produto ausente na entrega</h4>
                    <p className="text-gray-700">
                      Se você recebeu um pedido incompleto (faltando itens), entre em contato conosco imediatamente, informando quais itens estão faltando conforme descrito na nota fiscal.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Como Solicitar Troca ou Devolução</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Procedimento para Solicitações</h3>
            <ol className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>
                <strong>Faça a solicitação:</strong>
                <p className="mt-1">
                  Acesse sua conta no site da PC+, vá até "Meus Pedidos", encontre o pedido em questão e clique em "Solicitar Troca/Devolução". Ou entre em contato com nosso atendimento.
                </p>
              </li>
              
              <li>
                <strong>Informe o motivo:</strong>
                <p className="mt-1">
                  Selecione o motivo da troca ou devolução e adicione detalhes ou fotos se necessário. Quanto mais informações, mais rápido processaremos sua solicitação.
                </p>
              </li>
              
              <li>
                <strong>Análise da solicitação:</strong>
                <p className="mt-1">
                  Nossa equipe analisará sua solicitação em até 2 dias úteis e entrará em contato para confirmar os próximos passos.
                </p>
              </li>
              
              <li>
                <strong>Envio do produto:</strong>
                <p className="mt-1">
                  Após a aprovação, você receberá instruções para o envio do produto. Em alguns casos, podemos agendar a coleta no seu endereço.
                </p>
              </li>
              
              <li>
                <strong>Análise técnica:</strong>
                <p className="mt-1">
                  O produto passará por uma inspeção para confirmar o problema relatado.
                </p>
              </li>
              
              <li>
                <strong>Conclusão:</strong>
                <p className="mt-1">
                  Após a análise, concluiremos o processo com a troca, reparo ou reembolso, conforme acordado.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Dicas importantes:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Guarde a embalagem original até ter certeza de que não precisará devolver o produto</li>
              <li>Teste o produto logo após o recebimento para identificar possíveis defeitos</li>
              <li>Fotografe o produto antes de enviá-lo para troca ou devolução</li>
              <li>Inclua uma cópia da nota fiscal junto com o produto devolvido</li>
              <li>Para produtos com garantia adicional, guarde o certificado de garantia</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Garantias</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Todos os produtos comercializados pela PC+ possuem garantia contra defeitos de fabricação. Os prazos de garantia variam conforme o produto:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Garantia Legal</h4>
                <p className="text-gray-700">
                  90 dias para produtos duráveis, conforme o Código de Defesa do Consumidor. Esta garantia é obrigatória e válida em todo o território nacional.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Garantia do Fabricante</h4>
                <p className="text-gray-700">
                  Varia conforme o fabricante e categoria do produto:
                </p>
                <ul className="list-disc pl-6 text-gray-700 text-sm mt-2">
                  <li>Notebooks: 1 ano</li>
                  <li>Desktops: 1 ano</li>
                  <li>Monitores: 1 a 3 anos</li>
                  <li>Periféricos: 3 meses a 1 ano</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Garantia Estendida</h4>
                <p className="text-gray-700">
                  Serviço opcional que pode ser adquirido durante a compra, ampliando o período de cobertura por mais 1 ou 2 anos além da garantia do fabricante.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg mt-2">
              <h4 className="font-medium text-yellow-800 mb-2">Situações não cobertas pela garantia:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Danos causados por mau uso, quedas ou acidentes</li>
                <li>Desgaste natural das peças</li>
                <li>Oxidação ou corrosão devido a ambientes inadequados</li>
                <li>Uso em desacordo com as especificações técnicas</li>
                <li>Violação do produto ou reparos feitos por técnicos não autorizados</li>
                <li>Problemas causados por instalação inadequada</li>
                <li>Danos elétricos por oscilações na rede ou uso de voltagem incorreta</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-1">Quem paga o frete na devolução?</h3>
              <p className="text-gray-700">
                No caso de defeito ou erro de entrega, o frete de devolução é por nossa conta. Em caso de arrependimento (devolução por desistência), também arcamos com os custos de retorno, conforme o Código de Defesa do Consumidor.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">Quanto tempo leva para receber o reembolso?</h3>
              <p className="text-gray-700">
                O prazo para reembolso varia conforme a forma de pagamento:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mt-2">
                <li><strong>Cartão de crédito:</strong> O estorno aparece em até 2 faturas após a aprovação da devolução</li>
                <li><strong>Boleto/PIX/Transferência:</strong> O reembolso é processado em até 7 dias úteis após a aprovação</li>
                <li><strong>Mercado Pago:</strong> O valor retorna à conta em até 3 dias úteis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">É possível trocar um produto por outro diferente?</h3>
              <p className="text-gray-700">
                Sim, caso você queira trocar por um produto diferente, tratamos como uma devolução seguida de uma nova compra. Fazemos o reembolso do produto devolvido e você realiza uma nova compra do produto desejado. Se o novo produto for de valor superior, você paga a diferença; se for de valor inferior, devolvemos a diferença.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-1">Qual o prazo máximo para solicitar uma troca por defeito?</h3>
              <p className="text-gray-700">
                O prazo para solicitar troca por defeito segue as regras de garantia. Você pode acionar a garantia a qualquer momento dentro do período de cobertura (garantia legal + garantia do fabricante). No entanto, recomendamos que teste o produto assim que o receber para identificar possíveis problemas rapidamente.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="font-medium text-lg mb-1">Precisa solicitar uma troca ou devolução?</h3>
            <p className="text-gray-600">Nossa equipe está pronta para ajudá-lo.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/support">
              <button className="px-5 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors">
                Abrir Ticket
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Fale Conosco
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}