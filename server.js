const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('orders.db');
const PORT = 3000;

// Создаем таблицу, если ее нет
db.prepare(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    client_username TEXT,
    prepayment REAL,
    full_price_byn REAL,
    delivery_method TEXT,
    track_number TEXT,
    status TEXT DEFAULT 'Создан',
    comment TEXT,
    card_used TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// API: Добавить заказ
app.post('/api/orders', (req, res) => {
    const { product_name, client_username, prepayment, full_price_byn, delivery_method, track_number, status, comment, card_used } = req.body;
    
    const stmt = db.prepare(`INSERT INTO orders (product_name, client_username, prepayment, full_price_byn, delivery_method, track_number, status, comment, card_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(product_name, client_username, prepayment, full_price_byn, delivery_method, track_number, status || 'Создан', comment, card_used);
    
    res.json({ id: info.lastInsertRowid });
});

// API: Получить все заказы (или поиск)
app.get('/api/orders', (req, res) => {
    const { search } = req.query;
    let orders;
    if (search) {
        orders = db.prepare(`SELECT * FROM orders WHERE 
            product_name LIKE ? OR 
            client_username LIKE ? OR 
            track_number LIKE ? OR
            comment LIKE ? OR
            card_used LIKE ?
        ORDER BY created_at DESC`).all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    } else {
        orders = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`).all();
    }
    res.json(orders);
});

// API: Обновить заказ
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { product_name, client_username, prepayment, full_price_byn, delivery_method, track_number, status, comment, card_used } = req.body;
    
    db.prepare(`UPDATE orders SET 
        product_name = ?, 
        client_username = ?, 
        prepayment = ?, 
        full_price_byn = ?, 
        delivery_method = ?, 
        track_number = ?, 
        status = ?, 
        comment = ?,
        card_used = ?
    WHERE id = ?`).run(product_name, client_username, prepayment, full_price_byn, delivery_method, track_number, status, comment, card_used, id);
    
    res.json({ success: true });
});

// API: Удалить заказ
app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    db.prepare(`DELETE FROM orders WHERE id = ?`).run(id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен! Открой браузер и перейди на http://localhost:${PORT}`);
});