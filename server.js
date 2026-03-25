import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// رسالة ترحيبية للتأكد أن الرابط يعمل
app.get("/", (req, res) => {
  res.send("السيرفر يعمل بنجاح! جاهز لاستقبال الطلبات.");
});

// حفظ الطلبات
app.post("/orders", (req, res) => {
  orders.push({ ...req.body, id: Date.now() });
  res.json({ success: true, message: "تم حفظ الطلب بنجاح" });
});

// عرض الطلبات
app.get("/orders", (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));