export const loadSkillsData = (skills) => {
  const skillsComponent = document.querySelector("skills-component");

  skillsComponent.setAttribute("skills", skills);
};
