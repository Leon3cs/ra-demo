const API_BASE = "/api";

async function apiListReclamacoes() {
  const res = await fetch(`${API_BASE}/reclamacoes`);
  if (!res.ok) throw new Error("Falha ao carregar reclamacoes");
  return res.json();
}

async function apiGetReclamacao(id) {
  const res = await fetch(`${API_BASE}/reclamacoes/${id}`);
  if (!res.ok) throw new Error("Reclamacao nao encontrada");
  return res.json();
}

async function apiCreateReclamacao(payload) {
  const res = await fetch(`${API_BASE}/reclamacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao criar reclamacao");
  return res.json();
}

async function apiAddResposta(id, payload) {
  const res = await fetch(`${API_BASE}/reclamacoes/${id}/respostas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao publicar resposta");
  return res.json();
}
