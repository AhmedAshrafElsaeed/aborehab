const express = require("express");
const mongoose = require('mongoose');
const productModel = require("./p.model");
//connection string from mongodb 
const uri = "mongodb+srv://ahmedmqassem2004:1234@cluster0.ezkccta.mongodb.net/os-sec?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log("connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());

// Get all products
app.get("/api/products", async (req, res) => {
    const products = await productModel.find();
    res.json(products);
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(400).json({ msg: "Invalid ID" });
    }
});

// Create a new product
app.post("/api/products", async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ msg: "Invalid data" });

    const newProduct = new productModel({ name, price });
    await newProduct.save();
    res.status(201).json(newProduct);
});

// Update a product completely (PUT)
app.put("/api/products/:id", async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ msg: "Invalid data" });

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { name, price },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ msg: "Invalid ID or data" });
    }
});

// Partially update a product (PATCH)
app.patch("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ msg: "Invalid ID or data" });
    }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ msg: "Product not found" });
        res.json({ msg: "Product deleted" });
    } catch (err) {
        res.status(400).json({ msg: "Invalid ID" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});