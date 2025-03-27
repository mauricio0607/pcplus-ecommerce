# Instruções para Configuração do Banco de Dados Externo

Segue um guia passo a passo para configurar seu banco de dados PostgreSQL externo para o projeto PC+.

## Opção 1: Neon (Recomendado)

1. Acesse [Neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto
3. Na tela inicial do projeto, você terá acesso à string de conexão
4. Clique em "Connection String" e copie a string completa (formato: `postgres://user:password@host/database`)

## Opção 2: Supabase

1. Acesse [Supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá para "Project Settings" > "Database"
4. Encontre a seção "Connection String" e escolha "URI"
5. Copie a string de conexão, substituindo `[YOUR-PASSWORD]` pela senha que você definiu

## Opção 3: Railway

1. Acesse [Railway.app](https://railway.app) e crie uma conta
2. Crie um novo projeto
3. Adicione um banco de dados PostgreSQL
4. Na aba "Connect", copie a string de conexão (PostgreSQL Connection URL)

## Como usar o arquivo SQL

Depois de configurar seu banco de dados:

### Método 1: Interface Gráfica

1. Use uma ferramenta como [pgAdmin](https://www.pgadmin.org/), [DBeaver](https://dbeaver.io/) ou [TablePlus](https://tableplus.com/)
2. Conecte-se ao seu banco de dados usando a string de conexão
3. Abra uma nova janela de consulta SQL
4. Cole todo o conteúdo do arquivo `pcplus_database.sql`
5. Execute a consulta

### Método 2: Linha de Comando

Se você tem o PostgreSQL instalado localmente:

```bash
psql "sua_string_de_conexao" -f pcplus_database.sql
```

## Configurando o Replit

Depois de criar o banco de dados e executar o SQL:

1. No Replit, vá para "Tools" > "Secrets"
2. Adicione um novo segredo chamado `DATABASE_URL`
3. Cole sua string de conexão como valor
4. Reinicie seu aplicativo

## Testando a Conexão

Para verificar se a conexão está funcionando:

1. No terminal Replit, execute:
   ```bash
   npm run db:check
   ```
   
## Usuário Admin para Testes

O script SQL já criou um usuário administrador para você:

- Email: admin@pcplus.com
- Senha: admin123

## Produtos Pré-Cadastrados

O script também criou algumas categorias e produtos de exemplo para você começar a testar:

- Notebook Pro X
- PC Gamer Elite
- Monitor UltraWide 29"
- Teclado Mecânico RGB
- Placa de Vídeo RTX 4070
- Cadeira Gamer Pro
- Roteador Mesh Wi-Fi 6

## Notas Importantes

- As imagens são placeholders. Em um ambiente de produção, você precisará substituí-las por imagens reais.
- Recomendamos fazer backups regulares do seu banco de dados.
- Para um ambiente de produção, considere configurar réplicas de leitura para melhorar a performance.

Se encontrar algum problema na configuração, entre em contato para suporte técnico.