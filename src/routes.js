const express = require("express");
const store = require("./store");

const router = express.Router();

// GET /api/reclamacoes - lista todas as reclamacoes (campos resumidos)
router.get("/reclamacoes", async (req, res) => {
  const reclamacoes = await store.listReclamacoes();
  res.json(reclamacoes);
});

// POST /api/reclamacoes - cria uma nova reclamacao
router.post("/reclamacoes", async (req, res) => {
  const { titulo, texto, telefone } = req.body;
  if (!titulo || !texto) {
    return res.status(400).json({ error: "titulo e texto sao obrigatorios" });
  }
  const reclamacao = await store.createReclamacao({ titulo, texto, telefone });
  res.status(201).json(reclamacao);
});

// GET /api/reclamacoes/:id - detalhes de uma reclamacao (com respostas)
router.get("/reclamacoes/:id", async (req, res) => {
  const reclamacao = await store.getReclamacao(req.params.id);
  if (!reclamacao) return res.status(404).json({ error: "reclamacao nao encontrada" });
  res.json(reclamacao);
});

// POST /api/reclamacoes/:id/respostas - publica uma resposta na reclamacao
router.post("/reclamacoes/:id/respostas", async (req, res) => {
  const { texto, autor } = req.body;
  if (!texto) {
    return res.status(400).json({ error: "texto e obrigatorio" });
  }
  const reclamacao = await store.addResposta(req.params.id, { texto, autor });
  if (!reclamacao) return res.status(404).json({ error: "reclamacao nao encontrada" });
  res.status(201).json(reclamacao);
});

module.exports = router;
