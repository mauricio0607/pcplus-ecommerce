# Migrando o PC+ para um Banco de Dados em Produção

Este guia contém instruções detalhadas para migrar o PC+ de um armazenamento em memória para um banco de dados PostgreSQL em produção.

## 1. Escolha do Provedor de Banco de Dados

Para um e-commerce em produção, recomendamos um dos seguintes provedores:

### Neon (Recomendado para começar)
- ✅ Oferece plano gratuito generoso (3 GB)
- ✅ Fácil de configurar
- ✅ Suporte a conexões serverless
- 🌐 Site: [neon.tech](https://neon.tech)

### Supabase
- ✅ Plataforma completa (inclui autenticação, storage)
- ✅ Tem plano gratuito
- ✅ Interface amigável
- 🌐 Site: [supabase.com](https://supabase.com)

### Railway
- ✅ Fácil deploy
- ✅ Bom para projetos mais completos
- ⚠️ Período de avaliação gratuito limitado
- 🌐 Site: [railway.app](https://railway.app)

## 2. Criando o Banco de Dados

### No Neon:

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Anote a string de conexão fornecida

### No Supabase:

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá para "Project Settings" > "Database"
4. Copie a string de conexão

## 3. Executando o Script SQL

Depois de criar seu banco de dados, você precisa criar as tabelas e inserir os dados iniciais.

### Opção 1: Usando a Interface Web

A maioria dos provedores oferece um SQL Editor na interface web:

1. Abra o SQL Editor
2. Cole o conteúdo do arquivo `pcplus_database.sql`
3. Execute o script

### Opção 2: Usando a Linha de Comando

Se você tem o PostgreSQL instalado localmente:

```bash
psql "sua_string_de_conexao" -f pcplus_database.sql
```

## 4. Configurando o Ambiente

### No Replit:

1. Vá para "Tools" > "Secrets"
2. Adicione um novo segredo chamado `DATABASE_URL`
3. Cole sua string de conexão como valor

### Verificando a Conexão

Para verificar se a conexão está funcionando, execute:

```bash
node run_db_check.js
```

## 5. Considerações para Produção

### Segurança

- Restrinja o acesso ao banco de dados apenas aos IPs necessários
- Use senhas fortes e armazene-as de forma segura
- Ative SSL/TLS para conexões ao banco de dados

### Performance

- Configure índices para consultas frequentes (já incluídos no script SQL)
- Monitore o desempenho do banco de dados
- Considere réplicas de leitura para aplicações de maior escala

### Backup

- Configure backups automáticos
- Teste a restauração de backups regularmente
- Para maior segurança, considere backups em localizações diferentes

## 6. Problemas Comuns

### Erro de Conexão

Se encontrar "connection refused":
- Verifique se a string de conexão está correta
- Verifique se o banco de dados está acessível do Replit
- Confirme se o firewall não está bloqueando a conexão

### Tabelas não existem

Se as consultas falharem com "relation does not exist":
- Verifique se o script SQL foi executado com sucesso
- Verifique se você está conectando no banco correto

### Problemas de Performance

Se o aplicativo ficar lento:
- Verifique as consultas que estão sendo executadas
- Adicione índices para campos frequentemente pesquisados
- Otimize as consultas mais pesadas

## 7. Recursos Adicionais

- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação do Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Boas práticas para PostgreSQL](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

Este guia foi criado para ajudar na migração do PC+ para um ambiente de produção. Se precisar de ajuda adicional, consulte a documentação do provedor escolhido ou contate o suporte técnico.