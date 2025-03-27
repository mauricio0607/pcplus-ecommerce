import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Políticas | PC+</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Políticas PC+</h1>
        
        <Tabs defaultValue="privacy" className="mb-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
            <TabsTrigger value="terms">Termos e Condições</TabsTrigger>
            <TabsTrigger value="cookies">Política de Cookies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Política de Privacidade</h2>
            <p className="mb-4 text-sm text-gray-500">Última atualização: 01 de Janeiro de 2023</p>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Introdução</h3>
                <p className="text-gray-700">
                  A PC+ valoriza a privacidade dos seus usuários e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais quando você utiliza nosso site ou serviços.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Informações que Coletamos</h3>
                <p className="text-gray-700 mb-2">
                  Podemos coletar os seguintes tipos de informações:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Informações de Cadastro:</strong> nome completo, e-mail, telefone, CPF/CNPJ, data de nascimento.</li>
                  <li><strong>Informações de Contato:</strong> endereço de entrega, endereço de cobrança.</li>
                  <li><strong>Informações de Pagamento:</strong> dados de cartão de crédito (processados de forma segura por gateways de pagamento).</li>
                  <li><strong>Informações de Uso:</strong> páginas visitadas, produtos visualizados, tempo gasto no site, histórico de compras.</li>
                  <li><strong>Informações do Dispositivo:</strong> tipo de dispositivo, sistema operacional, navegador, endereço IP.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">3. Como Utilizamos suas Informações</h3>
                <p className="text-gray-700 mb-2">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Processar e entregar seus pedidos</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Personalizar sua experiência de compra</li>
                  <li>Enviar comunicações sobre produtos, serviços e promoções</li>
                  <li>Melhorar nosso site e serviços</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">4. Compartilhamento de Informações</h3>
                <p className="text-gray-700 mb-2">
                  Podemos compartilhar suas informações com:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Parceiros de entrega:</strong> para entregar seus pedidos.</li>
                  <li><strong>Processadores de pagamento:</strong> para processar transações.</li>
                  <li><strong>Provedores de serviços:</strong> que nos ajudam a operar nosso negócio.</li>
                  <li><strong>Autoridades governamentais:</strong> quando exigido por lei.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Não vendemos ou alugamos suas informações pessoais a terceiros para fins de marketing.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">5. Proteção de Dados</h3>
                <p className="text-gray-700">
                  Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações pessoais contra acesso não autorizado, perda, uso indevido ou alteração. Utilizamos criptografia SSL para proteger dados sensíveis transmitidos em nosso site.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">6. Seus Direitos</h3>
                <p className="text-gray-700 mb-2">
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem os seguintes direitos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Confirmar a existência de tratamento de seus dados</li>
                  <li>Acessar seus dados</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar consentimento</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">7. Contato</h3>
                <p className="text-gray-700">
                  Se você tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail: privacidade@pcplus.com.br.
                </p>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="terms" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Termos e Condições de Uso</h2>
            <p className="mb-4 text-sm text-gray-500">Última atualização: 01 de Janeiro de 2023</p>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Aceitação dos Termos</h3>
                <p className="text-gray-700">
                  Ao acessar e utilizar o site PC+, você concorda em cumprir e estar sujeito a estes Termos e Condições de Uso. Se você não concordar com algum dos termos, não utilize nosso site.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Cadastro e Conta</h3>
                <p className="text-gray-700 mb-2">
                  Para realizar compras em nosso site, você precisará criar uma conta. Ao se cadastrar, você concorda em:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Fornecer informações precisas, atuais e completas</li>
                  <li>Manter suas informações atualizadas</li>
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">3. Produtos e Preços</h3>
                <p className="text-gray-700 mb-2">
                  Nosso compromisso é fornecer informações precisas sobre produtos e preços. No entanto:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Nos reservamos o direito de corrigir erros de preços ou especificações</li>
                  <li>As imagens dos produtos são ilustrativas e podem variar ligeiramente do produto real</li>
                  <li>A disponibilidade de estoque é sujeita a alterações sem aviso prévio</li>
                  <li>Promoções e descontos têm regras específicas e período de validade</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">4. Compras e Pagamentos</h3>
                <p className="text-gray-700 mb-2">
                  Ao realizar uma compra, você concorda que:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Está adquirindo produtos para uso próprio ou para presentear, não para revenda</li>
                  <li>Está autorizado a usar o método de pagamento escolhido</li>
                  <li>As informações de pagamento fornecidas são verdadeiras e precisas</li>
                  <li>Os valores pagos incluem produtos, frete e impostos aplicáveis</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">5. Entrega</h3>
                <p className="text-gray-700 mb-2">
                  Sobre nossas entregas:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Os prazos de entrega são estimados e podem variar conforme a região</li>
                  <li>O cliente é responsável por garantir que o endereço de entrega está correto</li>
                  <li>É necessário que alguém esteja presente para receber o produto</li>
                  <li>Verificar as condições do produto no ato do recebimento</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">6. Política de Cancelamento</h3>
                <p className="text-gray-700 mb-2">
                  Cancelamentos podem ser solicitados:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>A qualquer momento, se o pedido ainda não foi enviado</li>
                  <li>Dentro de 7 dias após o recebimento (conforme Código de Defesa do Consumidor)</li>
                  <li>Através da área "Meus Pedidos" em sua conta ou pelo SAC</li>
                  <li>O reembolso será realizado pelo mesmo meio de pagamento utilizado na compra</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">7. Propriedade Intelectual</h3>
                <p className="text-gray-700">
                  Todo o conteúdo do site PC+, incluindo mas não limitado a logotipos, textos, imagens, design, software e código, são propriedade exclusiva da PC+ ou de seus licenciadores e são protegidos por leis de propriedade intelectual. É proibida a reprodução, distribuição ou modificação sem autorização prévia.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">8. Limitação de Responsabilidade</h3>
                <p className="text-gray-700">
                  A PC+ não será responsável por danos indiretos, incidentais, especiais ou consequentes resultantes do uso ou incapacidade de uso dos nossos produtos ou serviços. Nos esforçamos para manter o site funcionando sem interrupções, mas não garantimos que será livre de erros ou que o acesso será contínuo e ininterrupto.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">9. Alterações nos Termos</h3>
                <p className="text-gray-700">
                  Reservamo-nos o direito de modificar estes Termos e Condições a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. Recomendamos que você revise periodicamente estes Termos para se manter informado sobre atualizações.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">10. Lei Aplicável</h3>
                <p className="text-gray-700">
                  Estes Termos e Condições são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
                </p>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="cookies" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Política de Cookies</h2>
            <p className="mb-4 text-sm text-gray-500">Última atualização: 01 de Janeiro de 2023</p>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. O que são Cookies?</h3>
                <p className="text-gray-700">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, smartphone ou tablet) quando você visita um site. Eles contêm informações sobre sua navegação e permitem que o site reconheça seu dispositivo em visitas futuras.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Como Utilizamos os Cookies</h3>
                <p className="text-gray-700 mb-2">
                  Utilizamos cookies para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site, como autenticação e segurança.</li>
                  <li><strong>Cookies de preferências:</strong> armazenam suas configurações e preferências, como idioma e região.</li>
                  <li><strong>Cookies analíticos:</strong> nos ajudam a entender como os visitantes interagem com o site, permitindo melhorias.</li>
                  <li><strong>Cookies de marketing:</strong> utilizados para exibir anúncios relevantes e medir a eficácia das campanhas.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">3. Cookies de Terceiros</h3>
                <p className="text-gray-700">
                  Alguns cookies são colocados por serviços de terceiros que aparecem em nossas páginas, como botões de redes sociais, mapas, ferramentas de análise e publicidade. Esses terceiros podem coletar informações sobre sua navegação em diferentes sites.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">4. Gerenciamento de Cookies</h3>
                <p className="text-gray-700 mb-2">
                  Você pode gerenciar os cookies através das configurações do seu navegador. As opções mais comuns incluem:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Aceitar todos os cookies</li>
                  <li>Ser notificado quando um cookie é definido</li>
                  <li>Excluir todos os cookies ao fechar o navegador</li>
                  <li>Bloquear cookies de terceiros</li>
                  <li>Bloquear todos os cookies (isso pode afetar a funcionalidade do site)</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Cada navegador tem um processo diferente para gerenciar cookies. Consulte a seção de ajuda do seu navegador para instruções específicas.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">5. Impacto da Desativação de Cookies</h3>
                <p className="text-gray-700">
                  Se você optar por desativar certos cookies, algumas funcionalidades do site podem não funcionar corretamente. Por exemplo, você pode encontrar limitações ao fazer login, adicionar itens ao carrinho, ou receber recomendações personalizadas.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">6. Atualizações na Política de Cookies</h3>
                <p className="text-gray-700">
                  Podemos atualizar nossa Política de Cookies periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. Recomendamos que você revise esta política regularmente para se manter informado sobre como utilizamos cookies.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">7. Mais Informações</h3>
                <p className="text-gray-700">
                  Se você tiver dúvidas ou precisar de mais informações sobre nossa Política de Cookies, entre em contato conosco pelo e-mail: privacidade@pcplus.com.br.
                </p>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}