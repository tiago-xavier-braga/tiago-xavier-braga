const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]);
}

const ALLOWED_INLINE_TAGS = ['strong', 'em', 'b', 'i'];
const INLINE_TAG_RE = new RegExp(`&lt;(/?)(${ALLOWED_INLINE_TAGS.join('|')})&gt;`, 'gi');

// Escapes everything, then re-opens a small whitelist of inline formatting tags.
export function sanitizeInline(value) {
  return escapeHTML(value).replace(INLINE_TAG_RE, '<$1$2>');
}

export function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
