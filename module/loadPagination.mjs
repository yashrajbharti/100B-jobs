export const loadPagination = (current, perPage, total) => {
  const pagination = document.querySelector("pagination-component");
  pagination.setAttribute("current", current);
  pagination.setAttribute("per-page", perPage);
  pagination.setAttribute("total", total);
};
