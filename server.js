require('./src/env').load();

const path = require('path');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const helmet = require('helmet');
const compression = require('compression');
const crypto = require('crypto');

const store = require('./src/store');
const helpers = require('./src/helpers');
const publicRoutes = require('./src/routes/public');
const adminRoutes = require('./src/routes/admin');

store.init();

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

if (isProd && !process.env.SESSION_SECRET) {
  console.warn('[cảnh báo] Chưa đặt SESSION_SECRET — phiên đăng nhập admin sẽ mất mỗi lần khởi động lại.');
}
if (!process.env.ADMIN_PASSWORD) {
  console.warn('[cảnh báo] Chưa đặt ADMIN_PASSWORD — trang quản trị đang bị khoá cho tới khi bạn đặt mật khẩu.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://images.pexels.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: isProd ? '7d' : 0 }));
app.use('/uploads', express.static(store.UPLOAD_DIR, { maxAge: isProd ? '30d' : 0 }));
app.use(express.urlencoded({ extended: false, limit: '200kb' }));

app.use(session({
  name: 'pf.sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: { httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 1000 * 60 * 60 * 8 }
}));

// Mã CSRF đơn giản theo phiên, dùng cho mọi form POST.
app.use((req, res, next) => {
  if (!req.session.csrf) req.session.csrf = crypto.randomBytes(24).toString('hex');
  res.locals.csrf = req.session.csrf;
  res.locals.h = helpers;
  res.locals.settings = store.settings();
  next();
});

app.use('/admin', adminRoutes);
app.use('/en', publicRoutes('en'));
app.use('/', publicRoutes('vi'));

app.use((req, res) => {
  const lang = req.path.startsWith('/en') ? 'en' : 'vi';
  res.status(404).render('404', publicRoutes.baseLocals(req, lang, { title: '404' }));
});

app.use((err, req, res, _next) => {
  console.error(err);
  if (err.code === 'EBADCSRF') return res.status(403).send('Phiên làm việc đã hết hạn. Vui lòng tải lại trang và thử lại.');
  res.status(500).send('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
});

app.listen(PORT, () => {
  console.log(`PHUC FASHION đang chạy tại http://localhost:${PORT}`);
  console.log(`Dữ liệu lưu tại: ${store.DATA_DIR}`);
});
