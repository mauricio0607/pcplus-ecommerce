# Configuração do Banco de Dados para PC+ E-commerce

Este documento fornece instruções detalhadas para configurar o banco de dados PostgreSQL para o PC+ E-commerce.

## Opções de Configuração

O PC+ E-commerce oferece flexibilidade na configuração do banco de dados:

1. **Variáveis de Ambiente**: Configuração através de variáveis de ambiente no sistema ou arquivo `.env`
2. **Arquivo de Configuração**: Personalização avançada através do arquivo `config.js`

## Configuração via Variáveis de Ambiente

A maneira mais simples de configurar a conexão com o banco de dados é através das seguintes variáveis de ambiente:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/pcplus
PGUSER=usuario
PGHOST=localhost
PGPASSWORD=senha
PGDATABASE=pcplus
PGPORT=5432
DATABASE_SSL=false
DB_POOL_SIZE=10
```

### Explicação das Variáveis

- **DATABASE_URL**: String de conexão completa no formato `postgres://usuario:senha@host:porta/banco`
- **PGUSER**: Nome do usuário do PostgreSQL
- **PGHOST**: Host/endereço do servidor PostgreSQL
- **PGPASSWORD**: Senha do usuário PostgreSQL
- **PGDATABASE**: Nome do banco de dados
- **PGPORT**: Porta do servidor PostgreSQL (padrão: 5432)
- **DATABASE_SSL**: Define se a conexão deve usar SSL (true/false)
- **DB_POOL_SIZE**: Tamanho do pool de conexões (padrão: 10)

## Configuração via Arquivo de Configuração

Para configurações mais avançadas, edite o arquivo `config.js` na raiz do projeto:

```javascript
// Configurações do banco de dados
const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgres://usuario:senha@localhost:5432/pcplus',
  ssl: process.env.DATABASE_SSL === 'true' || false,
  connectionPoolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10)
};
```

## Instruções para Diferentes Ambientes

### Desenvolvimento Local

Para desenvolvimento local, crie um arquivo `.env` na raiz do projeto:

```
DATABASE_URL=postgres://postgres:suasenha@localhost:5432/pcplus
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=suasenha
PGDATABASE=pcplus
PGPORT=5432
DATABASE_SSL=false
```

### Produção com PostgreSQL Auto-hospedado

```
DATABASE_URL=postgres://pcplus_user:senha_segura@localhost:5432/pcplus_prod
PGUSER=pcplus_user
PGHOST=localhost
PGPASSWORD=senha_segura
PGDATABASE=pcplus_prod
PGPORT=5432
DATABASE_SSL=false
DB_POOL_SIZE=20
```

### Produção com Serviço Gerenciado (AWS RDS, Google Cloud SQL, etc.)

```
DATABASE_URL=postgres://usuario:senha@seu-endpoint-rds.region.rds.amazonaws.com:5432/pcplus
PGUSER=usuario
PGHOST=seu-endpoint-rds.region.rds.amazonaws.com
PGPASSWORD=senha
PGDATABASE=pcplus
PGPORT=5432
DATABASE_SSL=true
DB_POOL_SIZE=20
```

## Criação e Preparação do Banco de Dados

### 1. Criação do Banco de Dados

Conecte ao PostgreSQL como superusuário:

```bash
sudo -u postgres psql
```

Execute os comandos SQL:

```sql
CREATE USER pcplus WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE pcplus OWNER pcplus;
\q
```

### 2. Configuração de Permissões

Conecte ao banco de dados criado:

```bash
sudo -u postgres psql -d pcplus
```

Execute os comandos SQL:

```sql
GRANT ALL PRIVILEGES ON DATABASE pcplus TO pcplus;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pcplus;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pcplus;
\q
```

### 3. Inicialização da Estrutura do Banco de Dados

Existem duas maneiras de inicializar a estrutura:

#### Opção 1: Usando o Script SQL

```bash
psql -U pcplus -d pcplus -f pcplus_database.sql
```

#### Opção 2: Usando o Sistema de Migração Automática

```bash
npm run db:push
```

## Scripts de Utilitários

O PC+ E-commerce inclui vários scripts de utilitários para facilitar a gestão do banco de dados:

### Verificação de Conexão

Para verificar se a conexão com o banco de dados está funcionando:

```bash
node run_db_check.js
```

### Exportação e Importação de Dados

Para transferir dados entre ambientes:

```bash
# Exportar dados para um diretório
node db_export_import.js export ./backup

# Importar dados de um diretório
node db_export_import.js import ./backup
```

### Criação de Usuário Administrador

Para criar um usuário com privilégios administrativos:

```bash
node create-admin.js
```

## Solução de Problemas Comuns

### Erro de Autenticação

Se você receber um erro como "password authentication failed":

1. Verifique as credenciais nas variáveis de ambiente ou arquivo `.env`
2. Confirme que o usuário do banco de dados existe e tem a senha correta
3. Verifique o arquivo `pg_hba.conf` para configurações de autenticação

### Erro "Database Does Not Exist"

1. Verifique se o banco de dados foi criado corretamente
2. Confirme o nome do banco de dados nas variáveis de ambiente ou arquivo `.env`
3. Crie o banco de dados manualmente se necessário

### Erro de Conexão SSL

Se você receber erros relacionados a SSL:

1. Configure `DATABASE_SSL=false` se estiver conectando localmente sem SSL
2. Configure `DATABASE_SSL=true` e certifique-se de que o servidor PostgreSQL tem SSL habilitado

### Performance Lenta

Se o banco de dados estiver lento:

1. Aumente `DB_POOL_SIZE` para cerca de 2x o número de núcleos do servidor
2. Verifique se o servidor PostgreSQL está otimizado para a carga esperada
3. Considere adicionar índices às tabelas frequentemente consultadas

---

Para mais informações, consulte a documentação do PostgreSQL em https://www.postgresql.org/docs/