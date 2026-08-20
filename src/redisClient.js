const REDIS_URL = process.env.REDIS_URL;
const USE_FAKE_REDIS = process.env.USE_FAKE_REDIS === "true";

// USE_FAKE_REDIS=true roda um Redis em memoria (sem dependencia externa) so para
// desenvolvimento local antes da instancia real (Rafael) estar disponivel.
const Redis = USE_FAKE_REDIS ? require("ioredis-mock") : require("ioredis");
const redis = USE_FAKE_REDIS ? new Redis() : new Redis(REDIS_URL);

if (!USE_FAKE_REDIS) {
  redis.on("error", (err) => {
    console.error("[redis] erro de conexao:", err.message);
  });
  redis.on("connect", () => {
    console.log(`[redis] conectado em ${REDIS_URL}`);
  });
} else {
  console.log("[redis] usando instancia em memoria (USE_FAKE_REDIS=true)");
}

module.exports = redis;
