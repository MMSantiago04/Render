const express = require("express");
const app = express();
app.use(express.json());

// ✅ Variables de entorno - nunca hardcodear tokens
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "mi_token_123";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // token permanente

// 🔹 Ruta base
app.get("/", (req, res) => {
  res.send("SERVER OK 🚀");
});

// 🔹 Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log("👉 Intento de verificación...");
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ TOKEN INCORRECTO");
    return res.sendStatus(403);
  }
});

// 🔹 Recibir mensajes entrantes
app.post("/webhook", (req, res) => {
  const body = req.body;
  if (body.object === "whatsapp_business_account") {
    const changes = body.entry?.[0]?.changes?.[0]?.value;
    const message = changes?.messages?.[0];
    if (message) {
      const from = message.from;       // número del cliente
      const text = message.text?.body; // texto del mensaje
      console.log(`📩 Mensaje de ${from}: ${text}`);
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Servidor corriendo");
});
