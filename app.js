const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "mi_token_123"; // 👈 usa este mismo en Meta

// 🔹 Ruta base (solo para probar que el server está vivo)
app.get("/", (req, res) => {
  res.send("SERVER OK 🚀");
});

// 🔹 Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("👉 Intento de verificación...");
  console.log("mode:", mode);
  console.log("token:", token);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ TOKEN INCORRECTO");
    return res.sendStatus(403);
  }
});

// 🔹 Recibir mensajes
app.post("/webhook", (req, res) => {
  console.log("📩 Mensaje recibido:");
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Servidor corriendo");
});
