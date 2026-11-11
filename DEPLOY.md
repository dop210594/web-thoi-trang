# Push lên GitHub và deploy lên Hostinger

## 1. Push lên GitHub

1. Vào https://github.com/new, tạo repository mới (nên để **Private**), **không** tích "Add a README".
2. Trong thư mục `phuc-fashion`, chạy các lệnh sau (thay `TEN-BAN` bằng tài khoản GitHub của bạn):

```bash
git remote add origin https://github.com/TEN-BAN/phuc-fashion.git
git push -u origin main
```

Lần push đầu tiên, Git sẽ mở cửa sổ đăng nhập GitHub.

File `.env` (chứa mật khẩu) và thư mục `data/` đã nằm trong `.gitignore` nên **không** bị đẩy lên GitHub.

## 2. Tạo ứng dụng Node.js trên Hostinger (gói Business / Cloud)

Giao diện hPanel có thể thay đổi đôi chút, nhưng các bước chính như sau:

1. hPanel → **Websites** → **Add website** → chọn **Node.js Apps**.
2. Chọn **Import Git repository**, kết nối tài khoản GitHub và chọn repo `phuc-fashion`, nhánh `main`.
3. Cấu hình build:
   - Framework: **Express** (hoặc "Other")
   - Node.js version: **20** trở lên (khuyên dùng 22)
   - Entry file: `server.js`
   - Build command: để trống (hoặc `npm install`)
   - Start command: `npm start`
4. Thêm **Environment variables**:

| Biến | Giá trị |
|---|---|
| `NODE_ENV` | `production` |
| `ADMIN_PASSWORD` | mật khẩu admin dài, khó đoán |
| `SESSION_SECRET` | chuỗi ngẫu nhiên dài (xem cách tạo bên dưới) |
| `DATA_DIR` | đường dẫn **ngoài** thư mục ứng dụng, ví dụ `/home/u123456789/phuc-data` |

Tạo `SESSION_SECRET` bằng lệnh:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Bấm **Deploy**, rồi gắn tên miền của bạn vào ứng dụng.

### Vì sao phải đặt DATA_DIR?

Mỗi lần bạn push code mới, Hostinger build lại ứng dụng từ GitHub, và những file ghi trong thư mục ứng dụng có thể bị xoá, gồm sản phẩm thêm trong admin, lịch hẹn và ảnh tải lên. Đặt `DATA_DIR` ra ngoài thư mục ứng dụng giúp dữ liệu không bị mất.

- Đường dẫn thư mục home (dạng `/home/u…`) xem trong hPanel → **File Manager**, hoặc mục thông tin SSH.
- Sau lần deploy thứ hai, hãy vào `/admin` kiểm tra dữ liệu còn nguyên. Nếu bị mất, liên hệ hỗ trợ Hostinger để hỏi thư mục nào được giữ lại giữa các lần deploy.
- Thỉnh thoảng hãy sao lưu thư mục `DATA_DIR` (tải về qua File Manager).

## 3. Cập nhật website về sau

Sửa code → `git add -A` → `git commit -m "..."` → `git push`. Hostinger sẽ tự deploy lại (nếu đã bật auto-deploy), hoặc bạn bấm **Redeploy** trong hPanel.

## 4. Sau khi lên mạng

- Vào `https://ten-mien-cua-ban/admin`, đăng nhập bằng `ADMIN_PASSWORD`.
- Thay ảnh mẫu, giá, địa chỉ, số điện thoại và email bằng thông tin thật trong **Cài đặt** và **Sản phẩm**.
- Xoá các sản phẩm, bộ sưu tập và bài viết mẫu không dùng đến.
