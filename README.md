# PC+ E-commerce

Uma plataforma de e-commerce avançada para loja de produtos de informática com experiência de usuário dinâmica e sistema de envio baseado em localização.

![PC+ Screenshot](attached_assets/image_1743050062479.png)

## Características Principais

- **Interface Responsiva**: Layout adaptado para dispositivos móveis, tablets e desktops
- **Catálogo de Produtos**: Sistema completo de categorias e produtos com imagens, descrições e especificações técnicas
- **Carrinho de Compras**: Gerenciamento avançado de itens com atualização em tempo real
- **Processamento de Pagamentos**: Integração com Mercado Pago, incluindo suporte para PIX
- **Cálculo de Frete por Localização**: Sistema de cálculo de envio baseado no CEP do cliente
- **Gestão de Usuários**: Sistema de registro, login e perfil do cliente
- **Painel Administrativo**: Interface completa para gerenciar produtos, pedidos, clientes e configurações
- **Múltiplos Papéis de Usuário**: Acesso diferenciado para clientes e administradores

## Tecnologias

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle
- **Autenticação**: JWT, Sessões
- **Pagamentos**: API Mercado Pago
- **Deploy**: Configurável para qualquer ambiente (VPS, AWS, Google Cloud, etc.)

## Estrutura do Projeto

```
├── client/                  # Código do frontend React
│   ├── src/                 # Código fonte do frontend
│   │   ├── components/      # Componentes React reutilizáveis
│   │   ├── context/         # Contextos React (carrinho, autenticação, etc.)
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── lib/             # Utilidades e funções auxiliares
│   │   ├── pages/           # Páginas da aplicação
│   │   │   └── admin/       # Páginas do painel administrativo
│   └── public/              # Arquivos estáticos
├── server/                  # Código do backend
│   ├── routes.ts            # Definição de rotas da API
│   ├── storage.ts           # Interface de armazenamento e implementações
│   ├── admin.ts             # Rotas administrativas
│   └── shipping.ts          # Lógica de cálculo de frete
├── shared/                  # Código compartilhado entre cliente e servidor
│   └── schema.ts            # Definição do esquema do banco de dados
├── migrations/              # Migrações do banco de dados
├── config.js                # Configurações centralizadas
├── .env.example             # Exemplo de configuração de ambiente
├── pcplus_database.sql      # Script SQL para criação do banco de dados
├── db_export_import.js      # Utilidade para exportar/importar dados
└── DEPLOYMENT.md            # Guia detalhado de implantação
```

## Implantação

Este projeto pode ser implantado em qualquer ambiente que suporte Node.js e PostgreSQL. Para instruções detalhadas, consulte [DEPLOYMENT.md](DEPLOYMENT.md).

### Requisitos

- Node.js 18+
- PostgreSQL 14+
- NPM ou Yarn

### Implantação Rápida

1. Clone o repositório
2. Copie `.env.example` para `.env` e configure as variáveis
3. Instale as dependências: `npm install`
4. Configure o banco de dados: `psql -U seu_usuario -d seu_banco -f pcplus_database.sql`
5. Compile o frontend: `npm run build`
6. Inicie o servidor: `npm start`

## Configuração do Banco de Dados

O projeto é flexível e suporta múltiplas fontes de dados:

1. **PostgreSQL Local/Remoto**: Banco de dados PostgreSQL tradicional (padrão)
2. **Supabase**: Backend como serviço baseado em PostgreSQL com recursos adicionais
3. **Memória**: Armazenamento em memória para testes e desenvolvimento

A configuração é feita através das variáveis de ambiente ou do arquivo `config.js`:

```bash
# No arquivo .env
STORAGE_TYPE=postgres  # Opções: 'postgres', 'supabase', 'memory'

# Para PostgreSQL tradicional
DATABASE_URL=postgres://usuario:senha@localhost:5432/pcplus

# Para Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-chave-service-role
```

### Migrações

Para criar ou atualizar o banco de dados:

```bash
npm run db:migrate
```

### Uso do Supabase

Para usar o Supabase como banco de dados:

1. Crie uma conta e um novo projeto em [supabase.com](https://supabase.com)
2. Copie as credenciais (URL e chaves) da seção de configurações da API
3. Configure as variáveis de ambiente e defina `STORAGE_TYPE=supabase`
4. A estrutura de tabelas será criada automaticamente

### Exportar/Importar Dados

Para transferir dados entre ambientes:

```bash
# Exportar dados
node db_export_import.js export ./backups

# Importar dados
node db_export_import.js import ./backups
```

## Desenvolvimento

### Iniciar em Modo de Desenvolvimento

```bash
npm run dev
```

### Testes

```bash
npm test
```

## Customização

### Tema

O tema visual pode ser customizado através do arquivo `theme.json`.

### Configurações do Site

Várias configurações do site podem ser modificadas através do painel administrativo em `/admin/settings`.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Suporte

Para suporte técnico, entre em contato através de:

- Email: [seu-email@dominio.com]
- GitHub Issues: [link-para-repositório/issues]