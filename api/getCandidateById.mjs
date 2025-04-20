const API_URL = "http://localhost:3001/candidates";
const LOCAL_URL = "./data/data.json";

export const getCandidateById = async (id) => {
  const profileId = id;
  try {
    if (!profileId) {
      throw new Error("No candidate ID found in URL");
    }

    const res = await fetch(`${API_URL}/${profileId}`);
    if (!res.ok) {
      throw new Error("Candidate not found");
    }

    return await res.json();
  } catch (err) {
    console.warn("Falling back to local JSON for profile:", err.message);
    return await getLegacyCandidateById(id);
  }
};

const getLegacyCandidateById = async (id) => {
  const res = await fetch(LOCAL_URL);
  let data = await res.json();

  data = data.map((item, index) => ({
    ...item,
    score: +(Math.random() * 10).toFixed(2),
    index,
  }));

  const candidate = data.find((item) => item.index === parseInt(id));
  if (!candidate) throw new Error("Candidate not found in local data");
  return candidate;
};
