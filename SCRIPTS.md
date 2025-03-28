# Scripts do PC+ E-commerce

Este documento lista todos os scripts disponíveis para gerenciar o projeto PC+ E-commerce.

## Scripts Principais

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npm run start` | Inicia o servidor em modo de produção |
| `npm run check` | Verifica os tipos TypeScript |
| `npm run db:push` | Atualiza o banco de dados com o esquema definido |

## Scripts de Banco de Dados

Os seguintes scripts não estão disponíveis no package.json, mas podem ser executados diretamente:

| Comando | Descrição |
|---------|-----------|
| `node run_db_check.js` | Verifica a conexão com o banco de dados e exibe informações sobre as tabelas |
| `node db_export_import.js export ./backup` | Exporta todos os dados para arquivos JSON na pasta ./backup |
| `node db_export_import.js import ./backup` | Importa dados dos arquivos JSON na pasta ./backup |
| `node create-admin.js` | Cria ou atualiza um usuário com permissões de administrador |

## Scripts Específicos do Supabase

| Comando | Descrição |
|---------|-----------|
| `node generate-supabase-types.js` | Gera tipagens TypeScript a partir da estrutura do banco de dados Supabase |

## Comandos Drizzle ORM

O projeto usa Drizzle ORM para gerenciar o banco de dados:

| Comando | Descrição |
|---------|-----------|
| `npm run db:push` | Atualiza o banco de dados com o esquema definido (drizzle-kit push) |
| `npx drizzle-kit studio` | Inicia uma interface visual para gerenciar o banco de dados |
| `npx drizzle-kit generate:pg` | Gera arquivos de migração a partir do esquema |
| `npx drizzle-kit drop` | Remove todas as tabelas geradas pelo Drizzle (⚠️ Use com cuidado!) |

## Exemplos de Uso

### Verificar Conexão com o Banco de Dados

```bash
node run_db_check.js
```

### Exportar Dados para Backup

```bash
node db_export_import.js export ./meu_backup
```

### Importar Dados de um Backup

```bash
node db_export_import.js import ./meu_backup
```

### Criar um Usuário Administrador

```bash
node create-admin.js
```

### Gerar Tipos do Supabase

```bash
node generate-supabase-types.js
```

## Notas

- Para scripts que não estão no package.json, você precisa executá-los diretamente com `node`.
- Alguns scripts requerem variáveis de ambiente específicas configuradas no arquivo `.env`.
- Ao executar scripts que modificam o banco de dados, tenha cuidado para não perder dados importantes.