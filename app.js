const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "mi_token_123";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 🔹 Función para enviar mensajes
async function sendMessage(to, message) {
  const response = await fetch(
    `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          body: message,
        },
      }),
    }
  );
  const data = await response.json();
  console.log("📤 Mensaje enviado:", JSON.stringify(data, null, 2));
}

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

// 🔹 Recibir y responder mensajes
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const changes = body.entry?.[0]?.changes?.[0]?.value;
    const message = changes?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body?.toLowerCase().trim();
      console.log(`📩 Mensaje de ${from}: ${text}`);

      // 🔹 Respuesta automática
      await sendMessage(
        from,
        `¡Hola! 👋 Bienvenido a *Online Vision Gráfica*.\n\nEs un gusto tenerte con nosotros. En un momento uno de nuestros asesores se comunicará contigo para ayudarte con todo lo que necesites. 😊\n\nMientras tanto, te invitamos a conocer nuestro catálogo de productos:\n👉 https://www.onlinevisiongrafica.com/catalogo-bolsa-y-cajas-sin-marca/`
      );
    }
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Servidor corriendo");
});
