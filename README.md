# 🏠 StayScape (Airbnb Clone)

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7+-1B222D?style=for-the-badge&logo=prisma)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**StayScape** là một ứng dụng web mô phỏng (clone) nền tảng đặt phòng trực tuyến Airbnb. Dự án cung cấp đầy đủ các luồng chức năng từ tìm kiếm, xem chi tiết phòng, đặt phòng (dành cho Guest) đến quản lý danh sách phòng cho thuê (dành cho Host), kèm theo hệ thống xác thực người dùng an toàn.

**Link Demo:** [https://airbnb-clone-neon-nine.vercel.app/](https://airbnb-clone-neon-nine.vercel.app/)

---

## 📸 1. Hình ảnh trực quan (Screenshots / UI Demo)

### Trang Chủ & Thanh Tìm kiếm

<img src="./public/docs/images/homepage.png" alt="Homepage" width="100%"/>

<small><strong>Hình 1:</strong> Trang chủ và thanh tìm kiếm</small>

### Chi tiết Nơi ở (Listing Detail)

<img src="./public/docs/images/listing-detail.png" alt="Listing Details" width="100%"/>

<small><strong>Hình 2:</strong> Chi tiết nơi ở</small>

### Quản lý Đặt phòng (Bookings)

<img src="./public/docs/images/manage-bookings.png" alt="Reservations" width="100%"/>

<small><strong>Hình 3:</strong> Quản lý đặt phòng</small>

### Dashboard Quản trị (Host)

<img src="./public/docs/images/manage-hostings.png" alt="Host Dashboard" width="100%"/>

<small><strong>Hình 4:</strong> Dashboard quản trị chủ nhà</small>

---

## 🛠️ 2. Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng theo kiến trúc Fullstack trực tiếp trong Next.js App Router, kết hợp với ORM mạnh mẽ và hệ sinh thái thư viện hiện đại:

- **Core Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL kết hợp [Prisma ORM v7](https://www.prisma.io/) (với `@prisma/adapter-pg` cho kết nối trực tiếp)
- **Authentication:** [NextAuth.js (Auth.js)](https://next-auth.js.org/) hỗ trợ đăng nhập qua Credentials (Email/Password) và Google OAuth.
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI base, Lucide Icons, `react-day-picker` (chọn ngày đặt phòng).
- **Date Handling:** `date-fns`
- **File Upload:** UploadThing (Xử lý tải ảnh phòng lên cloud).

---

## ✨ 3. Tính năng chính (Key Features)

### 🏨 Phân hệ Khách (Guest)

- **Tìm kiếm nâng cao:** Thanh tìm kiếm đa bước (Location, Dates, Guests) hỗ trợ hiển thị popover thông minh.
- **Duyệt danh sách:** Lưới hiển thị danh sách phòng mô phỏng giao diện Airbnb với ảnh thu nhỏ, tên, địa điểm và giá.
- **Chi tiết & Đặt phòng:** Xem thông tin chi tiết phòng, thư viện ảnh (Image Gallery), vị trí bản đồ (Listing Map).
- **Form Đặt phòng:** Cho phép chọn ngày (với các ngày đã được đặt trước bị vô hiệu hóa), tính tổng giá phòng (tích hợp logic phí nền tảng), và gửi yêu cầu (Reservation).
- **Quản lý Đặt phòng:** Trang `/bookings` hiển thị các chuyến đi sắp tới và chuyến đi trong quá khứ, hỗ trợ hủy đặt phòng.

### 🔑 Phân hệ Chủ nhà (Host)

- **Host Dashboard:** Trang `/host` quản lý toàn bộ danh sách phòng mà người dùng đang cho thuê.
- **Tạo & Cập nhật phòng:** Form quản lý nơi ở cho phép chỉnh sửa tiêu đề, mô tả, sức chứa (người lớn/trẻ em), phòng tắm/phòng ngủ, giá mỗi đêm, và quản lý thư viện ảnh.
- **Xem thống kê:** Hiển thị nhanh các chỉ số cơ bản của phòng.

### 🛡️ Xác thực & Hệ thống (System)

- **Đăng ký/Đăng nhập:** Hỗ trợ đăng nhập Email/Password với mật khẩu được băm an toàn, hoặc sử dụng Google Login.
- **Bảo vệ Route:** Tự động chặn truy cập vào các trang `/bookings` hoặc `/host` nếu chưa đăng nhập.
- **Seed Data:** Có sẵn script tự động tạo dữ liệu mẫu (Demo Properties tại NY, LA, Miami, Chicago, SF) để dễ dàng thử nghiệm.

---

## 🚀 4. Yêu cầu hệ thống và Cài đặt (Getting Started)

### Yêu cầu môi trường (Prerequisites)

- **Node.js:** `>= 20.19.0` (Yêu cầu bắt buộc đối với Prisma v7)
- **TypeScript:** `>= 5.4.0`
- Cơ sở dữ liệu **PostgreSQL** (Có thể sử dụng Prisma Postgres, Neon, hoặc Local DB).

### Biến môi trường (Environment Variables)

Tạo file `.env` ở thư mục gốc và cấu hình các giá trị sau:

```env
# Database Connection (PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@host:5432/stayscape?sslmode=require"

# NextAuth Secrets & URLs
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_key"

# (Tuỳ chọn) Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# UploadThing (Quản lý hình ảnh)
UPLOADTHING_TOKEN='your_uploadthing_token'
```

### Các lệnh khởi chạy

1. Cài đặt các gói phụ thuộc:

   ```bash
   npm install
   ```

2. Cài đặt Database & Sinh Type cho Prisma:
   _Do dự án sử dụng Prisma v7, bạn cần push schema và sinh client._

   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. (Tuỳ chọn) Đổ dữ liệu mẫu (Seed):
   _Nạp dữ liệu các căn hộ mẫu vào DB._

   ```bash
   npx tsx prisma/seed.ts
   ```

4. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
   > Truy cập http://localhost:3000 để xem ứng dụng.

---

## 📁 5. Cấu trúc thư mục (Folder Structure)

```text
/
├── .windsurf/
│   └── prisma/           # Schema của Prisma ORM (schema.prisma, migrations, seed)
├── public/
│   ├── images/           # Ảnh mẫu (listings)
│   └── icon.svg          # Favicon/Logo
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # Route Handlers (NextAuth, UploadThing)
│   │   ├── bookings/     # Trang quản lý chuyến đi của Guest
│   │   ├── host/         # Dashboard quản lý của Chủ nhà
│   │   ├── listings/     # Chi tiết phòng & đặt phòng
│   │   ├── login/        # Trang đăng nhập
│   │   ├── register/     # Trang đăng ký
│   │   ├── actions.ts    # Server Actions (Xử lý form, db mutation)
│   │   └── page.tsx      # Trang chủ (Homepage)
│   ├── auth/             # Cấu hình NextAuth.js
│   ├── components/       # Các UI Component tái sử dụng
│   │   ├── bookings/     # Card lịch sử đặt phòng
│   │   ├── host/         # UI Dashboard của Host
│   │   ├── listing/      # Các component chi tiết (Gallery, Map, Sidebar, Calendar...)
│   │   └── ui/           # Base UI Components (PageIntro, StatCard...)
│   ├── data/             # Dữ liệu tĩnh/Seed data (us-listings-seed.ts)
│   ├── lib/              # Các hàm tiện ích (auth, prisma, utils, date...)
│   └── types/            # Khai báo kiểu TypeScript
├── prisma.config.ts      # Cấu hình Prisma v7 CLI
└── package.json          # Quản lý dependencies
```

---

## 🏗️ 6. Điểm nổi bật về Kỹ thuật (Technical Highlights)

- **Kiến trúc Server Actions:** Thay vì xây dựng API routes rời rạc cho từng chức năng (CRUD listing, đặt phòng, hủy phòng), dự án sử dụng Next.js Server Actions (`src/app/actions.ts`) để tương tác trực tiếp và an toàn với cơ sở dữ liệu.
- **Prisma v7 Driver Adapters:** Dự án áp dụng chuẩn mới nhất của Prisma (v7), sử dụng `@prisma/adapter-pg` và thư viện `pg` thuần để quản lý kết nối (`src/lib/prisma.ts`), giúp tương thích tốt hơn với môi trường Serverless/Edge nếu cần scale.
- **Quản lý Date/Time Phức tạp:** Component `ListingReservationForm` và `ListingBookingSidebar` xử lý logic vô hiệu hóa các ngày đã được đặt (`unavailableRanges`), đảm bảo luồng booking không bị trùng lặp thời gian.
