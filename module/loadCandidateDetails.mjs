export const loadCandidateDetails = (
  submitted_at,
  work_availability,
  annual_salary_expectation,
  score,
  top
) => {
  const candidateDetails = document.querySelector("candidate-details");
  candidateDetails.setAttribute("score", score);
  if (top) candidateDetails.setAttribute("top", top);
  candidateDetails.setAttribute(
    "compensation",
    annual_salary_expectation["full-time"]
  );
  candidateDetails.setAttribute("work_availability", work_availability);
  candidateDetails.setAttribute("submitted_at", submitted_at);
};
