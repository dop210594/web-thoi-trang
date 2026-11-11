const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const store = require('../store');
const { slugify } = require('../helpers');
const { strings } = require('../i18n');

const router = express.Router();

// ---------- Upload ảnh ----------
const IMAGE_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'image/gif': '.gif' };
const upload = multer({
  storage: multer.diskStorage({
    destination: store.UPLOAD_DIR,
    // Đuôi file lấy theo loại ảnh cho phép, không lấy từ tên gốc — tránh lọt file .svg/.html.
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${IMAGE_TYPES[file.mimetype]}`)
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => cb(null, Boolean(IMAGE_TYPES[file.mimetype]))
});

// ---------- Định nghĩa các loại nội dung ----------
const categoryOptions = [['women', 'Thời trang nữ'], ['accessories', 'Phụ kiện']];
const SCHEMAS = {
  products: {
    label: 'Sản phẩm', singular: 'sản phẩm', titleField: 'name',
    columns: [['images', 'Ảnh'], ['name', 'Tên'], ['category', 'Danh mục'], ['price', 'Giá'], ['published', 'Hiển thị']],
    fields: [
      { name: 'name', label: 'Tên sản phẩm', type: 'i18n', required: true },
      { name: 'slug', label: 'Đường dẫn (slug)', type: 'slug', help: 'Để trống để tự tạo từ tên tiếng Việt.' },
      { name: 'category', label: 'Danh mục', type: 'select', options: () => categoryOptions },
      { name: 'collection', label: 'Bộ sưu tập', type: 'select', options: () => [['', '— Không —'], ...store.all('collections').map((c) => [c.slug, c.name.vi])] },
      { name: 'price', label: 'Giá (VNĐ)', type: 'number', help: 'Chỉ nhập số, ví dụ 48500000.' },
      { name: 'description', label: 'Mô tả', type: 'i18n-text' },
      { name: 'materials', label: 'Chất liệu & chăm sóc', type: 'i18n-text' },
      { name: 'images', label: 'Ảnh sản phẩm', type: 'images', help: 'Mỗi dòng một ảnh; ảnh đầu tiên là ảnh đại diện. Có thể tải thêm ảnh bên dưới.' },
      { name: 'featured', label: 'Nổi bật trên trang chủ', type: 'checkbox' },
      { name: 'published', label: 'Hiển thị trên website', type: 'checkbox', default: true }
    ]
  },
  collections: {
    label: 'Bộ sưu tập', singular: 'bộ sưu tập', titleField: 'name',
    columns: [['cover', 'Ảnh'], ['name', 'Tên'], ['season', 'Mùa'], ['published', 'Hiển thị']],
    fields: [
      { name: 'name', label: 'Tên bộ sưu tập', type: 'i18n', required: true },
      { name: 'slug', label: 'Đường dẫn (slug)', type: 'slug', help: 'Để trống để tự tạo. Đổi slug sẽ làm sản phẩm mất liên kết với bộ sưu tập.' },
      { name: 'season', label: 'Mùa / phụ đề', type: 'i18n' },
      { name: 'description', label: 'Mô tả', type: 'i18n-text' },
      { name: 'cover', label: 'Ảnh bìa', type: 'image' },
      { name: 'published', label: 'Hiển thị trên website', type: 'checkbox', default: true }
    ]
  },
  posts: {
    label: 'Journal', singular: 'bài viết', titleField: 'title',
    columns: [['cover', 'Ảnh'], ['title', 'Tiêu đề'], ['date', 'Ngày'], ['published', 'Hiển thị']],
    fields: [
      { name: 'title', label: 'Tiêu đề', type: 'i18n', required: true },
      { name: 'slug', label: 'Đường dẫn (slug)', type: 'slug', help: 'Để trống để tự tạo.' },
      { name: 'date', label: 'Ngày đăng', type: 'date' },
      { name: 'excerpt', label: 'Tóm tắt', type: 'i18n-text', rows: 2 },
      { name: 'body', label: 'Nội dung', type: 'i18n-text', rows: 10, help: 'Cách một dòng trống để xuống đoạn mới.' },
      { name: 'cover', label: 'Ảnh bìa', type: 'image' },
      { name: 'published', label: 'Hiển thị trên website', type: 'checkbox', default: true }
    ]
  }
};

const SETTINGS_FIELDS = [
  { name: 'address', label: 'Địa chỉ showroom', type: 'i18n' },
  { name: 'phone', label: 'Số điện thoại', type: 'text' },
  { name: 'email', label: 'Email liên hệ', type: 'text' },
  { name: 'instagram', label: 'Link Instagram', type: 'text' },
  { name: 'facebook', label: 'Link Facebook', type: 'text' },
  { name: 'heroImage', label: 'Ảnh trang chủ (trái)', type: 'image' },
  { name: 'heroImage2', label: 'Ảnh trang chủ (phải)', type: 'image' },
  { name: 'atelierImage', label: 'Ảnh xưởng may', type: 'image' },
  { name: 'appointmentImage', label: 'Ảnh trang đặt lịch', type: 'image' }
];

// ---------- Middleware ----------
router.use((req, res, next) => {
  res.locals.lang = 'vi';
  res.locals.t = strings.vi;
  res.locals.schemas = SCHEMAS;
  res.locals.path = req.path;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  next();
});

function checkCsrf(req) {
  if (!req.body || req.body._csrf !== req.session.csrf) {
    const err = new Error('csrf');
    err.code = 'EBADCSRF';
    throw err;
  }
}

function requireAuth(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
}

const flash = (req, message, type = 'success') => { req.session.flash = { message, type }; };

// ---------- Đăng nhập ----------
const attempts = new Map();
function tooManyAttempts(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  attempts.set(ip, recent);
  return recent.length >= 10;
}

function passwordMatches(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = crypto.createHash('sha256').update(String(input || '')).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

router.get('/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null, configured: Boolean(process.env.ADMIN_PASSWORD) });
});

router.post('/login', (req, res) => {
  checkCsrf(req);
  const configured = Boolean(process.env.ADMIN_PASSWORD);
  if (tooManyAttempts(req.ip)) {
    return res.status(429).render('admin/login', { error: 'Bạn đã thử quá nhiều lần. Vui lòng đợi 15 phút.', configured });
  }
  if (!passwordMatches(req.body.password)) {
    attempts.get(req.ip).push(Date.now());
    return res.status(401).render('admin/login', { error: 'Mật khẩu không đúng.', configured });
  }
  attempts.delete(req.ip);
  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.admin = true;
    req.session.csrf = crypto.randomBytes(24).toString('hex');
    res.redirect('/admin');
  });
});

router.post('/logout', requireAuth, (req, res) => {
  checkCsrf(req);
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.use(requireAuth);

// ---------- Tổng quan ----------
router.get('/', (req, res) => {
  const appointments = store.all('appointments');
  res.render('admin/dashboard', {
    counts: {
      products: store.all('products').length,
      collections: store.all('collections').length,
      posts: store.all('posts').length,
      newAppointments: appointments.filter((a) => a.status === 'new').length
    },
    latest: appointments.slice(0, 5)
  });
});

// ---------- Đọc form theo schema ----------
function readFields(fields, body, files, existing = {}) {
  const data = {};
  const uploaded = (name) => (files || []).filter((f) => f.fieldname === name).map((f) => `/uploads/${f.filename}`);
  for (const f of fields) {
    const raw = body[f.name];
    switch (f.type) {
      case 'i18n':
      case 'i18n-text':
        data[f.name] = { vi: String(body[`${f.name}_vi`] || '').trim(), en: String(body[`${f.name}_en`] || '').trim() };
        break;
      case 'number': {
        const digits = String(raw || '').replace(/[^\d]/g, '');
        data[f.name] = digits ? Number(digits) : null;
        break;
      }
      case 'checkbox':
        data[f.name] = raw === 'on';
        break;
      case 'images': {
        const list = String(raw || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        data[f.name] = [...list, ...uploaded(`${f.name}_upload`)];
        break;
      }
      case 'image': {
        const up = uploaded(`${f.name}_upload`);
        data[f.name] = up[0] || String(raw || '').trim() || existing[f.name] || '';
        break;
      }
      default:
        data[f.name] = String(raw || '').trim();
    }
  }
  return data;
}

function uniqueSlug(type, wanted, id) {
  let slug = slugify(wanted);
  let i = 2;
  const base = slug;
  while (store.find(type, (x) => x.slug === slug && x.id !== id)) slug = `${base}-${i++}`;
  return slug;
}

// ---------- CRUD chung ----------
router.param('type', (req, res, next, type) => {
  if (!SCHEMAS[type]) return res.status(404).send('Không tìm thấy');
  req.schema = SCHEMAS[type];
  next();
});

router.get('/content/:type', (req, res) => {
  res.render('admin/list', { type: req.params.type, schema: req.schema, items: store.all(req.params.type) });
});

const renderForm = (res, type, schema, item, errors = {}) =>
  res.render('admin/form', { type, schema, fields: schema.fields, item, errors, action: item.id ? `/admin/content/${type}/${item.id}` : `/admin/content/${type}`, title: item.id ? `Sửa ${schema.singular}` : `Thêm ${schema.singular}` });

router.get('/content/:type/new', (req, res) => {
  const item = {};
  req.schema.fields.forEach((f) => { if (f.default !== undefined) item[f.name] = f.default; });
  if (req.params.type === 'posts') item.date = new Date().toISOString().slice(0, 10);
  renderForm(res, req.params.type, req.schema, item);
});

router.get('/content/:type/:id', (req, res) => {
  const item = store.byId(req.params.type, req.params.id);
  if (!item) return res.status(404).send('Không tìm thấy');
  renderForm(res, req.params.type, req.schema, item);
});

function save(req, res) {
  checkCsrf(req);
  const { type, id } = req.params;
  const existing = id ? store.byId(type, id) : {};
  if (id && !existing) return res.status(404).send('Không tìm thấy');
  const data = readFields(req.schema.fields, req.body, req.files, existing);
  const titleVi = data[req.schema.titleField].vi;
  if (!titleVi) {
    return renderForm(res.status(422), type, req.schema, { ...existing, ...data }, { [req.schema.titleField]: 'Vui lòng nhập tên tiếng Việt.' });
  }
  if (!data.name?.en && data.name) data.name.en = data.name.vi;
  if (!data.title?.en && data.title) data.title.en = data.title.vi;
  data.slug = uniqueSlug(type, data.slug || titleVi, id);
  if (id) store.update(type, id, data);
  else store.insert(type, data);
  flash(req, `Đã lưu ${req.schema.singular} “${titleVi}”.`);
  res.redirect(`/admin/content/${type}`);
}

router.post('/content/:type', upload.any(), save);
router.post('/content/:type/:id', upload.any(), save);

router.post('/content/:type/:id/delete', (req, res) => {
  checkCsrf(req);
  store.remove(req.params.type, req.params.id);
  flash(req, `Đã xoá ${req.schema.singular}.`);
  res.redirect(`/admin/content/${req.params.type}`);
});

// ---------- Lịch hẹn ----------
router.get('/appointments', (req, res) => {
  const products = Object.fromEntries(store.all('products').map((p) => [p.slug, p.name.vi]));
  res.render('admin/appointments', { items: store.all('appointments'), products });
});

router.post('/appointments/:id', (req, res) => {
  checkCsrf(req);
  if (req.body.action === 'delete') {
    store.remove('appointments', req.params.id);
    flash(req, 'Đã xoá lịch hẹn.');
  } else if (['new', 'contacted', 'done'].includes(req.body.status)) {
    store.update('appointments', req.params.id, { status: req.body.status });
    flash(req, 'Đã cập nhật trạng thái.');
  }
  res.redirect('/admin/appointments');
});

// ---------- Cài đặt ----------
router.get('/settings', (req, res) => {
  res.render('admin/form', { type: 'settings', schema: { label: 'Cài đặt', singular: 'cài đặt' }, fields: SETTINGS_FIELDS, item: store.settings(), errors: {}, action: '/admin/settings', title: 'Cài đặt website' });
});

router.post('/settings', upload.any(), (req, res) => {
  checkCsrf(req);
  store.saveSettings(readFields(SETTINGS_FIELDS, req.body, req.files, store.settings()));
  flash(req, 'Đã lưu cài đặt.');
  res.redirect('/admin/settings');
});

module.exports = router;
