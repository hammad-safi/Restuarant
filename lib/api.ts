// API service layer for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Get token from localStorage
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Make API request
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

export async function loginAdmin(username: string, password: string) {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutAdmin() {
  return apiCall('/api/auth/logout', {
    method: 'POST',
  });
}

export async function verifyAuth() {
  return apiCall('/api/auth/verify', {
    method: 'GET',
  });
}

// ============================================
// MENU ITEMS ENDPOINTS
// ============================================

export async function getMenuItems(params?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const queryString = new URLSearchParams();
  if (params?.category) queryString.append('category', params.category);
  if (params?.search) queryString.append('search', params.search);
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.offset) queryString.append('offset', params.offset.toString());

  const query = queryString.toString();
  return apiCall(`/api/menu-items${query ? '?' + query : ''}`, {
    method: 'GET',
  });
}

export async function getMenuItem(id: string) {
  return apiCall(`/api/menu-items/${id}`, {
    method: 'GET',
  });
}

export async function createMenuItem(data: any) {
  return apiCall('/api/menu-items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMenuItem(id: string, data: any) {
  return apiCall(`/api/menu-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMenuItem(id: string) {
  return apiCall(`/api/menu-items/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// DEALS ENDPOINTS
// ============================================

export async function getDeals(params?: {
  limit?: number;
  offset?: number;
}) {
  const queryString = new URLSearchParams();
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.offset) queryString.append('offset', params.offset.toString());

  const query = queryString.toString();
  return apiCall(`/api/deals${query ? '?' + query : ''}`, {
    method: 'GET',
  });
}

export async function getDeal(id: string) {
  return apiCall(`/api/deals/${id}`, {
    method: 'GET',
  });
}

export async function createDeal(data: any) {
  return apiCall('/api/deals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDeal(id: string, data: any) {
  return apiCall(`/api/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDeal(id: string) {
  return apiCall(`/api/deals/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// CATEGORIES ENDPOINTS
// ============================================

export async function getCategories() {
  return apiCall('/api/categories', {
    method: 'GET',
  });
}

export async function getCategory(id: string) {
  return apiCall(`/api/categories/${id}`, {
    method: 'GET',
  });
}

export async function createCategory(data: any) {
  return apiCall('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: any) {
  return apiCall(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return apiCall(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// ORDERS ENDPOINTS
// ============================================

export async function getOrders(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const queryString = new URLSearchParams();
  if (params?.status) queryString.append('status', params.status);
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.offset) queryString.append('offset', params.offset.toString());

  const query = queryString.toString();
  return apiCall(`/api/orders${query ? '?' + query : ''}`, {
    method: 'GET',
  });
}

export async function getOrderStats() {
  return apiCall('/api/orders/stats', {
    method: 'GET',
  });
}

export async function getOrder(id: string) {
  return apiCall(`/api/orders/${id}`, {
    method: 'GET',
  });
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    special_instructions?: string;
  }>;
  notes?: string;
  estimated_delivery?: string;
}) {
  return apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(
  id: string,
  status: string,
  estimated_delivery?: string
) {
  return apiCall(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, estimated_delivery }),
  });
}

export async function deleteOrder(id: string) {
  return apiCall(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// SETTINGS ENDPOINTS
// ============================================

export async function getSettings() {
  return apiCall('/api/settings', {
    method: 'GET',
  });
}

export async function getSetting(key: string) {
  return apiCall(`/api/settings/${key}`, {
    method: 'GET',
  });
}

export async function updateSetting(key: string, value: string) {
  return apiCall(`/api/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}

// ============================================
// GALLERY ENDPOINTS
// ============================================

export async function getGalleryItems(category?: string) {
  const query = category && category !== 'All' ? `?category=${category}` : '';
  return apiCall(`/api/gallery${query}`, {
    method: 'GET',
  });
}

export async function addToGallery(data: { image_url: string; category?: string }) {
  return apiCall('/api/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteFromGallery(id: string) {
  return apiCall(`/api/gallery/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  // Use relative path so it goes through the Next.js proxy -> backend
  const token = localStorage.getItem('auth_token');
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here - browser sets it with boundary for multipart/form-data
    },
    body: formData,
  });

  return response.json();
}

// ============================================
// INVOICES ENDPOINTS
// ============================================

export async function getInvoices(params?: {
  date?: string;
  payment_status?: string;
  limit?: number;
  offset?: number;
}) {
  const queryString = new URLSearchParams();
  if (params?.date) queryString.append('date', params.date);
  if (params?.payment_status) queryString.append('payment_status', params.payment_status);
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.offset) queryString.append('offset', params.offset.toString());

  return apiCall(`/api/invoices?${queryString.toString()}`, {
    method: 'GET',
  });
}

export async function getInvoice(id: string) {
  return apiCall(`/api/invoices/${id}`, {
    method: 'GET',
  });
}

export async function createInvoice(data: {
  order_id?: string;
  customer_name: string;
  customer_phone?: string;
  order_type?: string;
  table_number?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    special_instructions?: string;
  }>;
  subtotal: number;
  tax_amount?: number;
  discount_amount?: number;
  payment_method?: string;
  cash_received?: number;
}) {
  return apiCall('/api/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInvoice(id: string, data: {
  payment_status?: string;
  payment_method?: string;
  cash_received?: number;
}) {
  return apiCall(`/api/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteInvoice(id: string) {
  return apiCall(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
}

export async function sendInvoiceWhatsapp(id: string) {
  return apiCall(`/api/invoices/${id}/whatsapp`, {
    method: 'POST',
  });
}

export async function getTransactions(params?: {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}) {
  const queryString = new URLSearchParams();
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.offset) queryString.append('offset', params.offset.toString());
  if (params?.startDate) queryString.append('startDate', params.startDate);
  if (params?.endDate) queryString.append('endDate', params.endDate);

  return apiCall(`/api/billing/transactions?${queryString.toString()}`, {
    method: 'GET',
  });
}

export function getInvoiceExportUrl(id: string) {
  return `${API_BASE_URL}/api/invoices/${id}/export`;
}

// ============================================
// REPORTS ENDPOINTS
// ============================================

export async function getDailyReport(date?: string) {
  const query = date ? `?date=${date}` : '';
  return apiCall(`/api/reports/daily${query}`, {
    method: 'GET',
  });
}

export async function getTopItems(startDate: string, endDate: string, limit?: number) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  if (limit) params.append('limit', limit.toString());
  return apiCall(`/api/reports/top-items?${params.toString()}`, {
    method: 'GET',
  });
}

export async function getRevenueReport(startDate: string, endDate: string) {
  return apiCall(`/api/reports/revenue?start_date=${startDate}&end_date=${endDate}`, {
    method: 'GET',
  });
}

export async function getOrdersSummary(startDate: string, endDate: string) {
  return apiCall(`/api/reports/orders-summary?start_date=${startDate}&end_date=${endDate}`, {
    method: 'GET',
  });
}

// ============================================
// NOTIFICATIONS ENDPOINTS
// ============================================

export async function getNotifications() {
  return apiCall('/api/notifications', {
    method: 'GET',
  });
}

export async function markNotificationRead(id: string) {
  return apiCall(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsRead() {
  return apiCall('/api/notifications/read-all', {
    method: 'PATCH',
  });
}
