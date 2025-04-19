import { getQueryFromPage } from "../utils/history.mjs";
import { loadCard } from "./loadCard.mjs";
import { updateCount } from "../utils/count.mjs";
import { loadPagination } from "./loadPagination.mjs";
// const url =
//   "https://file.notion.so/f/f/f86ed84d-b33c-4dfb-b0e0-97c5661516a3/3ed586a1-78e7-46af-9cf1-0961f95b5109/form-submissions-1.json?table=block&id=18a5392c-c93e-8054-b617-eb2a1a213d6c&spaceId=f86ed84d-b33c-4dfb-b0e0-97c5661516a3&expirationTimestamp=1745013600000&signature=V0EzSfTdWbxXoW-Bedoefmj-cMx0qqMlk-ZWCPFPksw&downloadName=form-submissions.json";

export const loadData = async (url = "./data/data.json") => {
  const res = await fetch(url);
  const search = getQueryFromPage("search") ?? "";
  const filter = getQueryFromPage("filter") ?? "";

  let offset = getQueryFromPage("offset") ?? 0;
  let limit = getQueryFromPage("limit") ?? 50;

  let data = await res.json();
  data.forEach((item, index) => {
    item.score = Math.random() * 10;
    item.index = index;
  });

  if (search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filter === "Top Candidates") {
    data.sort((a, b) => a.score - b.score);
  }
  const end = Math.min(data.length, parseInt(offset) + parseInt(limit));

  updateCount(data.length, offset, end);
  loadPagination(offset, limit, data.length);
  loadCard(data.slice(offset, end));
};
