export const updateCount = (count, start, end) => {
  const output = document.querySelector("output");
  if (start >= end) output.textContent = "Showing 0 results";
  else if (count !== 0)
    output.textContent = `Showing ${start}-${end} of ${count} results`;
  else output.textContent = `Showing ${count} results`;
};
