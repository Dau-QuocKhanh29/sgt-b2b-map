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

Trong development, `.env.development` bật mock authentication. Nhập email hợp lệ và mật khẩu bất kỳ để kiểm thử UI; mật khẩu không được lưu và cơ chế này không phải bảo mật thật. Production build không bật mock authentication.

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
VITE_ENABLE_MOCK_AUTH=false
```

Tầng `partnerService` đã chuẩn bị các hàm:

- `getPartners`
- `getPartnerById`
- `getMapPoints`
- `getMapSummary`
- `getFilterOptions`

Contract API vẫn phải được chốt với Backend. Không đưa secret hoặc private tile key vào source.

## Tile provider

Development mặc định dùng OpenStreetMap Standard với attribution. Trước production phải xác nhận nhà cung cấp, license, quota và thay `VITE_MAP_TILE_URL`/`VITE_MAP_ATTRIBUTION` nếu cần.
# sgt-b2b-map
