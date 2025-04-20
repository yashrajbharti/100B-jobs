import { getQueryFromPage } from "../utils/history.mjs";
import { loadCard } from "./loadCard.mjs";
import { updateCount } from "../utils/count.mjs";
import { loadPagination } from "./loadPagination.mjs";
import { getCandidates } from "../api/getCandidates.mjs";
// const url =
//   "https://file.notion.so/f/f/f86ed84d-b33c-4dfb-b0e0-97c5661516a3/3ed586a1-78e7-46af-9cf1-0961f95b5109/form-submissions-1.json?table=block&id=18a5392c-c93e-8054-b617-eb2a1a213d6c&spaceId=f86ed84d-b33c-4dfb-b0e0-97c5661516a3&expirationTimestamp=1745013600000&signature=V0EzSfTdWbxXoW-Bedoefmj-cMx0qqMlk-ZWCPFPksw&downloadName=form-submissions.json";

export const loadData = async () => {
  const candidateWrapper = document.querySelector(".candidate-list");
  candidateWrapper.classList.add("loading");
  candidateWrapper.innerHTML = "";

  const search = getQueryFromPage("search") ?? "";
  const filter = getQueryFromPage("filter") ?? "";

  let offset = getQueryFromPage("offset") ?? 0;
  let limit = getQueryFromPage("limit") ?? 50;

  const { length, data } = await getCandidates(search, filter, offset, limit);

  const end = Math.min(length, parseInt(offset) + parseInt(limit));

  updateCount(length, offset, end);
  loadPagination(offset, limit, length);

  loadCard(data);
};
