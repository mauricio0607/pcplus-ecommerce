# Guia de Implantação do PC+ E-commerce

Este documento fornece instruções detalhadas para implantar o PC+ E-commerce em diferentes ambientes, desde servidores tradicionais até plataformas em nuvem.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Ambiente](#configuração-do-ambiente)
3. [Banco de Dados](#banco-de-dados)
4. [Implantação do Backend e Frontend](#implantação-do-backend-e-frontend)
5. [Configuração do Servidor Web](#configuração-do-servidor-web)
6. [SSL/TLS e Domínios](#ssltls-e-domínios)
7. [Integração com Mercado Pago](#integração-com-mercado-pago)
8. [Monitoramento e Logs](#monitoramento-e-logs)
9. [Backup e Recuperação](#backup-e-recuperação)
10. [Soluções de Problemas Comuns](#soluções-de-problemas-comuns)
11. [Implantações em Ambientes Específicos](#implantações-em-ambientes-específicos)

## Pré-requisitos

Antes de começar a implantação, certifique-se de ter:

- Node.js 18+ (recomendado: Node.js 20 LTS)
- PostgreSQL 14+
- NPM 8+ ou Yarn 1.22+
- Git
- Servidor Linux (recomendado: Ubuntu 22.04 LTS)
- Um domínio registrado (opcional, mas recomendado para produção)

### Requisitos de Hardware Recomendados

- **Mínimo**: 1 CPU, 2GB RAM, 20GB SSD
- **Recomendado**: 2+ CPUs, 4GB+ RAM, 40GB+ SSD

## Configuração do Ambiente

### 1. Preparar o Servidor

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl git build-essential

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node -v
npm -v

# Instalar PM2 (gerenciador de processos)
sudo npm install -g pm2
```

### 2. Instalar PostgreSQL

```bash
# Adicionar repositório PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Instalar PostgreSQL
sudo apt install -y postgresql-14 postgresql-contrib-14

# Verificar status
sudo systemctl status postgresql
```

### 3. Configurar PostgreSQL

```bash
# Conectar como usuário postgres
sudo -u postgres psql

# Criar usuário e banco de dados
CREATE USER pcplus WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE pcplus OWNER pcplus;
\q

# Configurar autenticação (opcional, para acesso remoto)
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Adicione: host pcplus pcplus 0.0.0.0/0 md5

# Permitir conexões remotas (opcional)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Modifique: listen_addresses = '*'

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

## Banco de Dados

### 1. Obter o Código-fonte

```bash
# Clonar o repositório
git clone https://seu-repositorio/pcplus.git
cd pcplus
```

### 2. Configurar o Banco de Dados

```bash
# Criar as tabelas a partir do arquivo SQL
sudo -u postgres psql -d pcplus -f pcplus_database.sql

# OU use o script de migração automatizado
npm run db:push
```

### 3. Importar Dados (Opcional)

Se você tiver um backup de outro ambiente:

```bash
node db_export_import.js import ./caminho/para/backup
```

## Implantação do Backend e Frontend

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar com suas configurações
nano .env
```

Certifique-se de definir as seguintes variáveis críticas:

- `NODE_ENV=production`
- `DATABASE_URL` com a string de conexão correta
- `SESSION_SECRET` e `JWT_SECRET` com valores seguros e únicos
- `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_PUBLIC_KEY` com suas credenciais

### 2. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install

# Instalar dependências de produção apenas (opcional)
npm install --production
```

### 3. Compilar o Frontend

```bash
# Construir o frontend otimizado
npm run build
```

### 4. Iniciar o Servidor com PM2

```bash
# Iniciar o servidor
pm2 start server.js --name pcplus

# Configurar inicialização automática
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u seu_usuario --hp /home/seu_usuario
pm2 save

# Verificar status
pm2 status
pm2 logs pcplus
```

## Configuração do Servidor Web

Recomendamos usar Nginx como proxy reverso para o aplicativo Node.js.

### 1. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 2. Configurar Nginx como Proxy Reverso

```bash
sudo nano /etc/nginx/sites-available/pcplus
```

Adicione a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Aumentar o limite de tamanho de upload (se necessário)
    client_max_body_size 10M;
}
```

Ative a configuração:

```bash
sudo ln -s /etc/nginx/sites-available/pcplus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/TLS e Domínios

### 1. Configurar SSL com Certbot (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Verificar renovação automática
sudo certbot renew --dry-run
```

### 2. Configurar Redirecionamento HTTPS

O Certbot geralmente atualiza a configuração do Nginx automaticamente. Verifique:

```bash
sudo nano /etc/nginx/sites-available/pcplus
```

A configuração deve incluir redirecionamento HTTPS:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name seudominio.com www.seudominio.com;
    
    # Configurações SSL (adicionadas pelo Certbot)
    
    location / {
        proxy_pass http://localhost:5000;
        # Outras configurações de proxy
    }
}
```

## Integração com Mercado Pago

### 1. Configurar Conta do Mercado Pago

1. Crie uma conta em [Mercado Pago](https://www.mercadopago.com.br)
2. Acesse o [Dashboard de Desenvolvedores](https://www.mercadopago.com.br/developers)
3. Crie uma aplicação para obter as credenciais de API

### 2. Configurar Credenciais

Adicione suas credenciais ao arquivo `.env`:

```
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token
MERCADO_PAGO_PUBLIC_KEY=sua_public_key
```

### 3. Configurar Webhooks (Para Notificações de Pagamento)

No painel de desenvolvedor do Mercado Pago, configure a URL de webhook:

```
https://seudominio.com/api/payments/webhook
```

## Monitoramento e Logs

### 1. Monitoramento com PM2

```bash
# Ver logs em tempo real
pm2 logs pcplus

# Monitorar uso de recursos
pm2 monit

# Estatísticas web (opcional)
pm2 install pm2-server-monit
pm2 install pm2-logrotate
```

### 2. Configuração de Logs

Os logs são armazenados em:

- Logs do aplicativo: `~/.pm2/logs/pcplus-out.log` e `~/.pm2/logs/pcplus-error.log`
- Logs do Nginx: `/var/log/nginx/access.log` e `/var/log/nginx/error.log`
- Logs do PostgreSQL: `/var/log/postgresql/postgresql-14-main.log`

### 3. Monitoramento Avançado (Opcional)

```bash
# Instalar e configurar Prometheus + Grafana (opcional)
# Instruções detalhadas: https://prometheus.io/docs/prometheus/latest/installation/
```

## Backup e Recuperação

### 1. Backup do Banco de Dados

Configurar backup automático:

```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-pcplus.sh
```

Conteúdo do script:

```bash
#!/bin/bash
BACKUP_DIR="/backup/pcplus/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Backup da base de dados
sudo -u postgres pg_dump pcplus > $BACKUP_DIR/pcplus.sql

# Backup usando o utilitário de exportação
cd /caminho/para/pcplus
node db_export_import.js export $BACKUP_DIR

# Comprimir
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

# Limpar backups antigos (manter últimos 7 dias)
find /backup/pcplus -type f -name "*.tar.gz" -mtime +7 -delete
```

Tornar executável e agendar:

```bash
sudo chmod +x /usr/local/bin/backup-pcplus.sh
sudo crontab -e
```

Adicionar ao crontab:

```
0 2 * * * /usr/local/bin/backup-pcplus.sh
```

### 2. Restauração

```bash
# Descomprimir o backup
tar -xzf backup-pcplus-2023-12-25.tar.gz

# Restaurar o banco de dados
sudo -u postgres psql -d pcplus -f backup-pcplus-2023-12-25/pcplus.sql

# OU usar o utilitário de importação
node db_export_import.js import backup-pcplus-2023-12-25
```

## Soluções de Problemas Comuns

### Servidor não inicia

Verifique os logs:

```bash
pm2 logs pcplus
```

Problemas comuns:
- Porta 5000 já em uso (mude a porta no .env)
- Erro de conexão com banco de dados (verifique credenciais)
- Erro de versão do Node.js (use nvm para atualizar)

### Problemas de Banco de Dados

```bash
# Verificar status do PostgreSQL
sudo systemctl status postgresql

# Verificar logs
sudo tail -100 /var/log/postgresql/postgresql-14-main.log

# Testar conexão
psql -U pcplus -h localhost -d pcplus
```

### Problemas de Certificado SSL

```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew
```

## Implantação com Supabase

O PC+ E-commerce pode ser configurado para usar o Supabase como backend, simplificando significativamente a implantação.

### Configuração do Supabase

1. **Criar conta e projeto**:
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Crie um novo projeto, selecionando a região mais próxima de seus usuários
   - Anote a URL do projeto e as chaves de API (encontradas em Configurações > API)

2. **Configuração do Banco de Dados**:
   - A estrutura do banco será criada automaticamente pela aplicação
   - Opcionalmente, você pode criar as tabelas manualmente via Editor SQL no painel do Supabase

3. **Configuração de Autenticação**:
   - O PC+ usa autenticação personalizada, portanto não é necessário configurar os provedores de autenticação do Supabase

4. **Configuração de Permissões**:
   - No painel do Supabase, acesse o Editor SQL
   - Execute o script de configuração de permissões RLS (Row Level Security):

```sql
-- Configurar políticas de acesso por função
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Repetir para outras tabelas conforme necessário

-- Permitir leitura para todos os usuários em tabelas públicas
CREATE POLICY "Produtos são visíveis para todos" ON products FOR SELECT USING (true);
CREATE POLICY "Categorias são visíveis para todos" ON categories FOR SELECT USING (true);

-- Permitir acesso administrativo completo
CREATE POLICY "Acesso total para administradores" ON products 
FOR ALL USING (auth.jwt() -> 'role' = 'admin');
-- Repetir para outras tabelas conforme necessário
```

### Variáveis de Ambiente para Supabase

```
STORAGE_TYPE=supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-chave-service-role
```

### Migração de Dados para Supabase

Se você já possui dados em um banco PostgreSQL local:

1. Exporte os dados usando a ferramenta de exportação:
   ```bash
   node db_export_import.js export ./backup_supabase
   ```

2. Configure as variáveis de ambiente para o Supabase

3. Importe os dados para o Supabase:
   ```bash
   node db_export_import.js import ./backup_supabase
   ```

## Implantações em Ambientes Específicos

### AWS

1. EC2:
   - Crie uma instância t3.small (ou maior) com Ubuntu 22.04
   - Configure o Security Group para permitir portas 22, 80, 443
   - Configure um Elastic IP
   - Siga as instruções acima para configurar o servidor

2. RDS (opcional, para banco de dados gerenciado):
   - Crie uma instância RDS PostgreSQL
   - Configure o Security Group para permitir conexões da instância EC2
   - Use a string de conexão do RDS em seu arquivo .env
   
3. Supabase (alternativa a RDS):
   - Use o Supabase como explicado acima
   - Configure `STORAGE_TYPE=supabase` nas variáveis de ambiente

### Google Cloud Platform

1. Compute Engine:
   - Crie uma VM e2-medium (ou maior) com Ubuntu 22.04
   - Configure o firewall para permitir portas 22, 80, 443
   - Configure um IP estático
   - Siga as instruções acima para configurar o servidor

2. Cloud SQL (opcional, para banco de dados gerenciado):
   - Crie uma instância PostgreSQL
   - Configure o acesso para permitir conexões da VM
   - Use a string de conexão do Cloud SQL em seu arquivo .env

### Digital Ocean (Droplet)

1. Crie um Droplet:
   - Tamanho: Basic (4GB RAM, 2 vCPUs, 80GB SSD)
   - Região: próxima aos seus clientes
   - SO: Ubuntu 22.04
   - Adicione sua chave SSH
   - Siga as instruções acima para configurar o servidor

2. Managed Database (opcional):
   - Crie um cluster PostgreSQL
   - Configure o firewall para permitir conexões do Droplet
   - Use a string de conexão fornecida em seu arquivo .env

---

## Considerações Finais

- Considere implementar uma estratégia de CI/CD para automatizar implantações
- Monitore regularmente o uso de recursos e escale conforme necessário
- Atualize regularmente dependências para garantir segurança
- Faça testes de carga antes de lançar para produção
- Implemente uma solução de CDN para conteúdo estático em ambientes de alto tráfego

Para qualquer problema durante a implantação, consulte o repositório de problemas ou entre em contato com o suporte técnico.

---

Última atualização: 28 de março de 2025