import { loadData } from "../module/loadData.mjs";
import { addQueryToPage } from "./history.mjs";

export const navigatePagination = () => {
  const pagination = document.querySelector("pagination-component");

  pagination.addEventListener("page-change", (e) => {
    addQueryToPage("offset", e.detail.offset);
    addQueryToPage("limit", e.detail.limit);

    loadData();
  });
};
