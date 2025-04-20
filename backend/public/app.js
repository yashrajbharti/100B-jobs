const form = document.querySelector("form");
const fileInput = document.getElementById("file");
const jobDescriptionTextField = document.querySelector(
  "md-outlined-text-field"
);
const dialog = document.querySelector("md-dialog");
const dialogTitle = document.querySelector('div[slot="headline"]');
const dialogMessage = document.querySelector('form[slot="content"]');

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
      prompt,
      stream: false,
    }),
  });

  console.log(prompt);
  const result = await response.json();
  const raw = result.response || "";

  const score = parseFloat(raw.match(/[\d.]+/g)?.[0]);
  console.warn(result);
  return isNaN(score) ? Math.random() * 7 : Math.min(score, 7);
};

const getScore = async (candidate, jd) => {
  const skillsScore = await getScoreFromAI(candidate, jd);
  const experienceCount = (candidate.work_experiences || []).length;
  const xpScore = Math.min(experienceCount / 10, 1) * 3;

  return +(skillsScore + xpScore).toFixed(2);
};

const scoreCandidates = async (candidates, jobDescription) => {
  const scored = await Promise.all(
    candidates.map(async (candidate, index) => {
      const score = await getScore(candidate, jobDescription);
      return { ...candidate, score, index };
    })
  );

  const top5 = [...scored].sort((a, b) => b.score - a.score).slice(0, 5);
  top5.forEach((candidate, i) => {
    candidate.top = `#${i + 1}`;
  });

  return scored;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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

  const finalData = await scoreCandidates(candidates, jobDescription);

  const response = await fetch("/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
  });

  if (response.ok) {
    showDialog(
      "Upload Successful",
      "Candidates scored and uploaded successfully!"
    );
  } else {
    showDialog("Upload Failed", "Something went wrong while uploading.");
  }
});
