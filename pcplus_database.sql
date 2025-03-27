-- PC+ E-commerce Database Setup
-- Este script cria as tabelas necessárias para o e-commerce PC+

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'customer',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "compare_at_price" DECIMAL(10, 2),
  "cost_price" DECIMAL(10, 2),
  "sku" TEXT,
  "barcode" TEXT,
  "inventory_quantity" INTEGER NOT NULL DEFAULT 0,
  "weight" DECIMAL(10, 2),
  "category_id" INTEGER REFERENCES "categories"("id"),
  "image_url" TEXT,
  "featured" BOOLEAN DEFAULT FALSE,
  "specs" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Imagens de Produtos
CREATE TABLE IF NOT EXISTS "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "alt" TEXT,
  "position" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id"),
  "status" TEXT NOT NULL DEFAULT 'pending',
  "total" DECIMAL(10, 2) NOT NULL,
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "shipping_fee" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "tax" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "discount" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "shipping_address" JSONB,
  "billing_address" JSONB,
  "payment_method" TEXT,
  "payment_status" TEXT DEFAULT 'pending',
  "notes" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens de Pedido
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "total" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Endereços
CREATE TABLE IF NOT EXISTS "addresses" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "complement" TEXT,
  "neighborhood" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'Brasil',
  "phone" TEXT,
  "is_default" BOOLEAN DEFAULT FALSE,
  "type" TEXT DEFAULT 'shipping',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lista de Desejos
CREATE TABLE IF NOT EXISTS "wishlist" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("user_id", "product_id")
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "title" TEXT,
  "comment" TEXT NOT NULL,
  "published" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT DEFAULT 'info',
  "read" BOOLEAN DEFAULT FALSE,
  "data" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Menu
CREATE TABLE IF NOT EXISTS "menu_items" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "parent_id" INTEGER REFERENCES "menu_items"("id") ON DELETE CASCADE,
  "position" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserções iniciais de dados

-- Inserir Usuário Admin
INSERT INTO "users" ("name", "email", "password", "role")
VALUES ('Admin', 'admin@pcplus.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.OoxSs1FcqRMoHlX.DoPQYnZLCehA8Oa', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir Categorias
INSERT INTO "categories" ("name", "slug", "description", "image_url")
VALUES 
  ('Computadores', 'computadores', 'Desktops e notebooks para todas as necessidades', 'https://via.placeholder.com/800x600'),
  ('Periféricos', 'perifericos', 'Teclados, mouses, headsets e mais', 'https://via.placeholder.com/800x600'),
  ('Hardware', 'hardware', 'Componentes para montar ou atualizar seu PC', 'https://via.placeholder.com/800x600'),
  ('Gaming', 'gaming', 'Produtos especiais para gamers', 'https://via.placeholder.com/800x600'),
  ('Rede', 'rede', 'Produtos para conectividade e redes', 'https://via.placeholder.com/800x600')
ON CONFLICT (slug) DO NOTHING;

-- Inserir Produtos
INSERT INTO "products" ("name", "slug", "description", "price", "compare_at_price", "inventory_quantity", "category_id", "image_url", "featured", "specs")
VALUES 
  ('Notebook Pro X', 'notebook-pro-x', 'Notebook de alto desempenho para profissionais', 5999.99, 6999.99, 100, 1, 'https://via.placeholder.com/800x600', TRUE, '{"processador": "Intel Core i7", "memoria": "16GB", "armazenamento": "512GB SSD"}'),
  ('PC Gamer Elite', 'pc-gamer-elite', 'Computador para jogos de última geração', 7999.99, 8999.99, 50, 1, 'https://via.placeholder.com/800x600', TRUE, '{"processador": "AMD Ryzen 9", "memoria": "32GB", "armazenamento": "1TB SSD"}'),
  ('Monitor UltraWide 29"', 'monitor-ultrawide-29', 'Monitor ultrawide para maior produtividade', 1999.99, 2299.99, 75, 2, 'https://via.placeholder.com/800x600', TRUE, '{"resolucao": "2560x1080", "taxa_atualizacao": "75Hz", "tempo_resposta": "5ms"}'),
  ('Teclado Mecânico RGB', 'teclado-mecanico-rgb', 'Teclado gamer com switches mecânicos', 399.99, 499.99, 200, 2, 'https://via.placeholder.com/800x600', FALSE, '{"tipo_switch": "Blue", "layout": "ABNT2", "iluminacao": "RGB"}'),
  ('Placa de Vídeo RTX 4070', 'placa-de-video-rtx-4070', 'GPU de última geração para jogos e trabalho', 4999.99, 5499.99, 30, 3, 'https://via.placeholder.com/800x600', TRUE, '{"memoria": "12GB GDDR6", "interface": "PCIe 4.0", "conectores": "3x DisplayPort, 1x HDMI"}'),
  ('Cadeira Gamer Pro', 'cadeira-gamer-pro', 'Cadeira confortável para longas sessões', 999.99, 1299.99, 60, 4, 'https://via.placeholder.com/800x600', FALSE, '{"material": "Couro sintético", "reclinacao": "180°", "suporta_ate": "150kg"}'),
  ('Roteador Mesh Wi-Fi 6', 'roteador-mesh-wifi-6', 'Sistema de Wi-Fi para toda a casa', 799.99, 999.99, 45, 5, 'https://via.placeholder.com/800x600', FALSE, '{"velocidade": "3000Mbps", "cobertura": "até 230m²", "conexoes": "1x WAN, 3x LAN"}')
ON CONFLICT (slug) DO NOTHING;

-- Inserir Imagens de Produtos
INSERT INTO "product_images" ("product_id", "url", "alt", "position")
VALUES 
  (1, 'https://via.placeholder.com/800x600?text=Notebook+Pro+X+1', 'Notebook Pro X - Vista frontal', 1),
  (1, 'https://via.placeholder.com/800x600?text=Notebook+Pro+X+2', 'Notebook Pro X - Vista lateral', 2),
  (1, 'https://via.placeholder.com/800x600?text=Notebook+Pro+X+3', 'Notebook Pro X - Vista do teclado', 3),
  (2, 'https://via.placeholder.com/800x600?text=PC+Gamer+Elite+1', 'PC Gamer Elite - Vista frontal', 1),
  (2, 'https://via.placeholder.com/800x600?text=PC+Gamer+Elite+2', 'PC Gamer Elite - Vista interna', 2),
  (3, 'https://via.placeholder.com/800x600?text=Monitor+UltraWide+1', 'Monitor UltraWide - Vista frontal', 1),
  (3, 'https://via.placeholder.com/800x600?text=Monitor+UltraWide+2', 'Monitor UltraWide - Vista lateral', 2),
  (4, 'https://via.placeholder.com/800x600?text=Teclado+RGB+1', 'Teclado Mecânico RGB - Vista superior', 1),
  (5, 'https://via.placeholder.com/800x600?text=RTX+4070+1', 'Placa de Vídeo RTX 4070 - Vista frontal', 1),
  (6, 'https://via.placeholder.com/800x600?text=Cadeira+Gamer+1', 'Cadeira Gamer Pro - Vista frontal', 1),
  (7, 'https://via.placeholder.com/800x600?text=Roteador+Mesh+1', 'Roteador Mesh Wi-Fi 6 - Vista superior', 1)
ON CONFLICT DO NOTHING;

-- Inserir Itens de Menu
INSERT INTO "menu_items" ("name", "slug", "url", "position")
VALUES 
  ('Home', 'home', '/', 1),
  ('Produtos', 'produtos', '/produtos', 2),
  ('Categorias', 'categorias', '/categorias', 3),
  ('Ofertas', 'ofertas', '/ofertas', 4),
  ('Sobre', 'sobre', '/sobre', 5),
  ('Contato', 'contato', '/contato', 6)
ON CONFLICT DO NOTHING;

-- Inserir Subcategorias no Menu
INSERT INTO "menu_items" ("name", "slug", "url", "parent_id", "position")
VALUES 
  ('Computadores', 'computadores', '/categoria/computadores', 3, 1),
  ('Periféricos', 'perifericos', '/categoria/perifericos', 3, 2),
  ('Hardware', 'hardware', '/categoria/hardware', 3, 3),
  ('Gaming', 'gaming', '/categoria/gaming', 3, 4),
  ('Rede', 'rede', '/categoria/rede', 3, 5)
ON CONFLICT DO NOTHING;

-- Inserir Reviews de Exemplo
INSERT INTO "reviews" ("user_id", "product_id", "rating", "title", "comment", "published")
VALUES 
  (1, 1, 5, 'Excelente notebook!', 'Comprei para trabalho e atendeu todas as minhas expectativas. Super rápido e com bateria duradoura.', TRUE),
  (1, 3, 4, 'Ótimo monitor para trabalho', 'O formato ultrawide aumentou muito minha produtividade. A qualidade da imagem é excelente.', TRUE),
  (1, 4, 5, 'Teclado sensacional', 'As teclas têm resposta tátil perfeita e a iluminação RGB é linda. Recomendo!', TRUE)
ON CONFLICT DO NOTHING;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON "products"("category_id");
CREATE INDEX IF NOT EXISTS idx_products_featured ON "products"("featured");
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "order_items"("order_id");
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON "reviews"("product_id");
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON "wishlist"("user_id");
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON "menu_items"("parent_id");