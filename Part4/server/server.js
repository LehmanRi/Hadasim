const express = require("express");
const cors = require("cors");
const { db,   insertUser, insertSupplier,  insertProduct, insertOrder, 
    insertOrderItem, getUserByName,getOrderItemsByOrderId,
    getAllOrders, getAllSuppliers,  getOrdersBySupplierId,getProductsBySupplierId, updateOrderStatus } = require('./database.js'); 
const app = express();
const port = 5000;


app.use(cors({
  origin: "http://localhost:3000", 
}));

app.use(express.json()); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//
app.post('/api/users', (req, res) => {
    const { name, password, type } = req.body;
    insertUser(name, password, type, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: result.id });
    });
  });
  
//
  app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }
  
    getUserByName(name, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }
  
      res.status(200).json({ id: user.id, name: user.name, type: user.type });
    });
  });
  
  
//
  app.post('/api/suppliers', (req, res) => {
    const { id,companyName, phoneNumber, representativeName } = req.body;
    insertSupplier(id,companyName, phoneNumber, representativeName, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: result.id });
    });
  });
  
//
  app.post('/api/products', (req, res) => {
    const { products } = req.body;
  
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products must be a non-empty array" });
    }
  
    let completed = 0;
    let hasError = false;
  
    products.forEach((product) => {
      const { supplierId, name, pricePerItem, minQuantity } = product;
  
      if (!supplierId || !name || pricePerItem == null || minQuantity == null) {
        hasError = true;
        return res.status(400).json({ error: "All fields are required for each product" });
      }
  
      insertProduct(supplierId, name, pricePerItem, minQuantity, (err, result) => {
        if (hasError) return; 
  
        if (err) {
          hasError = true;
          return res.status(500).json({ error: err.message });
        }
  
        completed++;
        if (completed === products.length) {
          res.status(201).json({ message: "All products inserted successfully" });
        }
      });
    });
  });
  
//
  app.post('/api/orders', (req, res) => {
    const { supplierId, status, totalPrice, orderItems } = req.body;
  
    if (!supplierId || !status || !totalPrice || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: "Missing fields or empty orderItems" });
    }
  
    insertOrder(supplierId, status, totalPrice, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
  
      const orderId = result.id;
      let completed = 0;
      let hasError = false;
  
      orderItems.forEach((item) => {
        const { productId, quantity, price } = item;
  
        if (!productId || !quantity || price == null) {
          hasError = true;
          return res.status(400).json({ error: "Invalid order item data" });
        }
  
        insertOrderItem(orderId, productId, quantity, price, (err) => {
          if (hasError) return;
          if (err) {
            hasError = true;
            return res.status(500).json({ error: "Failed to insert order item: " + err.message });
          }
  
          completed++;
          if (completed === orderItems.length) {
            res.status(201).json({ message: "Order and items inserted", orderId });
          }
        });
      });
    });
  });
  
  //
app.get('/api/orders', (req, res) => {
    getAllOrders(async (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
  
      try {
        const ordersWithItems = await Promise.all(
          orders.map((order) => {
            return new Promise((resolve, reject) => {
              getOrderItemsByOrderId(order.id, (err, items) => {
                if (err) return reject(err);
                order.items = items;
                resolve(order);
              });
            });
          })
        );
        res.json(ordersWithItems);
      } catch (err) {
        res.status(500).json({ error: "Failed to load order items: " + err.message });
      }
    });
  });
  //
  app.get('/api/suppliers', (req, res) => {
    getAllSuppliers((err, suppliers) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(suppliers);
    });
  });
//
  app.get('/api/orders/by-supplier/:supplierId', async (req, res) => {
    getOrdersBySupplierId(req.params.supplierId, async (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
  
      try {
        const ordersWithItems = await Promise.all(
          orders.map((order) => {
            return new Promise((resolve, reject) => {
              getOrderItemsByOrderId(order.id, (err, items) => {
                if (err) return reject(err);
                order.items = items;
                resolve(order);
              });
            });
          })
        );
  
        res.json(ordersWithItems);
      } catch (err) {
        res.status(500).json({ error: "Failed to load order items: " + err.message });
      }
    });
  });
  
//
  app.put('/api/orders/:orderId/status', (req, res) => {
    const { newStatus } = req.body;
    updateOrderStatus(req.params.orderId, newStatus, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(200).json({ updated: result.changes > 0 });
    });
  });
  
  //
  app.get('/api/products/by-supplier/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;
    getProductsBySupplierId(supplierId, (err, products) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(products);
    });
  });