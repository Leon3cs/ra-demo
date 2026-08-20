const form = document.getElementById("form-nova");
const textoEl = document.getElementById("texto");
const btnContinuar = document.getElementById("btn-continuar");
const btnVoltar = document.getElementById("btn-voltar");
const autosaveStatus = document.getElementById("autosave-status");
const seg1 = document.getElementById("seg-1");
const seg2 = document.getElementById("seg-2");
const etapaLabel = document.getElementById("etapa-label");
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const textoPreview = document.getElementById("texto-preview");
const feedback = document.getElementById("feedback");
const telefoneEl = document.getElementById("telefone");
const textoErro = document.getElementById("texto-erro");

let autosaveTimer;

function gerarTituloIA(texto) {
  const palavras = texto.trim().split(/\s+/);
  const resumo = palavras.slice(0, 7).join(" ");
  const titulo = resumo.charAt(0).toUpperCase() + resumo.slice(1);
  return palavras.length > 7 ? `${titulo}...` : titulo;
}

textoEl.addEventListener("input", () => {
  if (textoEl.value.trim().length > 0) {
    textoErro.style.display = "none";
    textoEl.classList.remove("erro");
  }

  autosaveStatus.textContent = "Aguardando alterações para salvar";
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    autosaveStatus.textContent = "Rascunho salvo";
  }, 800);
});

btnContinuar.addEventListener("click", () => {
  const texto = textoEl.value.trim();
  if (texto.length === 0) {
    textoErro.style.display = "block";
    textoEl.classList.add("erro");
    textoEl.focus();
    return;
  }

  textoPreview.textContent = texto;

  step1.style.display = "none";
  step2.style.display = "block";
  seg2.classList.add("active");
  etapaLabel.textContent = "Etapa 2 de 2";
  autosaveStatus.textContent = "Rascunho salvo";
});

btnVoltar.addEventListener("click", (e) => {
  e.preventDefault();
  if (step2.style.display === "block") {
    step2.style.display = "none";
    step1.style.display = "block";
    seg2.classList.remove("active");
    etapaLabel.textContent = "Etapa 1 de 2";
  } else {
    window.location.href = "index.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  feedback.textContent = "";
  feedback.className = "feedback";

  const texto = textoEl.value.trim();
  const titulo = gerarTituloIA(texto);
  const telefone = telefoneEl.value.trim();

  try {
    const reclamacao = await apiCreateReclamacao({
      titulo,
      texto,
      telefone: telefone || undefined,
    });
    window.location.href = `detalhe.html?id=${reclamacao.id}`;
  } catch (err) {
    feedback.textContent = err.message;
    feedback.className = "feedback erro";
  }
});
