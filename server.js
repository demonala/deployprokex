import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup storage untuk file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware untuk public folder (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint upload & deploy
app.post("/deploy", upload.single("htmlfile"), (req, res) => {
  if (!req.file) {
    return res.send("❌ No file uploaded.");
  }

  const subdomain = Math.random() > 0.5 ? "bejx1" : "bejx10";
  const siteName = req.file.filename;
  const deployedURL = `/sites/${subdomain}`;

  // Simpan nama file untuk endpoint site
  fs.writeFileSync(path.join(__dirname, `uploads/${subdomain}.txt`), siteName);

  res.send(`
    <h2>✅ Deployment Successful!</h2>
    <p>Your site is live at:</p>
    <a href="${deployedURL}" target="_blank">${deployedURL}</a>
    <br><br>
    <a href="/">⬅ Back to Home</a>
  `);
});

// Serve deployed site
app.get("/sites/:id", (req, res) => {
  const id = req.params.id;
  const txtFile = path.join(__dirname, `uploads/${id}.txt`);
  if (!fs.existsSync(txtFile)) {
    return res.send("❌ No deployment found for this ID.");
  }
  const fileName = fs.readFileSync(txtFile, "utf-8");
  res.sendFile(path.join(__dirname, "uploads", fileName));
});

// Jalankan server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));