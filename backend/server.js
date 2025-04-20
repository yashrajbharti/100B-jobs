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

const loadCandidates = () => {
  const filePath = path.join(__dirname, "candidates.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

app.get("/candidates", (req, res) => {
  const candidates = loadCandidates();
  const { limit = 50, offset = 0 } = req.query;

  const sliced = candidates
    .slice(+offset, +offset + +limit)
    .map(({ name, email, skills }) => ({ name, email, skills }));

  res.json({ total: candidates.length, data: sliced });
});

app.get("/candidates/:id", (req, res) => {
  const candidates = loadCandidates();
  const index = parseInt(req.params.id, 10);

  const candidate = candidates.find((c) => c.index === index);
  if (!candidate)
    return res.status(404).json({ message: "Candidate not found" });

  res.json(candidate);
});

app.get("/candidates/top", (req, res) => {
  const candidates = loadCandidates();
  const { limit = 50, offset = 0 } = req.query;

  const sorted = candidates
    .filter((c) => c.score !== undefined)
    .sort((a, b) => b.score - a.score);

  const sliced = sorted
    .slice(+offset, +offset + +limit)
    .map(({ name, email, skills, top, score }) => ({
      name,
      email,
      skills,
      top,
      score,
    }));

  res.json({ total: candidates.length, data: sliced });
});

app.get("/candidates/search", (req, res) => {
  const candidates = loadCandidates();
  const { q = "", limit = 50, offset = 0 } = req.query;
  const query = q.toLowerCase();

  const filtered = candidates.filter((c) => {
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      (c.skills || []).some((skill) => skill.toLowerCase().includes(query))
    );
  });

  const sliced = filtered
    .slice(+offset, +offset + +limit)
    .map(({ name, email, skills }) => ({ name, email, skills }));

  res.json({ total: candidates.length, data: sliced });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload.html"));
});

app.listen(3001, () =>
  console.log("100B Jobs 🚀 Server running at http://localhost:3001")
);
