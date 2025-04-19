import { getQueryFromPage } from "../utils/history.mjs";
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

  console.log(profileData);
  const { name, email, phone, location } = profileData;

  document.title = `${name} | 100B Jobs 🚀`;

  loadUserProfile(name, email, phone, location);
};
