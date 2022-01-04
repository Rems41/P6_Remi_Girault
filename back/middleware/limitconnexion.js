const rateLimit = require("express-rate-limit");

const max = rateLimit({
  windowMs: 3 * 60 * 1000, // délai en ms / 3 minutes
  max: 3, // nombre de tentatives autorisées
});

// EXPORT
module.exports = { max };