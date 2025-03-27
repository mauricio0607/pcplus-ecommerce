import { Helmet } from "react-helmet";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Sobre Nós | PC+</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Sobre a PC+</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Nossa História</h2>
          <p className="mb-4">
            Fundada em 2010, a PC+ nasceu com a missão de oferecer produtos de informática de alta qualidade a preços acessíveis. Começamos como uma pequena loja em Goiânia e, graças à confiança de nossos clientes, expandimos nossas operações para todo o estado de Goiás e hoje atendemos todo o Brasil através da nossa loja online.
          </p>
          <p className="mb-4">
            Em nossa trajetória, sempre priorizamos o atendimento personalizado e a busca por soluções que realmente atendam às necessidades dos nossos clientes, desde o usuário doméstico até empresas de grande porte.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Nossa Missão</h2>
          <p className="mb-4">
            Proporcionar a melhor experiência em tecnologia, oferecendo produtos de qualidade e um atendimento excepcional, sempre buscando superar as expectativas dos nossos clientes.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 text-primary">Nossa Visão</h2>
          <p className="mb-4">
            Ser reconhecida como referência nacional em soluções de tecnologia, inovação e atendimento no segmento de informática.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 text-primary">Nossos Valores</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Compromisso com a satisfação do cliente</li>
            <li>Ética e transparência em todas as relações</li>
            <li>Inovação constante em produtos e serviços</li>
            <li>Respeito ao meio ambiente e responsabilidade social</li>
            <li>Valorização da equipe e colaboradores</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Por Que Escolher a PC+?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Produtos de Qualidade</h3>
              <p>Trabalhamos apenas com marcas reconhecidas e produtos com garantia de fábrica.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Preços Competitivos</h3>
              <p>Oferecemos os melhores preços do mercado sem comprometer a qualidade.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Entrega Rápida</h3>
              <p>Enviamos para todo o Brasil com agilidade e segurança no transporte.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Suporte Técnico</h3>
              <p>Contamos com uma equipe especializada para oferecer o melhor suporte e orientação.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Nossa Equipe</h2>
          <p className="mb-6">
            Somos uma equipe apaixonada por tecnologia e dedicada a proporcionar a melhor experiência para nossos clientes. Cada membro da nossa equipe é especialista em sua área, garantindo um atendimento profissional e de qualidade.
          </p>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium">
              Quer fazer parte da família PC+? <a href="/contact" className="text-primary hover:underline">Entre em contato conosco!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}