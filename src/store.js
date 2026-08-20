const { randomUUID } = require("crypto");
const redis = require("./redisClient");

const HASH_KEY = "reclamacoes";

function parse(raw) {
  return raw ? JSON.parse(raw) : null;
}

async function listReclamacoes() {
  const all = await redis.hgetall(HASH_KEY);
  return Object.values(all)
    .map(parse)
    .map(({ id, titulo, status, dataAbertura }) => ({ id, titulo, status, dataAbertura }))
    .sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura));
}

async function getReclamacao(id) {
  const raw = await redis.hget(HASH_KEY, id);
  return parse(raw);
}

async function createReclamacao({ titulo, texto, telefone }) {
  const reclamacao = {
    id: randomUUID(),
    titulo,
    texto,
    telefone: telefone || null,
    status: "Aberta",
    dataAbertura: new Date().toISOString(),
    respostas: [],
  };
  await redis.hset(HASH_KEY, reclamacao.id, JSON.stringify(reclamacao));
  return reclamacao;
}

async function addResposta(id, { texto, autor }) {
  const reclamacao = await getReclamacao(id);
  if (!reclamacao) return null;

  reclamacao.respostas.push({
    texto,
    autor: autor || "Empresa",
    data: new Date().toISOString(),
  });

  await redis.hset(HASH_KEY, id, JSON.stringify(reclamacao));
  return reclamacao;
}

module.exports = { listReclamacoes, getReclamacao, createReclamacao, addResposta };
