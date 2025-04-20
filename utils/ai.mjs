async function askGemini() {
  const API_KEY = "AIzaSyDFFMOmw95vVzqG66a_bMZ4sUECKuNUPks";

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    API_KEY;

  const body = {
    contents: [
      {
        parts: [
          { text: "Write a short story about a robot who learns to love." },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  document.querySelector("output").textContent = text;
}

askGemini();
