import { AdvancedTimeline } from "./components/advanced-timeline-component.mjs";
import { CandidateDetails } from "./components/candidate-details.mjs";
import { SkillsComponent } from "./components/skills-component.mjs";
import { Timeline } from "./components/timeline-component.mjs";
import { UserProfile } from "./components/user-profile.mjs";
import { loadProfileData } from "./module/loadDetailedProfile.mjs";

loadProfileData();

customElements.define("user-profile", UserProfile);
customElements.define("timeline-component", Timeline);
customElements.define("advanced-timeline-component", AdvancedTimeline);
customElements.define("candidate-details", CandidateDetails);
customElements.define("skills-component", SkillsComponent);
