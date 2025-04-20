import { getQueryFromPage } from "../utils/history.mjs";
import { loadTimeline } from "./loadTimeline.mjs";
import { loadAdvancedTimeline } from "./loadAdvancedTimeline.mjs";
import { loadUserProfile } from "./loadUserProfile.mjs";
import { loadCandidateDetails } from "./loadCandidateDetails.mjs";
import { loadSkillsData } from "./loadSkills.mjs";
import { getCandidateById } from "../api/getCandidateById.mjs";

export const loadProfileData = async () => {
  const profileId = getQueryFromPage("id");
  const profileData = await getCandidateById(profileId);

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
