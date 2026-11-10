export type EntityId = string | number;

export interface ApiErrorResponse {
  success?: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: Record<string, string | null>;
  success?: boolean;
}

export interface IdentityUser {
  id: EntityId;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  activeRole: "buyer" | "seller" | "admin";
  roles: string[];
  emailVerified: boolean;
}

export interface SellerStoreDetail {
  ownerName: string;
  ownerPhone: string;
  description: string;
  shippingPolicy: string;
  returnPolicy: string;
  openDays: string;
  openTime: string;
  closeTime: string;
  whatsappUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  websiteUrl: string;
}

export interface SellerStore {
  id: number;
  userId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  phone: string;
  email: string;
  city: string;
  province: string;
  address: string;
  isActive: boolean;
  logo: string;
  bannerUrl: string;
  detail: SellerStoreDetail;
}

export interface Address {
  id: number;
  label: string;
  recipientName: string;
  phoneNumber: string;
  country: string;
  province: string;
  cityOrRegency: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  fullAddress: string;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  komerceDestinationId: string | null;
  isPrimary: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  variantName: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  weight: number;
  storeId: number;
  storeName: string;
  subtotal: number;
}

export interface ShippingOption {
  id: string;
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string | null;
  type: "delivery" | "pickup";
  provider?: string;
  requiresDestinationId?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  variantId: number | null;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface SubOrder {
  id: number;
  storeId: number;
  storeName: string;
  number: string;
  totalItemsPrice: number;
  shippingCost: number;
  courier: string;
  service: string;
  status: string;
  trackingNumber: string | null;
  items: OrderItem[];
}

export interface Order {
  id: string | number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  snapToken: string | null;
  paymentUrl?: string | null;
  redirectUrl?: string | null;
  midtransClientKey?: string | null;
  midtransIsProduction?: boolean | null;
  totalItemsPrice: number;
  shippingCost: number;
  discountAmount: number;
  shippingDiscountAmount: number;
  finalAmount: number;
  shippingAddress: string;
  subOrders: SubOrder[];
  createdAt: string | null;
  updatedAt: string | null;
}
