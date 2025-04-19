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
  document.querySelector(".candidate-list").innerHTML = "";
  document.querySelector(".candidate-list").appendChild(fragment);
};
