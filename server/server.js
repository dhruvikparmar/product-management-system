const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();


const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const saleRoutes = require("./routes/saleRoutes");
const stockHistoryRoutes = require("./routes/stockHistoryRoutes");
const estimateRoutes = require("./routes/estimateRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://product-admin-panel-g93s.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());
app.use(express.json());


// Brand Routes
app.use("/api/brands", brandRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Sale Routes
app.use("/api/sales", saleRoutes);

// Stock History Routes
app.use(
  "/api/stock-history",
  stockHistoryRoutes
);

// Estimate Routes
app.use(
  "/api/estimates",
  estimateRoutes
);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});