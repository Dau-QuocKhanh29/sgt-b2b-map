# SGT B2B Map Frontend

Frontend React/Vite cho dự án SGT B2B Map. Giao diện kế thừa prototype đã duyệt nhưng thay bản đồ SVG bằng Leaflet world map thật.

## Công nghệ

- React 19 + Vite 8, JavaScript JSX.
- React Router.
- Leaflet + React Leaflet.
- `react-leaflet-cluster` cho marker clustering và spiderfy vị trí trùng.
- `leaflet.heat` cho heatmap.
- Axios cho tầng API tương lai.
- Vitest cho logic filter/thống kê.

Yêu cầu Node.js `^20.19.0` hoặc `>=22.12.0`. Môi trường đã kiểm tra dùng Node 22.19.0.

## Nguồn mock data

`src/features/partners/data/mockPartners.json` được sinh từ:

`../BackEnd/src/main/resources/db/dev-seed/V0__dev_seed_200_partners.sql`

Lệnh tạo lại:

```bash
npm run generate:mock
```

Dataset có 200 Partner hư cấu, 180 mapped và 20 unmapped tại 15 quốc gia. Đây là dữ liệu development, không phải dữ liệu công ty hoặc kết nối MySQL trực tiếp.

## Chạy trong VS Code

```bash
cd D:/Maps/FrontEnd
npm install
npm run dev
```

Mở URL Vite in ra, mặc định `http://127.0.0.1:5173`.

Trong development, `.env.development` bật nút **Xem bản đồ demo**. Nút này tạo một cờ phiên cục bộ trong `sessionStorage`, không gửi thông tin đăng nhập và không phải cơ chế xác thực. Luồng **Đăng nhập** luôn dành riêng cho Backend API thật.

## Chế độ demo

Chế độ demo dùng `src/features/partners/data/mockPartners.json`, chỉ chứa 200 Partner hư cấu. Khi phiên demo đang hoạt động, `partnerService` luôn chọn mock data dù `VITE_DATA_SOURCE=api`; vì vậy marker, cluster, heatmap, popup, sidebar và filters không phụ thuộc Backend.

Biến môi trường đề xuất trên Vercel cho bản trải nghiệm:

```env
VITE_ENABLE_DEMO_MODE=true
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://your-spring-api.example.com/api/v1
```

Có thể bỏ trống `VITE_API_BASE_URL` nếu bản deploy hiện chỉ dùng demo. Khi đó nút đăng nhập thật sẽ báo Backend chưa được cấu hình thay vì gọi `localhost`. Không đặt password, JWT hoặc secret trong biến `VITE_*` vì các giá trị này được đưa vào bundle trình duyệt.

## Kiểm tra

```bash
npm run lint
npm test
npm run build
```

## Chuyển sang Backend API

Tạo `.env.local`:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENABLE_DEMO_MODE=false
```

Tầng `partnerService` đã chuẩn bị các hàm:

- `getPartners`
- `getPartnerById`
- `getMapPoints`
- `getMapSummary`
- `getFilterOptions`

Contract API vẫn phải được chốt với Backend. Không đưa secret hoặc private tile key vào source.

## Tile provider

Development mặc định dùng ArcGIS World Street Map với attribution. Trước production phải xác nhận nhà cung cấp, license, quota và thay `VITE_MAP_TILE_URL`/`VITE_MAP_ATTRIBUTION` nếu cần.
# sgt-b2b-map
