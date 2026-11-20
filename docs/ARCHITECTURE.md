# Fashionku Marketplace - Arsitektur Lengkap

Dokumen ini merangkum **Database Schema**, **Backend (Laravel)**, **Frontend (React)**, dan **UI/UX** untuk project marketplace fashionku.

---

## 1. DATABASE SCHEMA (61 Tabel)

### 1.1 Identitas & Keamanan (9 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `users` | uuid | Akun pengguna (buyer/admin), Firebase UID, email, password, avatar |
| `roles` | bigint | Master role: `admin`, `buyer` (seller/dll dinonaktifkan) |
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
| `seller_customers` | bigint | Pelanggan manual ditambah admin (user_id unik) |

### 1.3 Katalog (8 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `categories` | bigint | Hierarkis 3 level (parent_id, level 1-3, full_slug unik) |
| `product_attributes` | bigint | Master atribut (warna, ukuran, type: select/text) |
| `products` | bigint | Produk (slug unik, status draft/published/archived, allows_preorder) |
| `product_categories` | composite | Pivot produk ↔ kategori (is_primary) |
| `product_attribute_values` | bigint | Nilai atribut level produk (unik per product+attribute) |
| `product_variants` | bigint | SKU & stok (sku global unik, price, price_sale, stock, po_stock, reserved, booked, preorder) |
| `product_variant_values` | bigint | Nilai atribut per varian (unik per variant+attribute) |
| `product_images` | bigint | Galeri (url, alt_text, is_primary, sort_order) |

### 1.4 Promosi & Voucher (4 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `promotions` | bigint | Banner promosi (approval workflow, click_action: product/category/url) |
| `promotion_payments` | bigint | Pembayaran paket promosi (proof_url, status) |
| `vouchers` | bigint | Voucher toko (code unik, discount_type fixed/percentage, target product/shipping, usage_limit) |
| `user_vouchers` | bigint | Voucher diklaim user (status available/used/expired) |

### 1.5 Belanja & Pesanan (9 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `carts` | bigint | Keranjang 1:1 user (user_id unik) |
| `cart_items` | bigint | Item keranjang (unik per cart+variant) |
| `wishlists` | uuid | Wishlist bernama (unik per user+name) |
| `wishlist_items` | bigint | Item wishlist (unik per wishlist+product) |
| `orders` | bigint | Header pesanan (order_number unik, order_type, voucher_id, total, discount, shipping_discount, status, payment_status) |
| `sub_orders` | bigint | Kelompok item per pengiriman (courier, service, destination_id, tracking_number) |
| `order_items` | bigint | Snapshot item (product_name, sku, price, quantity, thumbnail) |
| `payments` | bigint | Transaksi gateway (order_number FK, transaction_id, payload Midtrans) |
| `product_reviews` | bigint | Ulasan (rating 1-5, media json, order_item_id unik) |

### 1.6 Inventori & HPP (7 tabel)
| Tabel | PK | Deskripsi |
|-------|----|-----------|
| `stock_movements` | bigint | Ledger stok varian (type, quantity_delta, balance_after, movement_key untuk idempotensi) |
| `raw_materials` | bigint | Bahan baku (code unik, unit, stock decimal(18,4), average_cost) |
| `raw_material_stock_movements` | bigint | Ledger bahan baku (quantity_delta, unit_cost, total_cost) |
| `raw_material_cost_histories` | bigint | Riwayat harga rata-rata bahan |
| `product_costings` | bigint | HPP per produk 1:1 (material, labor, overhead, hpp, margin, suggested_price) |
| `product_materials` | bigint | BOM/resep (quantity, unit_cost, total_cost) |
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

### 1.10 Infrastruktur Framework (8 tabel)
`password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `personal_access_tokens`

---

## 2. BACKEND ARCHITECTURE (Laravel 11+)

### 2.1 Struktur Domain (DDD Modular)
```
app/Domains/
├── Identity/           # Auth, User, Role, Permission
├── Catalog/            # Category, Product, Promotion, Media, Spreadsheet
├── Order/              # Cart, Address, Wishlist, Ordering, Voucher, Payment, Review
├── Seller/             # Settings, Stock, Inventory, Schedule, Customers, Finance
├── Support/            # Ticket, Notification
├── Communication/      # Chat, Conversation
├── Shared/             # Settings, Codes, Moderation
└── Finance/            # (di Seller/Finance)
```

### 2.2 Layer per Domain
```
Domain/
├── Domain/
│   ├── Entities/           # Core business objects
│   ├── Repositories/       # Interfaces (Contracts)
│   ├── Exceptions/         # Domain exceptions
│   └── ValueObjects/       # (jika ada)
├── Application/
│   ├── UseCases/           # Business logic (single responsibility)
│   ├── Services/           # Domain services
│   └── DTOs/               # Data Transfer Objects
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Models/         # Eloquent Models
│   │   ├── Repositories/   # Eloquent Implementations
│   │   └── Mappers/        # Entity ↔ Model mapping
│   └── Services/           # External services (Midtrans, Firebase)
└── Presentation/
    ├── Http/
    │   ├── Controllers/    # API Controllers
    │   ├── Requests/       # Form Requests (validation)
    │   └── Resources/      # API Resources (transformers)
    └── routes.php          # Route definitions
```

### 2.3 API Routes (Prefix: `/api/v1`)
| Prefix | Domain | Endpoints Utama |
|--------|--------|-----------------|
| `/identity/auth` | Auth | login, register, logout, refresh, forgot/reset password, verify email, OTP |
| `/identity/user` | User | CRUD user, role, permission, profile |
| `/catalog/category` | Category | CRUD, tree, slug lookup |
| `/catalog/product` | Product | CRUD, variants, images, costing, import/export |
| `/catalog/promotion` | Promotion | CRUD, approval, payments |
| `/catalog/media` | Media | Upload, delete, reorder |
| `/catalog/spreadsheet` | Spreadsheet | Import/export template |
| `/seller/*` | Seller | Settings, stock, inventory, schedule, customers, finance |
| `/order/cart` | Cart | get, add, update, remove, clear |
| `/order/addresses` | Address | CRUD, set primary |
| `/order/wishlist` | Wishlist | CRUD, add/remove item |
| `/order/ordering` | Order | create, list, detail, cancel, track, history |
| `/order/voucher` | Voucher | list, claim, validate, checkout apply |
| `/order/payment` | Payment | midtrans snap token, webhook, config |
| `/order/review` | Review | create, list, moderate |
| `/support/ticket` | Ticket | CRUD, reply, assign, resolve |
| `/support/notification` | Notification | list, mark read, unread count |
| `/communication/chat` | Chat | conversations, messages, reads, realtime (Reverb) |
| `/shared/codes` | CodePattern | CRUD pola penomoran |
| `/shared/settings` | AppSetting | get/set key-value |

### 2.4 Autentikasi & Otorisasi
- **Sanctum** + **Firebase** (dual auth)
- **Role-based**: `admin`, `buyer` (seller role dinonaktifkan tapi tabel ada)
- **Permission-based**: Middleware `EnsureUserHasPermission`, `EnsureUserHasRole`
- **Middleware chain**: `auth:sanctum` → `EnsureActiveUser` → `EnsureEmailIsVerified` → role/permission

### 2.5 Realtime (Laravel Reverb)
- WebSocket server untuk chat realtime
- Channels: `conversation.{id}`, `user.{id}.notifications`, `admin.notifications`
- Events: `ChatMessageSent`, `NotificationCreated`, `OrderStatusUpdated`

### 2.6 Job & Queue
- **Redis** queue driver
- Jobs: Email, Midtrans webhook processing, Stock movement, Financial transaction, Export/Import spreadsheet
- Batch jobs untuk import besar

---

## 3. FRONTEND ARCHITECTURE (React 18 + Vite + Tailwind)

### 3.1 Tech Stack
| Library | Versi | Kegunaan |
|---------|-------|----------|
| React | 18.x | UI Library |
| React Router | 6.x | Routing (lazy loading) |
| TanStack Query | 5.x | Server state, caching, mutations |
| Zustand | 4.x | Client state (auth, UI) |
| Axios | 1.x | HTTP client (interceptor auth) |
| Chart.js | 4.x | Dashboard charts (filter tanggal/bulan/tahun) |
| React Hook Form | 7.x | Form validation |
| Zod | 3.x | Schema validation |
| Headless UI | 1.x | Accessible components |
| Heroicons | 2.x | Icons |
| Reverb JS | 1.x | WebSocket client |

### 3.2 Struktur Folder
```
zlama/market-frontend/src/
├── core/                    # Core utilities
│   ├── api/axios.js         # Axios instance + interceptors
│   ├── auth/                # Auth store (Zustand), hooks
│   ├── utils/               # lazyWithRetry, helpers
│   └── query/               # QueryClient provider
├── features/                # Feature-based modules
│   ├── auth/                # Login, Register, RoleSwitch, Onboarding
│   ├── catalog/             # Home, Search, ProductDetail, Category, Promotion, Store
│   ├── order/               # Cart, Checkout, OrderDetail
│   ├── seller/              # Dashboard, Products, Banners, Vouchers, Orders, Planner, Store
│   ├── admin/               # Dashboard, Products, Categories, Users, Orders, Finance, etc.
│   ├── profile/             # Profile, Addresses, Vouchers, Notifications, Chat, Help
│   ├── advanced/            # Finance, Stock, RawMaterials, CodePatterns, Customers, Reviews
│   ├── ppob/                # PPOB pages
│   └── shared/              # Providers, Layout, Notifications, Spreadsheet
├── shared/                  # Cross-cutting
│   ├── components/          # UI primitives (Button, Input, Table, Modal, etc.)
│   ├── layout/              # AppLayout, BuyerLayout, SellerLayout, AdminLayout, Navbar, Sidebar
│   ├── hooks/               # Custom hooks (useTableSelection, useFormDirty, usePermission, etc.)
│   ├── utils/               # Formatters, shipping, optimistic updates
│   ├── services/            # mediaUpload, relationQuickCreate
│   ├── pages/               # ModulePlaceholderPage
│   ├── providers/           # QueryProvider, AuthProvider, ReverbProvider
│   └── notifications/       # NotificationCenter, context, feedback bridge
└── styles/                  # Global CSS, Tailwind imports
```

### 3.3 Routing & Layout Hierarchy
```
AppLayout (root)
├── BuyerLayout (public + protected buyer routes)
│   ├── Home, Search, Category, ProductDetail, Promotion, StoreDirectory
│   └── Protected: Cart, Checkout, OrderDetail, PPOB
├── AuthLayout (guest routes)
│   ├── Login, Register, Forgot/Reset Password
│   └── AdminLogin (separate)
├── ProfileLayout (protected buyer)
│   ├── Profile, Addresses, Vouchers, Notifications, Payments
│   ├── Chat (RealtimeChatPage), GroupChat
│   └── Help, Missions
├── SellerLayout (role: seller + onboarding guard)
│   ├── Dashboard, Products, RawMaterials, Stock, Vouchers, Promotions
│   ├── Orders, Customers, Planner (Schedule/Kanban)
│   ├── Finance (Cashflow, Receivables), Showcases, Reviews
│   ├── Store Settings, Banners, Code Settings, Chat
└── AdminLayout (role: admin)
    ├── Dashboard (Chart.js), Products, Categories, CatalogGroups
    ├── Vouchers, Promotions, Orders, PPOB, Customers
    ├── Finance (FeeConfigs, Withdrawals, Cashflow, Receivables)
    ├── Users, Roles, Stores, StoreContext, Banners
    ├── GameContent, Missions, Planner, Announcements, Chat
    ├── Reviews, CodeSettings, Help
```

### 3.4 State Management Pattern
| State Type | Solution | Contoh |
|------------|----------|--------|
| Server State | TanStack Query | Products, Orders, User, Notifications |
| Client Auth | Zustand | `useAuthStore` (user, token, permissions, roles) |
| Form State | React Hook Form + Zod | Product editor, Checkout form |
| UI State | Zustand / React Context | Sidebar open, Modal, Toast, Theme |
| Realtime | Reverb Echo + React Context | Chat messages, Notifications push |

### 3.5 API Integration Pattern
```javascript
// Axios interceptor (core/api/axios.js)
- Base URL: `/api/v1`
- Auto attach `Authorization: Bearer <token>`
- Auto refresh token on 401
- Error normalization → `ApiError` class

// TanStack Query hooks (per feature)
useProducts(params) → queryKey: ['products', params]
useProduct(slug) → queryKey: ['product', slug]
useCreateProduct() → mutation + invalidate ['products']
useUpdateProduct() → optimistic update + rollback on error
```

---

## 4. UI/UX STRUCTURE

### 4.1 Design System
- **Tailwind CSS** utility-first
- **Color Palette**: Primary `#10B981` (emerald), Neutral grays, Semantic colors (red/green/yellow/blue)
- **Typography**: Inter font, responsive scale
- **Spacing**: 4px base unit
- **Border Radius**: `rounded-lg` (8px) default, `rounded-xl` (12px) cards
- **Shadows**: `shadow-sm` to `shadow-xl`
- **Transitions**: 150-200ms ease

### 4.2 Component Library (Shared)
| Komponen | File | Props Utama |
|----------|------|-------------|
| Button | `Button.jsx` | variant, size, loading, icon |
| Input | `Input.jsx` | label, error, helperText, icon |
| Select | `Select.jsx` | options, searchable, multi |
| Table | `DataTable.jsx` | columns, data, pagination, sorting, selection |
| Modal | `Modal.jsx` | open, onClose, size, title |
| Tabs | `PanelTabsContext.jsx` | tabs, activeTab, onChange |
| Sidebar | `PanelSidebar.jsx` | items, collapsed, onNavigate |
| Navbar | `Navbar.jsx` | user, notifications, roleSwitch |
| Chart | `ChartWrapper.jsx` | type (line/bar/pie), data, options, dateFilter |
| Toast | `ToastContainer.jsx` | auto-dismiss, action buttons |
| Avatar | `Avatar.jsx` | src, fallback, size, status |
| Badge | `Badge.jsx` | variant, dot, count |
| Breadcrumb | `Breadcrumb.jsx` | items, separator |

### 4.3 Halaman Utama per Role

#### Buyer (Public)
| Halaman | Path | Fitur Utama |
|---------|------|-------------|
| Home | `/` | Hero, Featured Products, Categories, Promotions, Newsletter |
| Search | `/search` | Query, Filter (kategori, harga, rating), Sort, Infinite Scroll |
| Product Detail | `/products/:slug` | Gallery, Variants, Stock, Description, Reviews, Add to Cart/Wishlist |
| Category | `/category/*` | Tree navigation, Product grid, Filter sidebar |
| Promotions | `/promotions` | Banner carousel, Grid promosi aktif |
| Store Directory | `/stores` | List toko (single-store tapi UI siap multi) |
| Cart | `/cart` | Items, Quantity, Voucher apply, Shipping estimate, Checkout |
| Checkout | `/checkout/*` | Address, Shipping, Payment (Midtrans Snap), Summary |
| Order Detail | `/orders/:id` | Timeline, Items, Payment proof, Tracking, Review button |

#### Buyer (Protected - Profile)
| Halaman | Path | Fitur |
|---------|------|-------|
| Profile | `/profile` | Info, Avatar, Email/Phone, Password, Firebase link |
| Addresses | `/profile/addresses` | CRUD alamat, Set primary, Map picker |
| Vouchers | `/profile/vouchers` | Available/Used/Expired tabs, Claim code |
| Notifications | `/profile/notifications` | List, Mark read, Filter type |
| Payments | `/profile/payments` | History, Midtrans status |
| Chat | `/chat` | Realtime chat dengan admin (Reverb) |
| Help | `/profile/help` | FAQ, Contact form → Ticket |
| Missions | `/profile/missions` | Gamifikasi (jika aktif) |

#### Seller (Protected - role: seller)
| Halaman | Path | Fitur |
|---------|------|-------|
| Dashboard | `/seller` | Stats cards, Chart penjualan, Order terbaru, Stok rendah |
| Products | `/seller/products` | CRUD, Variants, Images, Costing, Import/Export (SKU-based) |
| Raw Materials | `/seller/bahan-baku` | CRUD Bahan baku, Stock movement, Cost history |
| Stock | `/seller/stock` | Stock movement ledger, Adjustment, Low stock alert |
| Vouchers | `/seller/vouchers` | CRUD Voucher, Usage stats |
| Promotions | `/seller/promotions` | CRUD Banner, Approval status, Payment proof |
| Orders | `/seller/orders` | List, Detail, Update status, Print invoice, Shipping label |
| Customers | `/seller/customers` | List pelanggan, Detail, Order history |
| Planner | `/seller/planner` | Calendar + Kanban, Schedule, Recurrence, Completion proof |
| Finance | `/seller/cashflow` | Chart.js: Pemasukan/Pengeluaran, Filter tanggal/bulan/tahun |
| Finance | `/seller/receivables-payables` | Piutang/Hutang, Aging report |
| Showcases | `/seller/showcases` | (Legacy) Vitrin produk |
| Reviews | `/seller/reviews` | Moderasi ulasan, Reply |
| Store | `/seller/store` | Profil toko (app_settings store.*), Logo, Banner, Sosmed, Policy |
| Banners | `/seller/banners` | Banner slider management |
| Code Settings | `/seller/code-settings` | Pola penomoran (order, invoice, dll) |

#### Admin (Protected - role: admin)
| Halaman | Path | Fitur |
|---------|------|-------|
| Dashboard | `/admin` | Chart.js: Revenue, Orders, Users, Products, Filter periode |
| Products | `/admin/products` | CRUD semua produk, Bulk actions, Import/Export |
| Categories | `/admin/categories` | Tree drag-drop, 3 level, Menu visibility |
| Catalog Groups | `/admin/catalog-groups` | (Legacy) Group katalog |
| Vouchers | `/admin/vouchers` | CRUD, Global usage stats |
| Promotions | `/admin/promotions` | Approve/Reject seller promotions |
| Orders | `/admin/orders` | Semua pesanan, Filter status, Export laporan |
| PPOB | `/admin/ppob` | Produk digital, Transaksi |
| Customers | `/admin/customers` | Semua user buyer, Detail, Impersonate |
| Finance | `/admin/cashflow` | Chart.js: Kas toko, Filter periode |
| Finance | `/admin/receivables-payables` | Keuangan toko |
| Fee Configs | `/admin/fee-configs` | (Legacy) Konfigurasi biaya admin |
| Withdrawals | `/admin/withdrawals` | (Legacy) Penarikan dana seller |
| Showcases | `/admin/showcases` | (Legacy) |
| Promotion Payments | `/admin/promotion-payments` | Verifikasi pembayaran promosi seller |
| Reviews | `/admin/reviews` | Moderasi global |
| Game Content | `/admin/game-content` | (Legacy) Konten gamifikasi |
| Planner | `/admin/planner` | Kalender operasional toko |
| Announcements | `/admin/announcements` | Broadcast ke user |
| Chat | `/admin/chat` | Realtime chat dengan buyer |
| Users | `/admin/users` | CRUD user, Role assignment, Ban/Unban |
| Roles | `/admin/roles` | CRUD Role, Permission matrix |
| Stores | `/admin/stores` | (Single-store) Info toko tunggal |
| Store Context | `/admin/store-context` | Switch context (jika multi-store enable) |
| Banners | `/admin/banners` | Banner marketplace global |
| Code Settings | `/admin/code-settings` | Pola penomoran global |

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
1. `/admin` (AdminHomePage) - Revenue, Orders, Users, Products
2. `/admin/cashflow` & `/seller/cashflow` (FinancePage mode=cashflow) - Pemasukan/Pengeluaran
3. `/admin/stock` & `/seller/stock` (StockPage) - Stock movement, Low stock
4. `/admin/receivables-payables` & `/seller/receivables-payables` (FinancePage mode=receivables) - Piutang/Hutang aging
5. Laporan Penjualan & Produk (halaman laporan dedicated)

---

## 5. FITUR UTAMA & MAPPING

### 5.1 Buyer Features
| Fitur | Backend Domain | Frontend Feature | DB Tabel Utama |
|-------|----------------|------------------|----------------|
| List Product/Katalog | Catalog/Product | catalog/HomePage, SearchPage, ProductDetailPage | products, product_variants, categories |
| Create Order (General/Booking/Preorder) | Order/Ordering | order/CheckoutPage | orders, sub_orders, order_items, payments |
| Cart & Wishlist | Order/Cart, Wishlist | order/CartPage, ProfileLayout wishlist tab | carts, cart_items, wishlists, wishlist_items |
| Order History & Review | Order/Ordering, Review | ProfileLayout orders tab, ReviewPage | orders, product_reviews |
| Chat Realtime | Communication/Chat | profile/chat/RealtimeChatPage | conversations, chat_messages |
| Voucher Claim & Apply | Order/Voucher | profile/vouchers/VouchersPage, Checkout apply | vouchers, user_vouchers |
| Address Management | Order/Addresses | profile/addresses/AddressesPage | addresses |
| Notifications | Support/Notification | profile/notifications/NotificationsPage | admin_notifications |

### 5.2 Admin/Seller Features
| Fitur | Backend Domain | Frontend Feature | DB Tabel Utama |
|-------|----------------|------------------|----------------|
| User Management | Identity/User | admin/identity/AdminUsersPage | users, roles, user_roles |
| CRUD Category/Product/Voucher/Promotion | Catalog/* | admin/*Page, seller/*Page | categories, products, vouchers, promotions |
| Materials, HPP, Stock, Schedule (Operasional) | Seller/Inventory, Stock, Schedule, Finance | seller/bahan-baku, /stock, /planner, /cashflow | raw_materials, product_costings, stock_movements, schedules, financial_transactions |
| Import/Export Laporan & Master | Shared/Spreadsheet | SpreadsheetOperationPanel (shared) | Semua master tables |
| Rate & Review Management | Order/Review | seller/reviews/ReviewsPage, admin/reviews | product_reviews |
| Order & Transaction Management | Order/Ordering, Finance | seller/orders, admin/orders, finance pages | orders, payments, financial_transactions |
| Chat Buyer | Communication/Chat | seller/chat, admin/chat | conversations, chat_messages |

### 5.3 Import/Export (SKU-based)
- **Acuan**: `sku` (product_variants) atau `code` (raw_materials) — **BUKAN** nama atau ID database
- **Template**: Spreadsheet dengan header standar per entitas
- **Validasi**: Cek SKU/code existing → update; baru → create
- **Rollback**: Transaksi database per batch

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### 6.1 Environment
- **PHP**: 8.2+
- **Node**: 20+
- **Database**: MySQL 8.0 / MariaDB 10.6+
- **Queue/Redis**: Redis 7+
- **WebSocket**: Laravel Reverb (port 8080)
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

### 6.3 Commands Utama
```bash
# Development
php artisan serve                    # Backend (port 8000)
npm run dev                          # Frontend Vite (port 5173)
php artisan reverb:start             # WebSocket server

# Database
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Reset + seed
php artisan db:table nama_tabel      # Inspect schema

# Queue & Jobs
php artisan queue:work               # Process jobs
php artisan queue:failed             # List failed jobs

# Testing
php artisan test                     # PHPUnit
npm run test                         # Vitest (frontend)

# Build Production
npm run build                        # Frontend build
php artisan optimize                 # Config/route/view cache
```

---

## 7. CATATAN PENTING

1. **Single-Store Architecture**: Tidak ada `store_id` di tabel manapun. Profil toko di `app_settings` (key `store.*`). Role `seller` dinonaktifkan tapi schema tetap ada.

2. **No Commission System**: Kolom `admin_fee`, `seller_net`, `seller_settlements`, `seller_withdrawals` sudah dihapus.

3. **Soft Deletes**: Hampir semua tabel domain punya `deleted_at` + audit `created_by`/`updated_by` (uuid → users).

4. **Idempotency**: `stock_movements.movement_key` + `order_item_id` unique untuk retry aman.

5. **Decimal Precision**: Uang `decimal(15,2)`, HPP/Bahan baku `decimal(18,4)`.

6. **Legacy Tables**: `game_contents`, `ppob_*`, `missions`, `showcases`, `banners`, `catalog_groups`, `stores` — tidak dipakai, aman dihapus.

7. **Chart.js Filter**: Semua dashboard chart **harus** support filter tanggal/bulan/tahun dengan data real-time filtered.

8. **Import Key**: Menggunakan `sku` (produk) / `code` (bahan baku) — bukan nama atau ID internal.

---

*Dokumen ini di-generate dari analisis codebase per 19 November 2026. Update saat ada perubahan struktur.*