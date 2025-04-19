export const updateCount = (count, start, end) => {
  document.querySelector(
    "output"
  ).textContent = `Showing ${start}-${end} of ${count} results`;
};
