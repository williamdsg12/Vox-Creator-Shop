-- Vox Creator Shop Database Schema (PostgreSQL / Supabase)

-- Habilitar UUID extensão
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Planos
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    interval VARCHAR(20) DEFAULT 'monthly',
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed de Planos Iniciais
INSERT INTO plans (id, name, price, interval, features, is_active)
VALUES 
    ('pro', 'Vox PRO', 147.00, 'monthly', '["Copiloto IA Ilimitado", "Teleprompter Inteligente", "Radar de Produtos em Alta", "Solicitador de Amostras Grátis", "Suporte VIP no WhatsApp"]', TRUE),
    ('ultra', 'Vox ULTRA', 297.00, 'monthly', '["Tudo do plano PRO", "Múltiplas Contas TikTok Shop", "Extensão OS Chrome Enterprise", "Relatórios de ROAS/CPA Avançados", "Consultoria Quinzenal em Grupo"]', TRUE)
ON CONFLICT (id) DO UPDATE SET 
    price = EXCLUDED.price,
    features = EXCLUDED.features;

-- 3. Tabela de Licenças
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('ativo', 'trial', 'expirado', 'cancelado')),
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    expires_at TIMESTAMP WITH TIME ZONE,
    credits_remaining INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Assinaturas (Stripe / Mercado Pago)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES plans(id),
    provider VARCHAR(50) DEFAULT 'stripe',
    provider_customer_id VARCHAR(255),
    provider_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Produtos no Radar
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL,
    gmv VARCHAR(50) NOT NULL,
    weekly_growth INT NOT NULL,
    sales_today INT NOT NULL,
    sales_yesterday INT NOT NULL,
    score_ia INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Configurações da Plataforma & Landing Media
CREATE TABLE IF NOT EXISTS landing_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO landing_settings (key, value)
VALUES 
    ('hero_video_url', '"https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-showing-clothing-41566-large.mp4"')
ON CONFLICT (key) DO NOTHING;

-- 7. Logs de Auditoria do Admin
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_score_ia ON products(score_ia DESC);
