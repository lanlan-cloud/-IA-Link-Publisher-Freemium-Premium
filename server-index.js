// server/index.js
const express = require("express");
const fetch = require("node-fetch");
const { publishContent } = require("./store/githubStore");
const { makeSlug } = require("./utils/slugify");

const app = express();
app.use(express.json());

/**
 * Freemium: vista pública temporal (24h en cache)
 */
app.post("/api/publish-freemium", async (req, res) => {
  try {
    const { url, provider } = req.body;

    // (1) simular fetch del recurso (provider-specific)
    const normalized = `<html><body><h1>Vista previa freemium</h1>
      <p>Proveedor: ${provider}</p>
      <p>URL original: ${url}</p></body></html>`;

    // (2) slug aleatorio (temporal)
    const slug = makeSlug("preview-" + Date.now());

    // (3) publicar en repo público (GitHub Pages)
    const publicUrl = await publishContent(slug, normalized, { freemium: true });

    return res.json({ ok: true, url: publicUrl, expiresIn: "24h" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

/**
 * Premium: persistente con slug personalizado
 */
app.post("/api/publish-premium", async (req, res) => {
  try {
    const { url, provider, slug: customSlug } = req.body;

    // Aquí deberías validar sesión de usuario premium (ej. JWT)
    if (!req.headers.authorization) {
      return res.status(401).json({ ok: false, error: "Login requerido" });
    }

    const normalized = `<html><body><h1>Vista premium</h1>
      <p>Proveedor: ${provider}</p>
      <p>URL original: ${url}</p></body></html>`;

    const slug = makeSlug(customSlug || "premium-" + Date.now());
    const publicUrl = await publishContent(slug, normalized, { premium: true });

    return res.json({ ok: true, url: publicUrl, permanent: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(3000, () => console.log("Freemium server running on :3000"));
