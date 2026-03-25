const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'orders.json');

function loadOrders() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('خطأ في قراءة الملف:', err);
    }
    return [];
}

function saveOrders(orders) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
    } catch (err) {
        console.error('خطأ في حفظ الملف:', err);
    }
}

app.get('/orders', (req, res) => {
    const orders = loadOrders();
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const orders = loadOrders();
    const newOrder = {
        id: Date.now().toString(),
        ...req.body,
        status: req.body.status || 'pending',
        createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    saveOrders(orders);
    res.status(201).json(newOrder);
});

// ✅ نقطة نهاية جديدة لتحديث الحالة
app.put('/orders/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const orders = loadOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    saveOrders(orders);
    res.json(orders[index]);
});

// ✅ نقطة نهاية جديدة للحذف
app.delete('/orders/:id', (req, res) => {
    const id = req.params.id;
    let orders = loadOrders();
    const newOrders = orders.filter(o => o.id !== id);
    if (newOrders.length === orders.length) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    saveOrders(newOrders);
    res.status(204).send();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل على المنفذ ${PORT}`);
});
