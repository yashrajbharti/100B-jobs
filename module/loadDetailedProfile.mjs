import { getQueryFromPage } from "../utils/history.mjs";
import { loadTimeline } from "./loadTimeline.mjs";
import { loadUserProfile } from "./loadUserProfile.mjs";

export const loadProfileData = async (url = "./data/data.json") => {
  const res = await fetch(url);
  let data = await res.json();
  data.forEach((item, index) => {
    item.score = Math.random() * 10;
    item.index = index;
  });
  const profileId = getQueryFromPage("id");

  const profileData = data[profileId];

  console.warn(profileData);
  const { name, email, phone, location } = profileData;

  document.title = `${name || "Candidate"}  | 100B Jobs 🚀`;

  loadUserProfile(name, email, phone, location);

  const { work_experiences } = profileData;

  loadTimeline(work_experiences);
};
