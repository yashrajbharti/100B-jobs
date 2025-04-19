import { getQueryFromPage } from "../utils/history.mjs";
import { loadTimeline } from "./loadTimeline.mjs";
import { loadAdvancedTimeline } from "./loadAdvancedTimeline.mjs";
import { loadUserProfile } from "./loadUserProfile.mjs";
import { loadCandidateDetails } from "./loadCandidateDetails.mjs";

export const loadProfileData = async (url = "./data/data.json") => {
  const res = await fetch(url);
  let data = await res.json();
  data.forEach((item, index) => {
    item.score = Math.random() * 10;
    item.index = index;
  });

  const profileId = getQueryFromPage("id");

  const profileData = data[profileId];

  const { name, email, phone, location } = profileData;

  document.title = `${name || "Candidate"}  | 100B Jobs 🚀`;

  loadUserProfile(name, email, phone, location);

  const { work_experiences } = profileData;

  loadTimeline(work_experiences);

  const { education } = profileData;

  loadAdvancedTimeline(education);

  const {
    submitted_at,
    work_availability,
    annual_salary_expectation,
    score,
    top = 0,
  } = profileData;

  loadCandidateDetails(
    submitted_at,
    work_availability,
    annual_salary_expectation,
    score,
    top
  );
};
