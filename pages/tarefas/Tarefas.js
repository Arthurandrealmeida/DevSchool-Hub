const Ntarefa = document.querySelector(".btn-nova-tarefa");
const modalCreate = document.getElementById("modal-create");
const cancelar = document.getElementById("cancelar");
const criar = document.getElementById("criar");
const colunaAtivas = document.querySelector(".colunas-tarefas section:nth-child(1)");
const colunaConcluidas = document.querySelector(".colunas-tarefas section:nth-child(2)");

Ntarefa.addEventListener("click", ()=> {
    modalCreate.style.display = "flex";
});

cancelar.addEventListener("click", ()=> {
    modalCreate.style.display = "none";
});

criar.addEventListener("click", ()=> {
    const titulo = document.getElementById("titulo").value.trim();

    if (titulo === "") {
        alert("Preencha o título da tarefa!");
        return;
    }

    criarTarefa(titulo);
    modalCreate.style.display = "none";
    document.getElementById("titulo").value = "";
});

//função criar o card
function criarTarefa(titulo) {
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa-card");

    tarefa.innerHTML = `
        <div class="lado-esq">
            <span class="bolinha"></span>
            <p class="tarefa-nome">${titulo}</p>
        </div>
        <img src="../../imagens/lixeira.png" class="icone-delete">
    `;

    // Adicionar na coluna Ativas
    colunaAtivas.appendChild(tarefa);

    // === CLICK PARA CONCLUIR ===
    const bolinha = tarefa.querySelector(".bolinha");

    bolinha.addEventListener("click", () => {
        // Adiciona classe visual de concluída
        tarefa.classList.add("concluida");

        // Troca bolinha pelo check
        bolinha.classList.remove("bolinha");
        bolinha.classList.add("check");

        // Mover para a coluna concluídas
        colunaConcluidas.appendChild(tarefa);
    });

    // === CLICK PARA DELETAR ===
    const lixeira = tarefa.querySelector(".icone-delete");

    lixeira.addEventListener("click", () => {
        tarefa.remove();
    });
}
