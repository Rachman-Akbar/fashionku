# Fashionku Marketplace - Arsitektur Lengkap

Dokumen ini merangkum **Database Schema**, **Backend (Laravel)**, **Frontend (React)**, dan **UI/UX** untuk project marketplace fashionku.

---

## 1. DATABASE SCHEMA (62 Tabel)

### 1.1 Identitas & Keamanan (9 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `users` | uuid | Akun pengguna (buyer/admin), Firebase UID, email, password, avatar, `is_active` (aktif/nonaktif — tanpa kolom banned) |
| `roles` | bigint | Master role: `admin`, `buyer`. Route seller dilayani role `admin` (`active.role:seller`) |
| `permissions` | bigint | Master izin granular |
| `user_roles` | composite | Pivot user ↔ role |
| `role_permissions` | composite | Pivot role ↔ permission |
| `otp_challenges` | uuid | OTP login/verifikasi (email/phone) |
| `registration_challenges` | uuid | Data sementara pendaftaran |
| `user_devices` | uuid | Perangkat & sesi Sanctum |
| `security_events` | uuid | Audit keamanan (login, gagal, dll) |

### 1.2 Pengaturan Toko & Alamat (4 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `app_settings` | bigint | Key-value config (profil toko di `store.*` keys) |
| `addresses` | bigint | Alamat user (label, recipient, lat/long, komerce_destination_id) |
| `shipping_settings` | bigint | Singleton ongkir (origin, rate per km, flat rate, free shipping) |
| `seller_customers` | bigint | Pelanggan toko (user_id unik, `code`, `note`, audit `created_by`/`updated_by`) |

### 1.3 Katalog (8 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `categories` | bigint | Hierarkis 3 level (parent_id, parent_scope_id, level, full_slug unik, is_visible_in_menu) |
| `product_attributes` | bigint | Master atribut (warna, ukuran, type: select/text) |
| `products` | bigint | Produk (code, slug unik, status draft/published/archived, allows_preorder, primary_category_id) |
| `product_categories` | composite | Pivot produk ↔ kategori (is_primary) |
| `product_attribute_values` | bigint | Nilai atribut level produk (unik per product+attribute) |
| `product_variants` | bigint | SKU & stok (sku global unik, price, price_original, price_sale, hpp, stock, po_stock, stock_reserved, stock_booked, stock_preorder, max_order_qty, min_stock, is_default) |
| `product_variant_values` | bigint | Nilai atribut per varian (unik per variant+attribute) |
| `product_images` | bigint | Galeri (url, alt_text, is_primary, sort_order) |

### 1.4 Promosi & Voucher (4 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `promotions` | bigint | Banner promosi (click_action: none/product/category/url, `is_active`, urutan `sort_order`). **Tanpa approval & tanpa pembayaran**: simpan = langsung tayang |
| `vouchers` | bigint | Voucher toko (code unik, `discount_target`, `discount_type` fixed/percentage, `discount_value`, `min_spend`, `min_items`, `min_distinct_products`, `max_discount`, `usage_limit`, `usage_limit_per_user`, `used_count`, `starts_at`, `ends_at`) |
| `voucher_products` | bigint | Pivot voucher ↔ produk (batasi produk yang bisa memakai voucher) |
| `user_vouchers` | bigint | Voucher diklaim user (status available/used/expired) |

> Tabel `promotion_payments` dan kolom antrean review (`approval_status`, `rejection_reason`, `submitted_at`, `approved_at`, `approved_by`) sudah **dihapus** — promosi tidak berbayar dan tidak butuh approval.

### 1.5 Belanja & Pesanan (9 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `carts` | bigint | Keranjang 1:1 user (user_id unik) |
| `cart_items` | bigint | Item keranjang (unik per cart+variant) |
| `wishlists` | uuid | Wishlist bernama (unik per user+name) |
| `wishlist_items` | bigint | Item wishlist (unik per wishlist+product) |
| `orders` | bigint | Header pesanan (order_number unik, order_type, is_preorder, scheduled_at, pickup_at, user_id, voucher_id, total_amount, discount_amount, shipping_discount_amount, payment_method, midtrans_snap_token, status, payment_status) |
| `sub_orders` | bigint | Kelompok item per pengiriman (courier, service, destination_id, tracking_number) |
| `order_items` | bigint | Snapshot item (product_name, sku, price, quantity, thumbnail) |
| `payments` | bigint | Transaksi gateway (order_number FK, transaction_id, payload Midtrans) |
| `product_reviews` | bigint | Ulasan (rating 1-5, media json, order_item_id unik) |

### 1.6 Inventori & HPP (8 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `stock_movements` | bigint | Ledger stok varian (product_id, variant_id, order_id, movement_key untuk idempotensi, type, quantity_delta, balance_after, stock_dimension, reference_type/reference_id, notes, occurred_at) |
| `raw_materials` | bigint | Bahan baku (code unik, unit, image, stock & minimum_stock decimal(18,4), average_cost, is_active) |
| `raw_material_stock_movements` | bigint | Ledger bahan baku (quantity_delta, unit_cost, total_cost) |
| `raw_material_cost_histories` | bigint | Riwayat harga rata-rata bahan |
| `product_costings` | bigint | HPP per produk 1:1 (material, labor, overhead, hpp, margin, suggested_price) |
| `product_materials` | bigint | BOM/resep level produk (quantity, unit_cost, total_cost) |
| `product_variant_materials` | bigint | BOM/resep level varian (variant_id, raw_material_id, quantity, unit_cost, total_cost) |
| `product_costing_impacts` | bigint | Dampak perubahan biaya bahan ke HPP |

### 1.7 Keuangan (2 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `financial_transactions` | bigint | Buku kas (type, category, amount, paid_amount, status open/paid, due_date) |
| `financial_payment_histories` | bigint | Riwayat pembayaran transaksi (balance_before/after, payment_method) |

### 1.8 Komunikasi & Dukungan (7 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `conversations` | bigint | Ruang chat (type: direct/order/store/announcement, target_role) |
| `conversation_participants` | composite | Peserta (last_read_at, is_muted) |
| `chat_messages` | bigint | Pesan (message_type, attachments json, edited_at) |
| `chat_message_reads` | composite | Read receipt per pesan |
| `support_tickets` | bigint | Tiket bantuan (ticket_number HLP-..., priority, status, assigned_to) |
| `support_ticket_messages` | bigint | Balasan tiket (is_internal, attachments) |
| `admin_notifications` | bigint | Notifikasi in-app (module, type, reference_type/id, url, meta json) |

### 1.9 Operasional & Penomoran (2 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `schedules` | bigint | Kalender/kanban (type, status, position, recurrence, date, capacity, completion_proof) |
| `code_patterns` | bigint | Pola penomoran dokumen (type, pattern) |

### 1.10 Infrastruktur Framework (9 tabel)
`password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `personal_access_tokens`, `migrations`

---

## 2. BACKEND ARCHITECTURE (Laravel 13, PHP 8.3)

### 2.1 Struktur Domain (DDD Modular)
```
app/Domains/
├── Admin/              # Notification in-app admin (routes admin/notifications)
├── Identity/           # Auth, User (role & permission menyatu di User)
├── Catalog/            # Category, Product, Promotion, Media, Spreadsheet
├── Order/              # Cart, Address, Wishlist, Ordering, Voucher, Payment, Review
├── Seller/             # Settings, Stock, Inventory, Schedule, Customers, Finance
├── Support/            # Ticket
├── Communication/      # Chat (conversation, message, read receipt)
├── Finance/            # Dashboard kas & hutang-piutang (/api/v1/finance)
└── Shared/             # Settings, Codes, Excel, Moderation, Infrastructure, Presentation
```

Setiap domain punya `routes.php` + `*ServiceProvider` sendiri yang didaftarkan lewat `app/Domains/routes.php` dan `DomainServiceProvider`.

### 2.2 Layer per Domain
```
Domain/<Domain>/<Subdomain>/
├── Domain/
│   ├── Entities/           # Core business objects (biasanya wrapper Eloquent)
│   └── Repositories/       # Interfaces (Contracts)
├── Application/
│   ├── UseCases/           # Business logic (single responsibility)
│   ├── Queries/            # Query list/detail (read model)
│   ├── Services/           # Domain service lintas use case (chrome: CustomerService, dsb)
│   ├── Dtos/               # Data Transfer Objects (PromotionData, CreateUserDTO, dst)
│   ├── Excel/              # Export/Import/Template per modul
│   └── Policies/           # Authorization policy (jika ada)
├── Infrastructure/
│   └── Persistence/
│       ├── Models/         # Eloquent Models
│       ├── Repositories/   # Implementasi Eloquent (interface di Domain)
│       └── Mappers/        # Entity ↔ Model mapping
└── Presentation/
    ├── Http/
    │   ├── Controllers/    # API Controllers
    │   ├── Requests/       # Form Requests (validation)
    │   └── Resources/      # API Resources (transformer)
    ├── Events/             # Broadcast event (ShouldBroadcastNow)
    └── routes.php          # Route definitions
```

Catatan pola:
- **Entity**: class final dengan property publik + `toArray()`; mapper mengubah `PromotionModel` → `Promotion`, `User` (Eloquent) dipakai langsung.
- **Query**: dipakai halaman list (`GetPromotionQuery::execute($filters, $includeInactive)`).
- **Resource**: mengirim kolom database apa adanya (snake_case) termasuk relasi `created_by_user`/`updated_by_user`.

### 2.3 API Routes (Prefix: `/api/v1`)
| Prefix | Domain | Endpoints Utama |
|--------|--------|-----------------|
| `/identity/auth` | Auth | login, register, Google, OTP, logout, refresh, forgot/reset password, verify email |
| `/identity/users` | User | CRUD user, profil sendiri, aktivasi (`is_active`) |
| `/identity/roles`, `/identity/permissions` | User | CRUD role + daftar permission |
| `/catalog/categories` | Category | CRUD, tree, slug lookup, manage |
| `/catalog/products`, `/catalog/seller/products`, `/catalog/admin/products` | Product | CRUD, varian, gambar, HPP, katalog seller & admin |
| `/catalog/promotions` | Promotion | CRUD publik + `/manage` (admin). **Tanpa approval & tanpa pembayaran** |
| `/catalog/media`, `/catalog/relations`, `/catalog/spreadsheets` | Media / Relation / Spreadsheet | Upload media, quick-create relasi, template import-export |
| `/excel/{module}` | Shared/Excel | Export, import, template, hapus massal per modul |
| `/order/carts`, `/order/wishlist`, `/order/addresses` | Cart / Wishlist / Address | Keranjang, wishlist, alamat (set primary) |
| `/order/orderings` | Ordering | create, manual, list, detail, cancel, update status |
| `/order/vouchers` | Voucher | list, klaim, validasi checkout |
| `/order/payments` | Payment | Snap token, konfigurasi (webhook Midtrans) |
| `/order/reviews`, `/order/products/{id}/reviews` | Review | CRUD ulasan + ulasan per produk |
| `/seller/customers`, `/seller/inventory`, `/seller/stock`, `/seller/schedules` | Seller | Pelanggan, bahan baku & HPP, stok, planner |
| `/seller/settings`, `/seller/finance`, `/seller/promotions` | Seller | Profil toko, kas & hutang-piutang, promosi |
| `/finance` | Finance | Dashboard kas & hutang-piutang (admin) |
| `/support/tickets` | Ticket | Fitur **Help**: list, detail, buat tiket, balas (`/{id}/replies`), ubah status + penugasan (`PATCH /{id}/status` menerima `status` + `assigned_to`; `assigned_to: null` melepas penugasan), konteks pengaju, hapus. Route memakai `role:buyer,seller,admin` agar controller tahu panel aktif |
| `/communication/conversations`, `/communication/announcements` | Chat | Percakapan, pesan, read receipt, pengumuman |
| `/shared/code-patterns` | CodePattern | CRUD pola penomoran + preview |
| `/admin/notifications` | Admin/Notification | List, tandai dibaca, unread count |

### 2.4 Autentikasi & Otorisasi
- **Sanctum** + **Firebase** (dual auth)
- **Role di database**: `admin`, `buyer`. Route seller memakai `active.role:seller` yang **dipenuhi juga oleh admin** (single-store, admin = operator toko)
- **Permission-based**: Middleware `EnsureUserHasRole`, `EnsureUserHasPermission`
- **Middleware chain**: `auth:sanctum` → `active.user` (`EnsureActiveUser`) → `verified.email` (`EnsureEmailIsVerified`) → `active.role:<role>` / `permission:<name>`
- **Status akun hanya `is_active`** (aktif/nonaktif). Kolom `banned_at` & `violation_message` sudah dihapus, tidak ada lagi konsep banned/unban
- Token per role disimpan di `user_devices` (Sanctum `PersonalAccessToken`), role switch mencabut token lama

### 2.5 Realtime (Laravel Reverb)
- WebSocket server untuk chat & notifikasi admin
- Channels (`routes/channels.php`): `App.Models.User.{id}`, `admin.{userId}.notifications`, `conversation.{id}`
- Events (`ShouldBroadcastNow`): `Communication/Chat/Presentation/Events/MessageSent`, `Admin/Notification/Presentation/Events/AdminNotificationCreated`
- Default dev: `BROADCAST_CONNECTION=log`; aktifkan Reverb dengan `BROADCAST_CONNECTION=reverb` + `php artisan reverb:start`

### 2.6 Job & Queue
- Default `QUEUE_CONNECTION=sync` (semua proses jalan inline); Redis bisa dipakai di production
- Pekerjaan berat dijalankan sebagai use case/sinkron: mutasi stok, transaksi keuangan, export/import spreadsheet
- Batch import: `job_batches` + tabel `excel`/spreadsheet terkait

---

## 3. FRONTEND ARCHITECTURE (React 18 + Vite + Tailwind)

### 3.1 Tech Stack
| Library | Versi | Kegunaan |
|---------|-------|----------|
| React | 18.3 | UI Library |
| React Router | 7.x | Routing + guard (`ProtectedRoute`, `GuestRoute`, `SellerStoreGuard`) |
| TanStack Query | 5.x | Server state, caching, mutations (`core/api/queryClient.js`) |
| React Context | — | State klien & auth (`features/auth/context/AuthContext.jsx`), notifikasi (`NotificationCenterContext`) |
| Axios | 1.x | HTTP client + interceptor (`core/utils/apiClient.js`) |
| Chart.js | 4.x | Dashboard & laporan (filter tanggal/bulan/tahun) |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Styling utility-first |
| Laravel Echo + Pusher JS | 2.4 / 8.6 | WebSocket client (Reverb) |
| Material Symbols + Lucide | 0.525 | Ikon panel (font icon) + ikon halaman profil |
| Vitest | 4.x | Unit test frontend |

### 3.2 Struktur Folder
```
resources/react/src/
├── core/                    # Fondasi lintas fitur
│   ├── api/                 # queryClient (TanStack), createCrudService, publicQueryOptions
│   ├── constants/           # Konstanta global
│   ├── engine/              # Mesin form/spreadsheet
│   ├── hooks/               # useTableSearch dll
│   ├── realtime/            # Klien Reverb/Echo
│   ├── types/               # Tipe/objek bersama
│   └── utils/               # apiClient (Axios + interceptor), lazyWithRetry, dateTime, helpers
├── features/
│   ├── admin/               # layout (AdminShell), users, category, order, store, schedule, notification, services
│   ├── advanced/            # pages (Finance, Stock, BahanBaku, HPP, Schedule, Customers, Reviews, Help, Chat) + services
│   ├── auth/                # Login, Register, OTP, Forgot/Reset, RoleSwitch, Google, route guards
│   ├── catalog/             # HomePage, product, category, promotion, company
│   ├── communication/       # Fitur chat pendukung
│   ├── order/               # cart, ordering (Checkout/OrderDetail), voucher, review, wishlist
│   ├── profile/             # ProfileLayout, identity, address, devices, notifications, payments, vouchers, help, chat, appearance
│   └── seller/              # SellerLayout, dashboard, product, voucher, promotion, order, store
└── shared/                  # Cross-cutting
    ├── charts/              # Chart.js wrapper + filter periode
    ├── components/          # UI primitives (Button, Input, DataGrid, Modal, dll)
    ├── excel/               # ExcelActionButtons + workspace import/export
    ├── hooks/               # useTableSelection, useColumnVisibility, useDatabaseTableColumns, dst
    ├── layout/              # AppLayout, BuyerLayout, Navbar, Sidebar
    ├── notifications/       # NotificationCenter + context
    ├── pages/               # Halaman generik/placeholder
    ├── providers/           # QueryProvider, AuthProvider, ReverbProvider
    ├── services/            # mediaUpload, relationQuickCreate
    ├── spreadsheet/         # Spreadsheet workspace
    ├── theme/               # Tema & token desain
    └── utils/               # Formatter, tableData, shipping, optimistic update
```

### 3.3 Routing & Layout Hierarchy
```
AppLayout (root, ScrollToTop + ErrorBoundary + Suspense)
├── BuyerLayout (publik + buyer terproteksi)
│   ├── / , /search , /category/* , /products/:slug , /promotions , /toko-kami
│   └── ProtectedRoute: /cart , /checkout/* , /orders/:id
├── AuthLayout (guest, GuestRoute)
│   ├── /auth/login , /auth/register , /auth/google-callback
│   ├── /admin/login (portal admin)
│   └── /auth/forgot-password , /auth/reset-password , /auth/role-switch
├── ProfileLayout (buyer terproteksi)
│   ├── /profile , /profile/addresses , /profile/notifications
│   ├── /profile/payments , /profile/appearance , /profile/help
│   └── /chat , /chat/groups
├── SellerLayout (role seller/admin + SellerStoreGuard)
│   ├── /seller , /seller/products , /seller/stock , /seller/hpp-report
│   ├── /seller/bahan-baku , /seller/vouchers , /seller/promotions
│   ├── /seller/orders , /seller/customers , /seller/planner
│   ├── /seller/cashflow , /seller/receivables-payables , /seller/reviews
│   └── /seller/store , /seller/code-settings , /seller/help , /seller/chat
└── AdminShell (role admin)
    ├── /admin , /admin/orders , /admin/products , /admin/stock
    ├── /admin/hpp-report , /admin/bahan-baku , /admin/categories
    ├── /admin/vouchers , /admin/promotions , /admin/reviews
    ├── /admin/customers , /admin/users
    ├── /admin/cashflow , /admin/receivables-payables
    └── /admin/planner , /admin/help , /admin/chat , /admin/store
```

### 3.4 State Management Pattern
| State Type | Solution | Contoh |
|------------|----------|--------|
| Server State | TanStack Query + `createCrudService` | Products, Orders, Vouchers, Promotions, Notifications |
| Client Auth | React Context (`AuthContext` + `authService`) | `useAuth()`: user, token, activeRole, permissions |
| Form State | State lokal + `useEntityEditor` / `useFormDirty` | Product editor, Checkout form, CRUD dialog |
| UI State | React Context + hook lokal | Sidebar, modal, view mode (`useViewMode`), visibilitas kolom (`useColumnVisibility`) |
| Realtime | Reverb Echo + Context | Chat (`MessageSent`), notifikasi admin (`AdminNotificationCreated`) |

### 3.5 API Integration Pattern
```javascript
// Axios interceptor (core/utils/apiClient.js)
- Base URL: `/api/v1`
- Auto attach `Authorization: Bearer <token>` + header role aktif
- Auto refresh / logout saat 401
- Helper unwrap: unwrapApiData, unwrapCollection, unwrapPagination

// CRUD service factory (core/api/createCrudService.js)
- list/create/update/remove + normalize/serialize per fitur
- dipakai service fitur, mis. promotionManagementService, usersService

// TanStack Query hooks (per fitur)
useUsers(params) → queryKey: ['admin','users', params]
useSellerPromotions(params) → queryKey: ['seller','promotions', params]
useUpdateSellerPromotion() → mutation + invalidate list terkait
useInfiniteList / useListTotalCount → pagination & infinite scroll
```

### 3.6 Konvensi Tabel Data (semua kolom database tampil)

Semua halaman data admin/seller menampilkan **seluruh kolom tabel** (termasuk kolom relasi), kecuali kolom ID:

| Helper / Hook | File | Fungsi |
|---------------|------|--------|
| `buildDatabaseColumns(rows, { omit, labels })` | `shared/utils/tableData.js` | Bikin kolom otomatis dari kunci `row.raw` (respons API), melewati `id`, `uuid`, `*_id`, `pivot`, `raw`, `children` |
| `mergeColumns(curated, generated)` | `shared/utils/tableData.js` | Gabung kolom kurasi (punya render khusus) dengan kolom database, dedupe per key ternormalisasi |
| `useDatabaseTableColumns(curated, rows, options)` | `shared/hooks/useDatabaseTableColumns.js` | Bungkus `mergeColumns` + `buildDatabaseColumns` + `useColumnVisibility` (simpan preferensi kolom) |
| `resolveTableValue` / `formatTableValue` | `shared/utils/tableData.js` | Ambil nilai (termasuk `row.raw`) dan format tampilan (objek relasi → `name`/`code`) |

Aturan backend pendukung:
- Setiap resource mengirim **nama** kolom relasi, bukan hanya UUID: `created_by_user`, `updated_by_user` (`{id, name}`).
- Relasi audit memakai trait `Shared/Infrastructure/Persistence/Concerns/TracksUserChanges` (`creator()` / `updater()`), lalu repo men-`eager load` `creator:id,name`, `updater:id,name` supaya tidak N+1.
- Pagination list dengan kolom relasi memakai satu query batch untuk peta nama (contoh: `ProductController::attachAuditNames`, `OrderingController::attachRelationMaps`).
- Kolom relasi yang punya endpoint ubah sendiri tetap tampil sebagai kolom kurasi, contoh Help: `assigned_name` pada grid dan select penanggung jawab di detail.

---

## 4. UI/UX STRUCTURE

### 4.1 Design System
- **Tailwind CSS** utility-first
- **Color Palette**: Primary `#10B981` (emerald), Neutral grays, Semantic colors (red/green/yellow/blue)
- **Typography**: Inter font, responsive scale
- **Ikon**: Material Symbols (`material-symbols-outlined`) untuk panel admin/seller dan `lucide-react` untuk halaman profil/buyer
- **Spacing**: 4px base unit
- **Border Radius**: `rounded-lg` (8px) default, `rounded-xl` (12px) cards
- **Shadows**: `shadow-sm` to `shadow-xl`
- **Transitions**: 150-200ms ease

### 4.2 Component Library (Shared)
| Komponen | File | Props Utama |
|----------|------|-------------|
| Button | `components/ui/Button.jsx` | variant, size, loading, icon |
| Input | `components/ui/Input.jsx` | label, error, hint, icon |
| Select | `components/form/SearchableSelect.jsx` | options, value, onChange, searchable |
| Form field | `components/form/FormField.jsx` | label, required, hint, error |
| Data table | `features/advanced/components/DataGrid.jsx` | columns, rows, viewMode, selection, storageKey |
| Toolbar list | `components/crud/EntityToolbar.jsx` | query, filters, columns, visibleColumns, viewMode |
| Page frame | `components/crud/ListPageFrame.jsx` / `FormPageLayout.jsx` | toolbar, children, form layout |
| Confirm / Reason dialog | `components/crud/ConfirmDialog.jsx` / `ReasonDialog.jsx` | open, message, onConfirm |
| Status badge | `components/feedback/StatusBadge.jsx` | status (active/inactive/pending/...) |
| Async state | `components/feedback/AsyncState.jsx` | loading, error, empty |
| Card grid | `components/ui/RecordCardGrid.jsx` | rows, columns, card |
| Chart | `components/charts/ChartFrame.jsx` + `chartKit.jsx` | type (line/bar/pie), data, filter periode |
| Excel | `shared/excel/ExcelActionButtons.jsx` | module, rows, selection, allowImport/Export/Delete |
| Toggle aktif | `components/form/InlineActiveSwitch.jsx` | checked, pending, onChange |
| Notification | `notifications/NotificationCenterContext.jsx` | startTask, push, center |

### 4.3 Halaman Utama per Role

#### Buyer (Public)
| Halaman | Path | Fitur Utama |
|---------|------|-------------|
| Home | `/` | Hero, Featured Products, Categories, Promotions, Newsletter |
| Search | `/search` | Query, Filter (kategori, harga, rating), Sort, Infinite Scroll |
| Product Detail | `/products/:slug` | Gallery, Variants, Stock, Description, Reviews, Add to Cart/Wishlist |
| Category | `/category/*` | Tree navigation, Product grid, Filter sidebar |
| Promotions | `/promotions` | Banner carousel, Grid promosi aktif |
| Profil Toko | `/toko-kami` | Company profile toko tunggal + kontak |
| Cart | `/cart` | Items, Quantity, Voucher apply, Shipping estimate, Checkout |
| Checkout | `/checkout/*` | Address, Shipping, Payment (Midtrans Snap), Summary |
| Order Detail | `/orders/:id` | Timeline, Items, Payment proof, Tracking, Review button |

#### Buyer (Protected - Profile)
| Halaman | Path | Fitur |
|---------|------|-------|
| Profile | `/profile` | Info, Avatar, Email, Password, Firebase link |
| Addresses | `/profile/addresses` | CRUD alamat, Set primary |
| Notifications | `/profile/notifications` | List, Mark read, Filter type |
| Payments | `/profile/payments` | History, Midtrans status |
| Appearance | `/profile/appearance` | Preferensi tampilan |
| Chat | `/chat` | Realtime chat dengan admin (Reverb) |
| Group Chat | `/chat/groups` | Percakapan grup |
| Help | `/profile/help` | Tiket bantuan buyer (`BuyerHelpPage`): survey form → tiket, riwayat + balasan (status open/in_progress/resolved/closed) |

> Voucher buyer dan riwayat pesanan ada di `/cart?tab=voucher` dan `/cart?tab=order` (bukan halaman terpisah).

#### Seller (Protected - role: seller, dipenuhi juga admin)
| Halaman | Path | Fitur |
|---------|------|-------|
| Dashboard | `/seller` | Stats cards, Chart penjualan, Order terbaru, Stok rendah |
| Products | `/seller/products` | CRUD, Variants, Images, Costing, Import/Export (SKU-based) + kolom `code` |
| Raw Materials | `/seller/bahan-baku` | CRUD Bahan baku, Stock movement, Cost history |
| Stock | `/seller/stock` | Ledger stok produk & bahan baku, Adjustment, Dampak HPP |
| HPP Report | `/seller/hpp-report` | Rekap HPP per produk/varian |
| Vouchers | `/seller/vouchers` | CRUD Voucher, Usage stats |
| Promotions | `/seller/promotions` | CRUD Banner — **tanpa approval & tanpa pembayaran**, simpan langsung tayang |
| Orders | `/seller/orders` | List, Detail, Update status, Print invoice, Shipping label |
| Customers | `/seller/customers` | List pelanggan, Detail, Order history |
| Planner | `/seller/planner` | Calendar + Kanban, Schedule, Recurrence, Completion proof |
| Finance | `/seller/cashflow` | Chart.js: Pemasukan/Pengeluaran, Filter tanggal/bulan/tahun |
| Finance | `/seller/receivables-payables` | Piutang/Hutang, Aging report |
| Reviews | `/seller/reviews` | Moderasi ulasan, Reply |
| Store | `/seller/store` | Profil toko (app_settings store.*), Logo, Banner, Sosmed, Policy |
| Code Settings | `/seller/code-settings` | Pola penomoran (order, invoice, dll) |
| Help | `/seller/help` | Halaman **Help** = modul tiket (`HelpPage`): admin yang membuka panel seller tetap berperan operator (`hasOperatorRole`: active-role `seller` + role admin) sehingga bisa balas, ubah status, dan menugaskan tiket |
| Chat | `/seller/chat` | Chat dengan buyer |

#### Admin (Protected - role: admin)
| Halaman | Path | Fitur |
|---------|------|-------|
| Dashboard | `/admin` | Chart.js: Revenue, Orders, Users, Products, Filter periode |
| Orders | `/admin/orders` | Semua pesanan, Filter status, Export laporan |
| Products | `/admin/products` | CRUD semua produk (komponen sama dengan seller), Bulk actions, Import/Export |
| Categories | `/admin/categories` | Tree 3 level, Menu visibility |
| Stock | `/admin/stock` | Ledger stok, Adjustment, Chart stok |
| HPP Report | `/admin/hpp-report` | Rekap HPP |
| Raw Materials | `/admin/bahan-baku` | Bahan baku, riwayat harga, dampak HPP |
| Vouchers | `/admin/vouchers` | CRUD, Global usage stats |
| Promotions | `/admin/promotions` | CRUD banner — tanpa approval & tanpa pembayaran |
| Reviews | `/admin/reviews` | Moderasi global |
| Customers | `/admin/customers` | Semua user buyer, Detail, Order history |
| Users | `/admin/users` | CRUD user, role assignment, **aktif/nonaktif** (saklar `is_active`, tanpa ban) |
| Finance | `/admin/cashflow` | Chart.js: Kas toko, Filter periode |
| Finance | `/admin/receivables-payables` | Piutang/Hutang |
| Planner | `/admin/planner` | Kalender operasional toko |
| Chat | `/admin/chat` | Realtime chat dengan buyer |
| Help | `/admin/help` | Halaman **Help** = modul tiket (`HelpPage`, mode operator): semua tiket masuk, balas, ubah status, **tugaskan penanggung jawab** (`assigned_to`, termasuk tombol "Tugaskan ke saya"), kolom `assigned_name`, filter status + pencarian |
| Store | `/admin/store` | Profil toko tunggal (app_settings `store.*`) |

> Halaman legacy (PPOB, showcase, fee config, withdrawal, game content, roles, stores, banners, promotion payments, announcements) sudah tidak ada di router.

### 4.4 Chart.js Integration (Dashboard & Laporan)
Semua halaman chart **wajib** memiliki:
- **Filter**: Tanggal (date range), Bulan (select), Tahun (select)
- **Data**: Hanya menampilkan data yang sudah difilter
- **Jenis Chart**:
  - Line: Trend penjualan, Revenue, Traffic
  - Bar: Perbandingan kategori, Produk terlaris, Revenue per bulan
  - Pie/Doughnut: Distribusi kategori, Payment method, Order status
  - Area: Cashflow (pemasukan vs pengeluaran)

**Halaman yang menggunakan Chart.js**:
1. `/admin` (`AdminDashboardPage`) - Revenue, Orders, Users, Products
2. `/admin/cashflow` & `/seller/cashflow` (`FinancePage mode="cashflow"`) - Pemasukan/Pengeluaran
3. `/admin/stock` & `/seller/stock` (`StockPage`, `StockChartPanel`) - Stok produk & bahan baku
4. `/admin/receivables-payables` & `/seller/receivables-payables` (`FinancePage mode="receivables"`) - Piutang/Hutang aging
5. `/seller` (`SellerDashboardPage`) - Ringkasan penjualan & stok rendah

---

## 5. FITUR UTAMA & MAPPING

### 5.1 Buyer Features
| Fitur | Backend Domain | Frontend Feature | DB Tabel Utama |
|-------|----------------|------------------|----------------|
| List Product/Katalog | Catalog/Product | catalog/HomePage, SearchPage, ProductDetailPage | products, product_variants, categories |
| Create Order (General/Booking/Preorder) | Order/Ordering | order/CheckoutPage | orders, sub_orders, order_items, payments |
| Cart & Wishlist | Order/Cart, Wishlist | order/CartPage, ProfileLayout wishlist tab | carts, cart_items, wishlists, wishlist_items |
| Order History & Review | Order/Ordering, Review | ProfileLayout orders tab, ReviewPage | orders, product_reviews |
| Chat Realtime | Communication/Chat | advanced/RealtimeChatPage (`/chat`, `/chat/groups`) | conversations, chat_messages |
| Voucher Apply | Order/Voucher | order/voucher (komponen checkout & tab voucher di `/cart`) | vouchers, voucher_products, user_vouchers |
| Address Management | Order/Addresses | profile/address/AddressesPage | addresses |
| Notifikasi & Riwayat | Order/Ordering, Admin/Notification | profile/notifications (turunan data pesanan), `NotificationCenter` untuk feedback | orders, admin_notifications |

### 5.2 Admin/Seller Features
| Fitur | Backend Domain | Frontend Feature | DB Tabel Utama |
|-------|----------------|------------------|----------------|
| User Management | Identity/User | admin/users/AdminUsersPage | users, roles, user_roles |
| CRUD Category/Product/Voucher | Catalog/*, Order/Voucher | admin/*Page, seller/*Page | categories, products, vouchers, voucher_products |
| Promosi (langsung tayang) | Catalog/Promotion | catalog/promotion/*, seller/promotion/SellerPromotionPage | promotions |
| Aktif / Nonaktif Akun | Identity/User | admin/users (switch `is_active`) | users.is_active |
| Materials, HPP, Stock, Schedule (Operasional) | Seller/Inventory, Stock, Schedule, Finance | advanced/BahanBakuPage, StockPage, SchedulePage, FinancePage | raw_materials, product_costings, product_variant_materials, stock_movements, schedules, financial_transactions |
| Import/Export Laporan & Master | Shared/Excel, Shared/Spreadsheet | shared/excel/ExcelActionButtons | Semua master tables |
| Rate & Review Management | Order/Review | advanced/ReviewsPage | product_reviews |
| Order & Transaction Management | Order/Ordering, Seller/Finance | seller/orders, admin/orders, FinancePage | orders, payments, financial_transactions |
| Chat Buyer | Communication/Chat | advanced/RealtimeChatPage | conversations, chat_messages |
| Notifikasi Admin | Admin/Notification | admin/notification/AdminNotificationPanel | admin_notifications |

### 5.3 Import/Export (SKU-based)
- **Acuan**: `sku` (product_variants), `code` (raw_materials), `code` (products) — **BUKAN** nama atau ID database
- **Endpoint**: `/api/v1/excel/{module}` (export, import, template, hapus massal) dan `/api/v1/catalog/spreadsheets`
- **Template**: Spreadsheet dengan header standar per entitas (`PromotionTemplateExport`, dll)
- **Validasi**: Cek SKU/code existing → update; baru → create
- **Rollback**: Transaksi database per batch
- Modul promosi tidak lagi punya kolom pembayaran (`pembayaran_kode/paket/jumlah_bayar`) karena pembayaran promosi dihapus

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### 6.1 Environment
- **PHP**: 8.3+ (composer `laravel/framework: ^13.0`)
- **Node**: 20+
- **Database**: MySQL 8.0 / MariaDB 10.6+ (dev: `fashionku` di MySQL lokal)
- **Queue**: default `sync`; Redis 7+ opsional untuk production
- **WebSocket**: Laravel Reverb (port 8080, `BROADCAST_CONNECTION=reverb`)
- **Web Server**: Nginx + PHP-FPM
- **Storage**: Local (public) / S3-compatible (production)

### 6.2 Key Config Files
| File | Kegunaan |
|------|----------|
| `.env` | Environment variables |
| `config/app.php` | Timezone `Asia/Jakarta`, Locale `id` |
| `config/database.php` | MySQL connection, migrations |
| `config/sanctum.php` | Token expiration, prefix |
| `config/reverb.php` | WebSocket host/port, SSL |
| `config/midtrans.php` | Payment gateway keys |
| `config/firebase.php` | Firebase Admin SDK |
| `config/filesystems.php` | Disk configuration |
| `config/broadcasting.php` | Koneksi broadcast (`log`, `reverb`, `pusher`) |
| `config/moderation_chat.php` | Pengaturan chat moderasi/status akun |
| `config/excel.php` | Konfigurasi import/export spreadsheet |

### 6.3 Commands Utama
```bash
# Development
php artisan serve                    # Backend (port 8000)
npm run dev                          # Frontend Vite (port 5173)
php artisan reverb:start             # WebSocket server

# Database
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Reset + seed
php artisan db:seed --class=PromotionSeeder  # Seed per modul
php artisan db:table nama_tabel      # Inspect schema

# Queue & Jobs
php artisan queue:work               # Process jobs
php artisan queue:failed             # List failed jobs

# Testing
php artisan test                     # PHPUnit (Feature + Unit)
php artisan test --testsuite=Feature # hanya Feature suite (gate utama backend)
npm run test                         # Vitest run (frontend)

# Build Production
npm run build                        # Frontend build
php artisan optimize                 # Config/route/view cache
```

---

## 7. CATATAN PENTING

1. **Single-Store Architecture**: Tidak ada `store_id` di tabel manapun. Profil toko di `app_settings` (key `store.*`). Role di DB hanya `admin` & `buyer`; route `active.role:seller` dipenuhi oleh admin sehingga admin bisa mengoperasikan panel seller.

2. **No Commission System**: Kolom `admin_fee`, `seller_net`, `seller_settlements`, `seller_withdrawals` sudah dihapus.

3. **Tanpa Approval & Tanpa Pembayaran Promosi**: tabel `promotion_payments` dihapus, kolom `approval_status`/`rejection_reason`/`submitted_at`/`approved_at`/`approved_by` di `promotions` juga dihapus, dan `promotions.promotion_payment_id` tidak ada lagi. Simpan promosi (admin maupun seller) = langsung tayang sesuai `is_active`.

4. **Tanpa Sistem Banned**: status akun hanya `users.is_active` (aktif/nonaktif). Kolom `banned_at` & `violation_message` sudah dihapus, termasuk `ViolationNoticeModal` di frontend dan notifikasi banned/unbanned (kini `activated`/`deactivated`).

5. **Soft Deletes**: Hampir semua tabel domain punya `deleted_at` + audit `created_by`/`updated_by` (uuid → users). Audit **ditampilkan sebagai nama** lewat relasi `creator()`/`updater()`.

6. **Idempotency**: `stock_movements.movement_key` + `order_item_id` unique untuk retry aman.

7. **Decimal Precision**: Uang `decimal(15,2)`, HPP/Bahan baku `decimal(18,4)`.

8. **Legacy Tables**: `game_contents`, `ppob_*`, `missions`, `showcases`, `banners`, `catalog_groups`, `stores` — tidak dipakai, aman dihapus.

9. **Chart.js Filter**: Semua dashboard chart **harus** support filter tanggal/bulan/tahun dengan data real-time filtered.

10. **Import Key**: Menggunakan `sku` (varian produk) / `code` (bahan baku & produk) — bukan nama atau ID internal.

11. **Kolom Tabel Data**: semua halaman data menampilkan seluruh kolom database kecuali kolom ID; kolom relasi tampil sebagai nama (lihat §3.6).

---

*Dokumen ini di-generate dari analisis codebase per 23 November 2026. Update saat ada perubahan struktur.*

**Riwayat perubahan terakhir (23 November 2026)**
- Promosi: approval & pembayaran dihapus (`promotion_payments` drop, `promotions` bersih dari kolom approval) — simpan langsung tayang.
- User: sistem banned dihapus (`banned_at`, `violation_message` drop) — cukup saklar aktif/nonaktif.
- Tabel data admin/seller menampilkan seluruh kolom database (helper `buildDatabaseColumns` + `useDatabaseTableColumns`), audit tampil sebagai nama.
- Resource backend menambah kolom yang sebelumnya tidak dikirim: `categories.parent_scope_id`, `products.code`, `orders.voucher/user`, `stock_movements.*`, `financial_transactions.*`, `product_reviews.*`, `vouchers.*`, `support_tickets.*`, `customers.*`.
- Total tabel database: 62.