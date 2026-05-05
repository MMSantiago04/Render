const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("FUNCIONA RAIZ 🚀");
});

app.get("/webhook", (req, res) => {
  res.send("FUNCIONA WEBHOOK 🔥");
});

app.listen(process.env.PORT || 3000);
