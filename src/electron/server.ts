import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

// Needed because __dirname is not available in ES modules by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5123;
const app = express();

const staticPath = path.join(__dirname, "dist-react");

app.use(express.static(staticPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

createServer(app).listen(PORT, () => {
  console.log(`🟢 Renderer server running at http://localhost:${PORT}`);
});
