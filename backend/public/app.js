const form = document.querySelector("form");
const fileInput = document.getElementById("file");
const jobDescriptionTextField = document.querySelector(
  "md-outlined-text-field"
);
const dialog = document.querySelector("md-dialog");
const dialogTitle = document.querySelector('div[slot="headline"]');
const dialogMessage = document.querySelector('form[slot="content"]');
const button = document.querySelector("md-filled-button");

const showDialog = (title, message) => {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialog.show();
};

const getScoreFromAI = async (candidate, jobDescription) => {
  const prompt = `
You are an expert recruiter. Score this candidate from 0 to 7 based on how well their skills and experience match the following job description.

Job Description:
${jobDescription}

Candidate:
${JSON.stringify(candidate, null, 2)}

Only return the number score (decimal between 0 and 7). No explanation.
  `.trim();

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  const result = await response.json();
  const raw = result?.message?.content || "";
  console.log(result);
  const score = parseFloat(raw.match(/[\d.]+/g)?.[0]);
  return isNaN(score) ? Math.random() * 7 : Math.min(score, 7);
};

const getScore = async (candidate, jd) => {
  const skillsScore = await getScoreFromAI(candidate, jd);
  const experienceCount = (candidate.work_experiences || []).length;
  const xpScore = Math.min(experienceCount / 10, 1) * 3;

  return +(skillsScore + xpScore).toFixed(2);
};

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const processInBatches = async (candidates, jobDescription, batchSize = 50) => {
  const allScored = [];
  const chunks = chunkArray(candidates, batchSize);

  for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
    const batch = chunks[batchIndex];

    const scoredBatch = await Promise.all(
      batch.map(async (candidate, i) => {
        const index = batchIndex * batchSize + i;
        const score = await getScore(candidate, jobDescription);
        return { ...candidate, score, index };
      })
    );

    allScored.push(...scoredBatch);

    const response = await fetch("/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoredBatch),
    });

    if (!response.ok) {
      console.warn(`Failed to upload batch ${batchIndex + 1}`);
    }

    showDialog(
      "Uploading...",
      `Uploaded batch ${batchIndex + 1} of ${chunks.length}`
    );
  }

  return allScored;
};

const sendTop5 = async (scoredCandidates) => {
  const top5 = [...scoredCandidates]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((candidate, i) => ({ ...candidate, top: `#${i + 1}` }));
  const response = await fetch("/upload/top5", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(top5),
  });

  return response.ok;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  button.disabled = true;
  await fetch("/candidates", { method: "DELETE" });

  button.textContent = "Processing Candidate Scores...";
  const file = fileInput.files[0];
  const jobDescription = jobDescriptionTextField.value;

  if (!file || !jobDescription.trim()) {
    showDialog(
      "Missing Information",
      "Please upload a JSON file and enter a job description."
    );
    return;
  }

  const text = await file.text();
  let candidates;

  try {
    candidates = JSON.parse(text);
  } catch (err) {
    showDialog("Invalid File", "The uploaded file is not a valid JSON.");
    return;
  }

  const allScored = await processInBatches(candidates, jobDescription);
  const topUploaded = await sendTop5(allScored);

  if (topUploaded) {
    showDialog("Upload Complete", "All candidates scored and top 5 submitted.");
  } else {
    showDialog("Upload Partial", "Scoring done, but top 5 failed to save.");
  }
  button.disabled = false;
  button.textContent = "Upload and Evaluate Candidates using AI";
});
