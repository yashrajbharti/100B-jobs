import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/upload", (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, "candidates.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res
    .status(200)
    .json({ message: "Uploaded successfully!", count: data.length });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload.html"));
});

app.listen(3001, () =>
  console.log("100B Jobs 🚀 Server running at http://localhost:3001")
);
