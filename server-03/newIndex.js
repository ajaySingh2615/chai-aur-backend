const express = require("express");

const app = express();

app.use(express.json());

app.get("/menu", (req, res) => res.json({ menu: ["Pizza", "Pasta", "Salad"] }));

app.post("/order", (req, res) => {
  res.status(200).json({ message: "Order received", order: req.body });
});
