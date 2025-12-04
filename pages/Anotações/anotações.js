const botaoNovaNota = document.querySelector(".new-note-btn");
const modalCreate = document.getElementById("modal-create");
const modalView = document.getElementById("modal-view");
const cancelar = document.getElementById("cancelar");
const criar = document.getElementById("criar");
const notesArea = document.getElementById("notes-area");

// Abrir modal de criação
botaoNovaNota.addEventListener("click", () => {
    modalCreate.style.display = "flex";
});

// Fechar modal de criação
cancelar.addEventListener("click", () => {
    modalCreate.style.display = "none";
});

// Criar anotação
criar.addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value.trim();
    const conteudo = document.getElementById("conteudo").value.trim();

if (titulo === "" || conteudo === "") {
        alert("Preencha o título e o conteúdo!");
        return;
    }

    criarCard(titulo, conteudo);
    modalCreate.style.display = "none";
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
});

// FUNÇÃO QUE CRIA O CARD NA TELA
function criarCard(titulo, conteudo) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h3 = document.createElement("h3");
    h3.textContent = titulo;

    const p = document.createElement("p");
    p.textContent = conteudo;

    card.appendChild(h3);
    card.appendChild(p);

    // Abrir modal de visualização
    card.addEventListener("click", () => {
        abrirModalVisualizar(titulo, conteudo);
    });

    notesArea.appendChild(card);
}

function abrirModalVisualizar(titulo, conteudo) {
    document.getElementById("modal-titulo").textContent = titulo;
    document.getElementById("modal-texto").textContent = conteudo;

    modalView.style.display = "flex";
}

// Fechar modal de visualização
document.getElementById("fechar-view").addEventListener("click", () => {
    modalView.style.display = "none";
});
