/**
 * Servidor de produção para PC+ E-commerce
 * Este script inicia a aplicação em ambiente de produção
 */

// Carrega variáveis de ambiente
require('dotenv').config();

// Importa as dependências
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const compression = require('compression');

// Configuração
const config = require('./config');
const PORT = config.server.port;
const HOST = config.server.host;

// Inicializa o aplicativo Express
const app = express();

// Configurações de segurança para produção
if (config.env === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://sdk.mercadopago.com", "https://secure.mlstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'", "https://api.mercadopago.com"],
        frameSrc: ["'self'", "https://www.mercadopago.com.br"],
      },
    },
  }));
  app.use(compression());
}

// Middleware para logging
if (config.env === 'production') {
  const logDirectory = path.join(__dirname, 'logs');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Configuração do banco de dados
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  max: config.database.connectionPoolSize,
});

// Middleware para parsing do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: config.security.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.env === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
  }
}));

// Servir arquivos estáticos do client/dist (compilado pelo Vite)
app.use(express.static(path.join(__dirname, 'client/dist')));

// Rotas da API
// Importar e registrar as rotas da API 
require('./server/routes').registerRoutes(app)
  .then(httpServer => {
    // Iniciar o servidor HTTP
    httpServer.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao registrar rotas:', err);
    process.exit(1);
  });

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor',
    error: config.env === 'development' ? err.message : undefined
  });
});

// Direciona todas as rotas não encontradas para o frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Manipulação de saída graciosa
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Encerrando o servidor graciosamente...');
  
  // Fecha o pool do PostgreSQL
  pool.end()
    .then(() => {
      console.log('Conexões com o banco de dados encerradas.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erro ao encerrar conexões com o banco de dados:', err);
      process.exit(1);
    });
}