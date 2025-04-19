import { loadData } from "../module/loadData.mjs";
import { addQueryToPage, removeQueryFromPage } from "./history.mjs";

export const filterTopCandidates = () => {
  document.querySelector("md-filter-chip").addEventListener("click", (e) => {
    if (e.target.selected) addQueryToPage("filter", "Top Candidates");
    else removeQueryFromPage("filter");

    loadData();
  });
};
