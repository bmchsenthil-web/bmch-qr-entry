import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CLINIC_ID = 52;

app.get("/api/mobile", async (req, res) => {
  try {
    const mobile = (req.query.mobile || "").replace(/\D/g, "");
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number" });
    }

    const apiUrl = `https://api.emedhub.in/fo/qr/patient/search/?search_key=${mobile}&clinic_id=${CLINIC_ID}`;

    const r = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (r.status === 404) {
      return res.json({ found: false, data: [] });
    }

    const data = await r.json();
    return res.json({ found: true, data });

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(502).json({ error: "Backend fetch failed" });
  }
});

// Health check
app.get("/", (req, res) => res.send("BMCH Proxy Running OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
