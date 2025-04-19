import { UserProfile } from "./components/user-profle.mjs";
import { loadProfileData } from "./module/loadDetailedProfile.mjs";

loadProfileData();

customElements.define("user-profile", UserProfile);
