import { loadData } from "../module/loadData.mjs";
import { addQueryToPage, removeQueryFromPage } from "./history.mjs";

export const searchResults = () => {
  document.querySelector("search-bar").addEventListener("search", (e) => {
    if (e.detail) {
      addQueryToPage("search", e.detail);
      addQueryToPage("offset", 0);
    } else removeQueryFromPage("search");

    loadData();
  });
};
