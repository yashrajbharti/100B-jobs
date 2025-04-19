export const updateCount = (count, start, end) => {
  const output = document.querySelector("output");
  if (start !== 0 || end !== 0)
    output.textContent = `Showing ${start}-${end} of ${count} results`;
  else output.textContent = `Showing ${count} results`;
};
