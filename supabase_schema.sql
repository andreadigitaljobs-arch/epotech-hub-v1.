-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Team Activity Logs
CREATE TABLE IF NOT EXISTS actividad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    categoria TEXT NOT NULL, -- Branding, Contenido, Web, CRM, Diseño, Otro
    logros TEXT[] NOT NULL,  -- Array of strings for what was achieved
    siguiente_objetivo TEXT,
    creado_por TEXT DEFAULT 'Equipo Epotech',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Team Notifications (Avisos)
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo TEXT NOT NULL, -- INICIO, CONTENIDO, WEB, etc.
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint TEXT NOT NULL UNIQUE,
    keys_auth TEXT NOT NULL,
    keys_p256dh TEXT NOT NULL,
    user_id TEXT DEFAULT 'sebastian',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE actividad ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for actividad" ON actividad FOR SELECT USING (true);
CREATE POLICY "Allow public read access for notificaciones" ON notificaciones FOR SELECT USING (true);

CREATE POLICY "Allow public insert for actividad" ON actividad FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for notificaciones" ON notificaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for push_subscriptions" ON push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for push_subscriptions" ON push_subscriptions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for push_subscriptions" ON push_subscriptions FOR DELETE USING (true);
