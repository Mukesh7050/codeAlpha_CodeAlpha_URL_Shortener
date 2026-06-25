require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
});

// Home Route
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Professional URL Shortener API Running 🚀"
    });
});

// Routes
app.use("/", require("./routes/urlRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running: http://localhost:${PORT}`);
});