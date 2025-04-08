const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error('Database connection error:', err.message);
  }
  console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  type TEXT CHECK(type IN ('supplier', 'owner')) NOT NULL
)`, (err) => {
  if (err) {
    return console.error('Failed to create users table:', err.message);
  }
  db.run(
    `INSERT OR IGNORE INTO users (name, password, type) VALUES (?, ?, ?)`,
    ['admin', 'admin', 'owner'],
    (err) => {
      if (err) {
        console.error('Failed to insert admin user:', err.message);
      } else {
        console.log('Admin user ensured in DB');
      }
    }
  );
});
db.run(`CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  representative_name TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price_per_item REAL NOT NULL,
  min_quantity INTEGER NOT NULL,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
)`);

db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Created', 'In Process', 'Completed')) NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
  )`);

db.run(`CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
)`);


function insertUser(name, password, type, callback) {
  const sql = `INSERT INTO users (name, password, type) VALUES (?, ?, ?)`;
  db.run(sql, [name, password, type], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID });
  });
}

function insertSupplier(id, companyName, phoneNumber, representativeName, callback) {
  const sql = `INSERT INTO suppliers (id, company_name, phone_number, representative_name) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id, companyName, phoneNumber, representativeName], function (err) {
    if (err) return callback(err);
    callback(null, { id });
  });
}

function insertProduct(supplierId, name, pricePerItem, minQuantity, callback) {
  const sql = `INSERT INTO products (supplier_id, name, price_per_item, min_quantity) VALUES (?, ?, ?, ?)`;
  db.run(sql, [supplierId, name, pricePerItem, minQuantity], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID });
  });
}

function insertOrder(supplierId, status, totalPrice, callback) {
    const sql = `INSERT INTO orders (supplier_id, status, total_price) VALUES (?, ?, ?)`;
    db.run(sql, [supplierId, status, totalPrice], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID });
    });
  }

function insertOrderItem(orderId, productId, quantity, price, callback) {
  const sql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
  db.run(sql, [orderId, productId, quantity, price], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID });
  });
}

  function getUserByName(name, callback) {
    db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

 function getOrderItemsByOrderId(orderId, callback) {
    const sql = `
      SELECT 
        order_items.id,
        order_items.product_id,
        products.name AS product_name,
        order_items.quantity,
        order_items.price
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
    `;
    db.all(sql, [orderId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  function getAllOrders(callback) {
    const sql = `
      SELECT 
        orders.*, 
        suppliers.company_name 
      FROM orders
      JOIN suppliers ON orders.supplier_id = suppliers.id
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  function getAllSuppliers(callback) {
    const sql = `SELECT * FROM suppliers`;
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  function getOrdersBySupplierId(supplierId, callback) {
    const sql = `SELECT * FROM orders WHERE supplier_id = ?`;
    db.all(sql, [supplierId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }
  function getProductsBySupplierId(supplierId, callback) {
    const sql = `SELECT * FROM products WHERE supplier_id = ?`;
    db.all(sql, [supplierId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  function updateOrderStatus(orderId, newStatus, callback) {
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.run(sql, [newStatus, orderId], function (err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  }

module.exports = {
  db,
  insertUser,
  insertSupplier,
  insertProduct,
  insertOrder,
  insertOrderItem,
  getUserByName,
  getOrderItemsByOrderId,
  getAllOrders,
  getAllSuppliers,
  getOrdersBySupplierId,
  getProductsBySupplierId,
  updateOrderStatus
};
