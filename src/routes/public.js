const express = require('express');
const store = require('../store');
const { strings } = require('../i18n');

function baseLocals(req, lang, extra = {}) {
  const prefix = lang === 'en' ? '/en' : '';
  // Đường dẫn hiện tại không kèm tiền tố ngôn ngữ, để tạo liên kết chuyển ngôn ngữ.
  const rel = (req.originalUrl.replace(/^\/en(?=\/|$|\?)/, '') || '/').split('?')[0];
  const url = (p = '/') => (prefix + (p === '/' ? '' : p)) || '/';
  return {
    lang,
    t: strings[lang],
    tr: (obj) => (obj && typeof obj === 'object' ? obj[lang] || obj.vi || '' : obj || ''),
    url,
    current: rel,
    altUrl: lang === 'en' ? rel : `/en${rel === '/' ? '' : rel}`,
    canonical: url(rel),
    description: strings[lang].home.manifesto,
    ...extra
  };
}

const published = (name) => store.all(name).filter((x) => x.published !== false);
const productsOf = (collectionSlug) => published('products').filter((p) => p.collection === collectionSlug);

// Chống spam đơn giản: tối đa 5 yêu cầu đặt lịch mỗi 10 phút cho mỗi IP.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function validate(body, t) {
  const errors = {};
  const today = new Date().toISOString().slice(0, 10);
  if (!body.name || body.name.trim().length < 2) errors.name = t.appt.errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email || '')) errors.email = t.appt.errors.email;
  const digits = String(body.phone || '').replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 11) errors.phone = t.appt.errors.phone;
  if (!body.date || body.date < today) errors.date = t.appt.errors.date;
  return errors;
}

module.exports = function publicRoutes(lang) {
  const router = express.Router();
  const t = strings[lang];
  const render = (req, res, view, extra) => res.render(view, baseLocals(req, lang, extra));

  router.get('/', (req, res) => {
    const products = published('products');
    render(req, res, 'home', {
      title: null,
      featured: products.filter((p) => p.featured).slice(0, 6),
      collections: published('collections'),
      posts: published('posts').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
    });
  });

  router.get('/collections', (req, res) => {
    const category = ['women', 'accessories'].includes(req.query.category) ? req.query.category : null;
    const products = published('products').filter((p) => !category || p.category === category);
    render(req, res, 'shop', {
      title: category ? t.product.category[category] : t.nav.collections,
      category,
      products,
      collections: published('collections')
    });
  });

  router.get('/collections/:slug', (req, res, next) => {
    const collection = published('collections').find((c) => c.slug === req.params.slug);
    if (!collection) return next();
    render(req, res, 'collection', {
      title: collection.name[lang],
      description: collection.description[lang],
      collection,
      products: productsOf(collection.slug)
    });
  });

  router.get('/products/:slug', (req, res, next) => {
    const product = published('products').find((p) => p.slug === req.params.slug);
    if (!product) return next();
    const collection = store.find('collections', (c) => c.slug === product.collection);
    const related = published('products')
      .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
      .slice(0, 4);
    render(req, res, 'product', {
      title: product.name[lang],
      description: product.description[lang],
      product,
      collection,
      related
    });
  });

  router.get('/journal', (req, res) => {
    render(req, res, 'journal', {
      title: t.journal.title,
      description: t.journal.intro,
      posts: published('posts').sort((a, b) => b.date.localeCompare(a.date))
    });
  });

  router.get('/journal/:slug', (req, res, next) => {
    const post = published('posts').find((p) => p.slug === req.params.slug);
    if (!post) return next();
    const more = published('posts').filter((p) => p.id !== post.id).slice(0, 2);
    render(req, res, 'post', { title: post.title[lang], description: post.excerpt[lang], post, more });
  });

  router.get('/about', (req, res) => {
    render(req, res, 'about', { title: t.about.title, description: t.about.lead });
  });

  const apptLocals = (req, extra) => ({
    title: t.appt.title,
    description: t.appt.intro,
    products: published('products'),
    values: { product: req.query.product || '', service: 'fitting', time: 'afternoon' },
    errors: {},
    success: false,
    today: new Date().toISOString().slice(0, 10),
    ...extra
  });

  router.get('/appointment', (req, res) => {
    render(req, res, 'appointment', apptLocals(req, { success: req.query.sent === '1' }));
  });

  router.post('/appointment', (req, res) => {
    const body = req.body || {};
    if (body._csrf !== req.session.csrf) {
      const err = new Error('csrf');
      err.code = 'EBADCSRF';
      throw err;
    }
    // Trường bẫy: người thật không thấy, bot thường tự điền.
    if (body.website) return res.redirect(303, baseLocals(req, lang).url('/appointment') + '?sent=1');

    const errors = validate(body, t);
    if (Object.keys(errors).length) {
      return res.status(422).render('appointment', baseLocals(req, lang, apptLocals(req, { values: body, errors })));
    }
    if (rateLimited(req.ip)) {
      return res.status(429).render('appointment', baseLocals(req, lang, apptLocals(req, { values: body, errors: { form: 'Too many requests. Please try again later.' } })));
    }
    const clip = (v, n) => String(v || '').trim().slice(0, n);
    store.insert('appointments', {
      name: clip(body.name, 120),
      email: clip(body.email, 160),
      phone: clip(body.phone, 30),
      date: clip(body.date, 10),
      time: ['morning', 'afternoon', 'evening'].includes(body.time) ? body.time : 'afternoon',
      service: ['fitting', 'styling', 'bridal', 'other'].includes(body.service) ? body.service : 'other',
      product: clip(body.product, 120),
      message: clip(body.message, 2000),
      lang,
      status: 'new'
    });
    res.redirect(303, baseLocals(req, lang).url('/appointment') + '?sent=1');
  });

  return router;
};

module.exports.baseLocals = baseLocals;
