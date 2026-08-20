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

async function render() {
  const body = document.getElementById("lista-body");
  const emptyState = document.getElementById("empty-state");

  try {
    const reclamacoes = await apiListReclamacoes();

    if (reclamacoes.length === 0) {
      body.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";
    body.innerHTML = reclamacoes
      .map(
        (r) => `
        <tr>
          <td>${r.titulo}</td>
          <td><span class="status-badge ${statusClass(r.status)}">${r.status}</span></td>
          <td>${formatData(r.dataAbertura)}</td>
          <td class="id-cell">${r.id}</td>
          <td><a class="btn secundario" href="detalhe.html?id=${r.id}">Ver detalhes</a></td>
        </tr>`
      )
      .join("");
  } catch (err) {
    body.innerHTML = `<tr><td colspan="5">Erro ao carregar reclamações: ${err.message}</td></tr>`;
  }
}

render();
