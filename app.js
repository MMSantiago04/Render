const express = require("express");
const app = express();

app.use(express.json());

// 🔹 VERIFICACIÓN
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 🔹 RECIBIR MENSAJES
app.post("/webhook", (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
