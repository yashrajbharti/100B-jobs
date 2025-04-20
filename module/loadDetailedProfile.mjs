import { getQueryFromPage } from "../utils/history.mjs";
import { loadTimeline } from "./loadTimeline.mjs";
import { loadAdvancedTimeline } from "./loadAdvancedTimeline.mjs";
import { loadUserProfile } from "./loadUserProfile.mjs";
import { loadCandidateDetails } from "./loadCandidateDetails.mjs";
import { loadSkillsData } from "./loadSkills.mjs";

export const loadProfileData = async (
  url = "http://localhost:3001/candidates"
) => {
  // Legacy
  // const res = await fetch(url);
  // let data = await res.json();
  // data.forEach((item, index) => {
  //   item.score = Math.random() * 10;
  //   item.index = index;
  // });

  const profileId = getQueryFromPage("id");

  if (!profileId) {
    throw new Error("No candidate ID found in URL");
  }

  const res = await fetch(`${url}/${profileId}`);
  if (!res.ok) {
    throw new Error("Candidate not found");
  }

  const profileData = await res.json();

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

  const { skills } = profileData;

  loadSkillsData(skills);
};
