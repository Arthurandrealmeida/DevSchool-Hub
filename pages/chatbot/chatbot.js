const chatBody = document.getElementById("chat-body");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let roadmaps = null;

// ================================
// UI
// ================================
function addMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender);
    msg.innerHTML = `<p>${text.replace(/\n/g, "<br>")}</p>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ================================
// Carregar roadmaps
// ================================
async function loadRoadmaps() {
    const res = await fetch("roadmaps.json");
    roadmaps = await res.json();
}

loadRoadmaps();

// ================================
// IA de roadmap
// ================================
function processMessage(message) {
    const msg = message.toLowerCase();

    for (const key in roadmaps) {
        const roadmap = roadmaps[key];

        for (const kw of roadmap.keywords) {
            if (msg.includes(kw)) {
                return formatRoadmap(roadmap);
            }
        }
    }

    return "Não entendi 😕\nTente algo como:\n• Quero estudar JavaScript\n• Como aprender HTML e CSS";
}

// ================================
// Formatar resposta
// ================================
function formatRoadmap(rm) {
    let text = `📚 **Roadmap de ${rm.title}**\n\n`;

    text += rm.steps.join("\n") + "\n\n";
    text += "💡 **Dicas:**\n" + rm.tips.map(t => `• ${t}`).join("\n");

    return text;
}

// ================================
// Enviar mensagem
// ================================
function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto || !roadmaps) return;

    input.value = "";
    addMessage(texto, "user");

    const resposta = processMessage(texto);
    addMessage(resposta, "bot");
}

// ================================
// Eventos
// ================================
sendBtn.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        enviarMensagem();
    }
});

const materiasLista = document.getElementById("materias-lista");

// ================================
// Mostrar matérias disponíveis
// ================================
function mostrarMaterias() {
    if (!roadmaps || !materiasLista) return;

    materiasLista.innerHTML = "";

    for (const key in roadmaps) {
        const materia = roadmaps[key];

        const chip = document.createElement("div");
        chip.classList.add("materia-chip");
        chip.textContent = materia.title;

        chip.addEventListener("click", () => {
            input.value = `Quero estudar ${materia.title}`;
            input.focus();
        });

        materiasLista.appendChild(chip);
    }
}

// Chame depois de carregar o JSON
loadRoadmaps().then(() => {
    mostrarMaterias();
});
