export const loadUserProfile = (name, email, phone, location) => {
  const profile = document.querySelector("user-profile");
  profile.setAttribute("name", name);
  profile.setAttribute("email", email);
  profile.setAttribute("phone", phone);
  profile.setAttribute("location", location);
};
