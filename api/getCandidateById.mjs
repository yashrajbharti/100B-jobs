const URL = "http://localhost:3001/candidates";

export const getCandidateById = async (id) => {
  const profileId = id;

  if (!profileId) {
    throw new Error("No candidate ID found in URL");
  }

  const res = await fetch(`${URL}/${profileId}`);
  if (!res.ok) {
    throw new Error("Candidate not found");
  }

  return await res.json();
};

// Legacy
// const res = await fetch(url);
// let data = await res.json();
// data.forEach((item, index) => {
//   item.score = Math.random() * 10;
//   item.index = index;
// });
