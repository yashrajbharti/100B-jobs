const URL = "http://localhost:3001/candidates";

export const getCandidates = async (search, filter, offset = 0, limit = 50) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (filter === "Top Candidates") params.append("filter", filter);

  params.append("offset", offset);
  params.append("limit", limit);

  const res = await fetch(`${URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch candidates");

  const { length, data } = await res.json();
  console.log(data);
  return { length, data };
};

// Legacy
// const res = await fetch(url);
// let data = await res.json();
// data.forEach((item, index) => {
//   item.score = Math.random() * 10;
//   item.index = index;
// });

// if (search) {
//   data = data.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );
// }
// if (filter === "Top Candidates") {
//   data.sort((a, b) => a.score - b.score);
//   data.forEach((item, index) => {
//     if (index < 5) {
//       item.top = `#${index + 1}`;
//     }
//   });
// }
