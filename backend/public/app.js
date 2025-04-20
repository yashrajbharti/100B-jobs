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

const mockScore = async (candidate, jd) => {
  const skillsScore = Math.random() * 7;
  const experienceCount = (candidate.work_experiences || []).length;
  const xpScore = Math.min(experienceCount / 10, 1) * 3;

  return +(skillsScore + xpScore).toFixed(2);
};

const scoreCandidates = async (candidates, jobDescription) => {
  const scored = await Promise.all(
    candidates.map(async (candidate, index) => {
      const score = await mockScore(candidate, jobDescription);
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
