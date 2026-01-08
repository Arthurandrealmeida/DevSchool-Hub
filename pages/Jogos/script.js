const secretCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
];

let userInput = [];

const cardsContainer = document.querySelector(".cards-container");

document.addEventListener("keydown", (event) => {
  userInput.push(event.key);

  // mantém o array do tamanho certo
  if (userInput.length > secretCode.length) {
    userInput.shift();
  }

  // compara as sequências
  if (userInput.join() === secretCode.join()) {
    cardsContainer.classList.remove("hidden");
  }
});
