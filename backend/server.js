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
  const newBatch = req.body;
  const filePath = path.join(__dirname, "candidates.json");

  let existingData = [];

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse existing candidate data:", e.message);
      return res
        .status(500)
        .json({ message: "Server error reading existing data." });
    }
  }

  const incomingIndexes = new Set(newBatch.map((c) => Number(c.index)));

  const dedupedExisting = existingData.filter(
    (c) => !incomingIndexes.has(Number(c.index))
  );

  const updated = [...dedupedExisting, ...newBatch];

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  res.status(200).json({
    message: "Batch uploaded with deduplication.",
    new: newBatch.length,
    total: updated.length,
  });
});

const loadCandidates = () => {
  const filePath = path.join(__dirname, "candidates.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

app.get("/candidates", (req, res) => {
  const candidates = loadCandidates();
  const { search = "", filter = "", limit = 50, offset = 0 } = req.query;

  let filtered = candidates;

  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter((c) => {
      return (
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        (c.skills || []).some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }

  if (filter === "Top Candidates") {
    filtered = filtered
      .filter((c) => c.score !== undefined)
      .sort((a, b) => b.score - a.score);
  }

  const sliced = filtered
    .slice(+offset, +offset + +limit)
    .map(({ index, name, email, skills, top, score }) => ({
      index,
      name,
      email,
      skills,
      top,
      score,
    }));

  res.json({
    length: filtered.length,
    data: sliced,
  });
});

app.get("/candidates/:id", (req, res) => {
  const candidates = loadCandidates();
  const index = parseInt(req.params.id, 10);

  const candidate = candidates.find((c) => c.index === index);
  if (!candidate)
    return res.status(404).json({ message: "Candidate not found" });

  res.json(candidate);
});

app.patch("/upload/top5", (req, res) => {
  const newTop5 = req.body;

  const filePath = path.join(__dirname, "candidates.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No existing candidate data." });
  }
  let existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  newTop5.forEach((topCandidate) => {
    const match = existing.find((c) => c.index === topCandidate.index);
    if (match) {
      match.top = topCandidate.top;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  res.status(200).json({ message: "Top 5 updated successfully." });
});

app.delete("/candidates", (req, res) => {
  const filePath = path.join(__dirname, "candidates.json");

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Candidate data cleared." });
    } catch (e) {
      console.error("Failed to delete candidate file:", e.message);
      res.status(500).json({ message: "Failed to delete candidate file." });
    }
  } else {
    res.status(404).json({ message: "No candidate data to delete." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload.html"));
});

app.listen(3001, () =>
  console.log("100B Jobs 🚀 Server running at http://localhost:3001")
);
