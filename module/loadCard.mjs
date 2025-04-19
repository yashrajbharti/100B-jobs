export const loadCard = (cards) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardElement = document.createElement("candidate-card");
    cardElement.setAttribute("name", card.name);
    cardElement.setAttribute("email", card.email);
    cardElement.setAttribute("skills", card.skills);
    cardElement.setAttribute("link", `/candidate.html?id=${card.index}`);
    fragment.appendChild(cardElement);
  }

  const candidateWrapper = document.querySelector(".candidate-list");
  candidateWrapper.innerHTML = "";
  candidateWrapper.appendChild(fragment);
  candidateWrapper.classList.remove("loading");
};
