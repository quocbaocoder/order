import 'dotenv/config';
import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db";
import { appendOrderToSheet } from "./src/services/sheets";
import { sendOrderToTelegram } from "./src/services/telegram";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Get Menu
  app.get("/api/menu", (req, res) => {
    try {
      const items = db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  // Add Menu Item
  app.post("/api/menu", (req, res) => {
    try {
      const { name, price, category, image_url } = req.body;
      const stmt = db.prepare('INSERT INTO menu_items (name, price, category, image_url) VALUES (?, ?, ?, ?)');
      const info = stmt.run(name, price, category || 'General', image_url);
      res.json({ id: info.lastInsertRowid, name, price, category, image_url });
    } catch (error) {
      res.status(500).json({ error: "Failed to add item" });
    }
  });

  // Update Menu Item
  app.put("/api/menu/:id", (req, res) => {
    try {
      const { name, price, category, image_url } = req.body;
      const { id } = req.params;
      const stmt = db.prepare('UPDATE menu_items SET name = ?, price = ?, category = ?, image_url = ? WHERE id = ?');
      stmt.run(name, price, category, image_url, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // Delete Menu Item
  app.delete("/api/menu/:id", (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
      stmt.run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Create Order
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, total } = req.body;
      const itemsJson = JSON.stringify(items);
      
      const stmt = db.prepare('INSERT INTO orders (total, items) VALUES (?, ?)');
      const info = stmt.run(total, itemsJson);
      
      const orderId = info.lastInsertRowid;
      const order = {
        id: orderId,
        created_at: new Date().toISOString(),
        total,
        items
      };

      // Try syncing to Google Sheets and Telegram
      const [syncedSheets, syncedTelegram] = await Promise.all([
        appendOrderToSheet(order),
        sendOrderToTelegram(order)
      ]);
      
      if (syncedSheets) {
        db.prepare('UPDATE orders SET synced_to_sheets = 1 WHERE id = ?').run(orderId);
      }

      if (syncedTelegram) {
        db.prepare('UPDATE orders SET synced_to_telegram = 1 WHERE id = ?').run(orderId);
      }

      res.json({ success: true, orderId, syncedSheets, syncedTelegram });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
