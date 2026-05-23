const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

function isPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

function toPositiveInteger(value) {
  return Number(value);
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizeText(value) {
  if (value === undefined || value === null) return value;
  return String(value).trim();
}

function normalizeEmail(email) {
  return normalizeText(email).toLowerCase();
}

function isValidTotal(total) {
  const number = Number(total);
  return Number.isFinite(number) && number > 0;
}

function isValidDateTime(value) {
  if (value === undefined || value === null || value === '') return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function normalizeDateTime(value) {
  if (value === undefined || value === null || value === '') return null;
  return new Date(value).toISOString();
}

module.exports = {
  ESTADOS_VALIDOS,
  isPositiveInteger,
  toPositiveInteger,
  isValidEmail,
  normalizeText,
  normalizeEmail,
  isValidTotal,
  isValidDateTime,
  normalizeDateTime,
};
