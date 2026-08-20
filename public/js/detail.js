function statusClass(status) {
  const map = {
    Aberta: "status-aberta",
    Respondida: "status-respondida",
    Encerrada: "status-encerrada",
  };
  return map[status] || "status-aberta";
}

function formatData(iso) {
  return new Date(iso).toLocaleString("pt-BR");
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const conteudo = document.getElementById("conteudo");

function timelineHtml(reclamacao) {
  const abertura = `
    <div class="timeline-item">
      <span class="autor">Reclamação aberta</span>
      <span class="data">${formatData(reclamacao.dataAbertura)}</span>
      <div class="texto">${reclamacao.texto}</div>
    </div>`;

  const respostas = reclamacao.respostas
    .map(
      (r) => `
      <div class="timeline-item">
        <span class="autor">${r.autor}</span>
        <span class="data">${formatData(r.data)}</span>
        <div class="texto">${r.texto}</div>
      </div>`
    )
    .join("");

  return abertura + respostas;
}

function renderReclamacao(reclamacao) {
  conteudo.innerHTML = `
    <a class="voltar" href="index.html">&larr; Voltar para a lista</a>
    <div class="page-header">
      <h1>${reclamacao.titulo}</h1>
      <span class="status-badge ${statusClass(reclamacao.status)}">${reclamacao.status}</span>
    </div>
    <div class="detalhe-meta">ID: ${reclamacao.id}</div>
    <div class="detalhe-meta">Aberta em ${formatData(reclamacao.dataAbertura)}</div>
    ${reclamacao.telefone ? `<div class="detalhe-meta">Contato: ${reclamacao.telefone}</div>` : ""}

    <div class="timeline">
      <h2>Linha do tempo</h2>
      ${timelineHtml(reclamacao)}
    </div>

    <div class="responder-form">
      <h2 style="font-size:16px;margin-bottom:12px">Responder</h2>
      <form id="form-resposta">
        <textarea id="resposta-texto" placeholder="Escreva uma resposta..." required></textarea>
        <div style="margin-top:12px">
          <button type="submit" class="btn">Publicar resposta</button>
        </div>
        <div id="resposta-feedback" class="feedback"></div>
      </form>
    </div>
  `;

  document.getElementById("form-resposta").addEventListener("submit", async (e) => {
    e.preventDefault();
    const textoEl = document.getElementById("resposta-texto");
    const feedback = document.getElementById("resposta-feedback");
    feedback.textContent = "";
    feedback.className = "feedback";

    try {
      const atualizada = await apiAddResposta(id, { texto: textoEl.value.trim() });
      renderReclamacao(atualizada);
    } catch (err) {
      feedback.textContent = err.message;
      feedback.className = "feedback erro";
    }
  });
}

async function carregar() {
  if (!id) {
    conteudo.innerHTML = `<p>ID da reclamação não informado.</p>`;
    return;
  }
  try {
    const reclamacao = await apiGetReclamacao(id);
    renderReclamacao(reclamacao);
  } catch (err) {
    conteudo.innerHTML = `<p>Erro ao carregar reclamação: ${err.message}</p>`;
  }
}

carregar();
