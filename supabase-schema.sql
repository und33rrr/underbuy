DROP POLICY IF EXISTS "Allow all access" ON orders;
DROP POLICY IF EXISTS "Allow all access" ON settings;

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name TEXT DEFAULT '',
    client_username TEXT DEFAULT '',
    delivery_type TEXT DEFAULT 'auto',
    status TEXT DEFAULT 'В пути',
    prepayment_amount REAL DEFAULT 0,
    prepayment_type TEXT DEFAULT 'full',
    full_price_byn REAL DEFAULT 0,
    real_cost_byn REAL DEFAULT 0,
    profit_byn REAL DEFAULT 0,
    client_currency TEXT DEFAULT 'BYN',
    card_used TEXT DEFAULT '',
    track_number TEXT DEFAULT '',
    comment TEXT DEFAULT '',
    price_cny REAL DEFAULT 0,
    weight_kg REAL DEFAULT 0,
    margin_byn REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
    ('rate_cny_client', 0.44),
    ('rate_cny_my', 0.43),
    ('rate_usd_byn', 3.0),
    ('rate_byn_rub', 29.5)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON settings FOR ALL USING (true) WITH CHECK (true);
