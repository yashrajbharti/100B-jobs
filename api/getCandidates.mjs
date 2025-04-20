const API_URL = "http://localhost:3001/candidates";
const LOCAL_URL = "./data/data.json";

export const getCandidates = async (search, filter, offset = 0, limit = 50) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter === "Top Candidates") params.append("filter", filter);

    params.append("offset", offset);
    params.append("limit", limit);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch candidates");

    const { length, data } = await res.json();
    console.log(data);
    return { length, data };
  } catch (err) {
    console.warn("Falling back to local JSON:", err.message);
    return await getLegacyCandidates(search, filter, offset, limit);
  }
};

const getLegacyCandidates = async (search, filter, offset = 0, limit = 50) => {
  const res = await fetch(LOCAL_URL);
  let data = await res.json();
  data = data.map((item, index) => ({
    ...item,
    score: +(Math.random() * 10).toFixed(2),
    index,
  }));

  if (search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter === "Top Candidates") {
    data = data
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        top: index < 5 ? `#${index + 1}` : undefined,
      }));
  }

  const sliced = data.slice(offset, offset + limit);
  return { length: data.length, data: sliced };
};
