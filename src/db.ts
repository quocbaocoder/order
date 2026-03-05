import Database from 'better-sqlite3';

const db = new Database('restaurant.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT DEFAULT 'General',
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total INTEGER NOT NULL,
    items TEXT NOT NULL, -- JSON string of items
    synced_to_sheets BOOLEAN DEFAULT 0,
    synced_to_telegram BOOLEAN DEFAULT 0
  );
`);

// Migration: Add synced_to_telegram column if missing (for existing databases)
const columns = db.prepare("PRAGMA table_info(orders)").all() as any[];
const hasTelegramColumn = columns.some(col => col.name === 'synced_to_telegram');
if (!hasTelegramColumn) {
  db.prepare('ALTER TABLE orders ADD COLUMN synced_to_telegram BOOLEAN DEFAULT 0').run();
}

// Seed data if empty
const count = db.prepare('SELECT count(*) as count FROM menu_items').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO menu_items (name, price, category) VALUES (?, ?, ?)');
  insert.run('Phở Bò', 50000, 'Món Chính');
  insert.run('Bún Chả', 45000, 'Món Chính');
  insert.run('Nem Rán', 15000, 'Ăn Kèm');
  insert.run('Trà Đá', 5000, 'Đồ Uống');
}

export default db;
