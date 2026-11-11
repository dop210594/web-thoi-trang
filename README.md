# PHUC FASHION

Website showroom cho nhà mốt cao cấp PHUC FASHION, viết bằng Node.js + Express + EJS. Có hai ngôn ngữ (Việt / Anh), trang quản trị và dữ liệu lưu bằng file JSON.

## Tính năng

- **Trang công khai** (tiếng Việt ở `/`, tiếng Anh ở `/en`): Trang chủ, Bộ sưu tập (lọc Thời trang nữ / Phụ kiện), Chi tiết sản phẩm (giá VNĐ), Journal, Về chúng tôi, Đặt lịch hẹn.
- **Trang quản trị** `/admin`: quản lý sản phẩm, bộ sưu tập, bài Journal, xem và xử lý lịch hẹn, sửa thông tin liên hệ và ảnh trang chủ, tải ảnh lên.
- **Bảo mật cơ bản**: Helmet + CSP, chống CSRF, giới hạn số lần đăng nhập, trường bẫy chống spam, chỉ nhận file ảnh khi upload.
- **Giao diện**: tối giản đen – ngà – vàng đồng, chữ Cormorant + Montserrat, tương thích mobile, tôn trọng chế độ giảm chuyển động.

## Chạy trên máy

```bash
npm install
cp .env.example .env    # rồi điền ADMIN_PASSWORD và SESSION_SECRET
npm run dev             # http://localhost:3000
```

Lần chạy đầu, dữ liệu mẫu trong `seed/` được chép sang `data/` (hoặc sang `DATA_DIR` nếu bạn đặt biến này). Muốn quay về dữ liệu mẫu thì xoá thư mục `data/`.

## Cấu trúc

```
server.js              Khởi tạo Express, bảo mật, phiên đăng nhập
src/store.js           Đọc/ghi dữ liệu JSON (ghi nguyên tử)
src/i18n.js            Chuỗi giao diện Việt / Anh
src/routes/public.js   Các trang công khai + form đặt lịch
src/routes/admin.js    Trang quản trị
views/                 Giao diện EJS (views/admin cho trang quản trị)
public/                CSS, JS, favicon
seed/                  Dữ liệu mẫu ban đầu
```

## Ảnh

Ảnh mẫu là ảnh miễn phí từ Pexels, ghi trong dữ liệu dưới dạng `pexels:<id>`. Hãy thay bằng ảnh thật của thương hiệu trong `/admin`, bằng cách tải ảnh lên hoặc dán đường dẫn ảnh. Ảnh tải lên được lưu trong `DATA_DIR/uploads`.

Xem hướng dẫn deploy lên Hostinger trong [DEPLOY.md](DEPLOY.md).
