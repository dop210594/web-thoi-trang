// Các hàm tiện ích dùng trong view.

// Ảnh có 3 dạng: "pexels:<id>" (ảnh tạm), "/uploads/..." (ảnh bạn tải lên) hoặc URL đầy đủ.
function img(src, width = 1200) {
  if (!src) return '';
  if (src.startsWith('pexels:')) {
    const id = src.slice(7);
    return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
  }
  return src;
}

function srcset(src, widths = [480, 800, 1200, 1800]) {
  if (!src || !src.startsWith('pexels:')) return '';
  return widths.map((w) => `${img(src, w)} ${w}w`).join(', ');
}

function price(value, lang) {
  if (value == null || value === '') return '';
  const n = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN').format(Number(value));
  return lang === 'en' ? `${n} VND` : `${n} ₫`;
}

function date(value, lang) {
  if (!value) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

function paragraphs(text) {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

module.exports = { img, srcset, price, date, paragraphs, slugify };
