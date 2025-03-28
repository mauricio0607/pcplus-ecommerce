/**
 * Configuração centralizada para PC+ E-commerce
 * Este arquivo permite personalizar o comportamento da aplicação
 * em diferentes ambientes (desenvolvimento, produção, etc.)
 */

// Carrega variáveis de ambiente (se não estiverem já disponíveis)
require('dotenv').config();

// Configurações do ambiente
const environment = process.env.NODE_ENV || 'development';

// Configurações do servidor
const serverConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0'
};

// Configurações do banco de dados
const databaseConfig = {
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true',
  connectionPoolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10)
};

// Configurações de segurança
const securityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'jwt-dev-secret-insecure',
  sessionSecret: process.env.SESSION_SECRET || 'session-dev-secret-insecure',
  cookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias em milissegundos
  saltRounds: 10
};

// Configurações do Mercado Pago
const mercadoPagoConfig = {
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
  webhookUrl: process.env.BASE_URL ? `${process.env.BASE_URL}/api/payments/webhook` : null
};

// Configurações de upload
const uploadConfig = {
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10), // 5MB
  allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  directory: process.env.UPLOAD_DIR || './uploads'
};

// Configurações de cache
const cacheConfig = {
  enabled: process.env.CACHE_ENABLED !== 'false',
  ttl: parseInt(process.env.CACHE_TTL || '3600', 10) // 1 hora em segundos
};

// Configurações de email
const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM || 'noreply@pcplus.com.br'
};

// Configurações específicas para cada ambiente
const envConfigs = {
  development: {
    debug: true,
    apiRateLimit: false
  },
  production: {
    debug: false,
    apiRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // máximo de 100 requisições por IP no período
    }
  },
  test: {
    debug: true,
    apiRateLimit: false
  }
};

// Configurações de shipping
const shippingConfig = {
  carriers: [
    {
      id: 'sedex',
      name: 'SEDEX',
      basePrice: 12.5,
      pricePerKg: 1.5,
      additionalDays: 0
    },
    {
      id: 'pac',
      name: 'PAC',
      basePrice: 8.5,
      pricePerKg: 0.8,
      additionalDays: 3
    },
    {
      id: 'express',
      name: 'Entrega Expressa',
      basePrice: 25.0,
      pricePerKg: 2.0,
      additionalDays: -1  // -1 significa entrega no mesmo dia
    }
  ],
  // Fatores de distância por região (multiplicador sobre o preço base)
  distanceFactors: {
    'N': 1.5,  // Norte
    'NE': 1.3, // Nordeste
    'CO': 1.2, // Centro-Oeste
    'SE': 1.0, // Sudeste (região base)
    'S': 1.1   // Sul
  },
  // Tempo estimado de entrega (em dias úteis)
  deliveryTimeByRegion: {
    'N': 7,  // Norte
    'NE': 5, // Nordeste
    'CO': 4, // Centro-Oeste
    'SE': 2, // Sudeste
    'S': 3   // Sul
  }
};

// Configurações administrativas
const adminConfig = {
  defaultEmail: 'admin@pcplus.com.br',
  notificationEmails: (process.env.ADMIN_NOTIFICATION_EMAILS || '').split(',').filter(Boolean),
  ordersPerPage: 20,
  productsPerPage: 50
};

// Configurações de logs
const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  file: process.env.LOG_FILE || '',
  console: true
};

// Exporta todas as configurações
module.exports = {
  env: environment,
  isDev: environment === 'development',
  isProd: environment === 'production',
  isTest: environment === 'test',
  server: serverConfig,
  database: databaseConfig,
  security: securityConfig,
  mercadoPago: mercadoPagoConfig,
  upload: uploadConfig,
  cache: cacheConfig,
  email: emailConfig,
  shipping: shippingConfig,
  admin: adminConfig,
  logging: loggingConfig,
  ...envConfigs[environment]
};