// Lưu trữ dữ liệu bằng file JSON.
// DATA_DIR nên trỏ ra NGOÀI thư mục ứng dụng trên Hostinger để dữ liệu
// không bị ghi đè khi deploy lại từ GitHub (xem DEPLOY.md).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const SEED_DIR = path.join(__dirname, '..', 'seed');
const COLLECTIONS = ['products', 'collections', 'posts', 'appointments', 'settings'];

const cache = {};

function file(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function init() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  for (const name of COLLECTIONS) {
    if (!fs.existsSync(file(name))) {
      const seed = path.join(SEED_DIR, `${name}.json`);
      const fallback = name === 'settings' ? '{}' : '[]';
      fs.writeFileSync(file(name), fs.existsSync(seed) ? fs.readFileSync(seed) : fallback);
    }
    cache[name] = JSON.parse(fs.readFileSync(file(name), 'utf8'));
  }
}

// Ghi nguyên tử: ghi file tạm rồi đổi tên, tránh hỏng file nếu tiến trình bị dừng giữa chừng.
function persist(name) {
  const tmp = `${file(name)}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(cache[name], null, 2));
  fs.renameSync(tmp, file(name));
}

function all(name) {
  return cache[name];
}

function find(name, predicate) {
  return cache[name].find(predicate);
}

function byId(name, id) {
  return find(name, (x) => x.id === id);
}

function insert(name, item) {
  const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item };
  cache[name].unshift(record);
  persist(name);
  return record;
}

function update(name, id, patch) {
  const record = byId(name, id);
  if (!record) return null;
  Object.assign(record, patch, { updatedAt: new Date().toISOString() });
  persist(name);
  return record;
}

function remove(name, id) {
  const before = cache[name].length;
  cache[name] = cache[name].filter((x) => x.id !== id);
  if (cache[name].length !== before) persist(name);
}

function settings() {
  return cache.settings;
}

function saveSettings(patch) {
  cache.settings = { ...cache.settings, ...patch };
  persist('settings');
}

module.exports = { DATA_DIR, UPLOAD_DIR, init, all, find, byId, insert, update, remove, settings, saveSettings };
