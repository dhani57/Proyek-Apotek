import { getAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:3000';

interface MedicineData {
  name: string;
  description?: string;
  sellPrice: number;
  buyPrice: number;
  stock: number;
  unit: string;
  batchNumber?: string;
  expirationDate?: string;
  categoryId: string;
  isActive?: boolean;
}

interface TransactionData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: string;
  notes?: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Medicine API
export const medicineApi = {
  getAll: () => fetchWithAuth('/medicines'),
  getOne: (id: string) => fetchWithAuth(`/medicines/${id}`),
  create: (data: MedicineData) => fetchWithAuth('/medicines', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<MedicineData>) => fetchWithAuth(`/medicines/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => fetchWithAuth(`/medicines/${id}`, { method: 'DELETE' }),
  getStatistics: () => fetchWithAuth('/medicines/statistics'),
  getLowStock: (threshold?: number) => fetchWithAuth(`/medicines/low-stock${threshold ? `?threshold=${threshold}` : ''}`),
  getExpiring: (months?: number) => fetchWithAuth(`/medicines/expiring${months ? `?months=${months}` : ''}`),
};

// Transaction API
export const transactionApi = {
  getAll: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return fetchWithAuth(`/transactions${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getOne: (id: string) => fetchWithAuth(`/transactions/${id}`),
  create: (data: TransactionData) => fetchWithAuth('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  getStatistics: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return fetchWithAuth(`/transactions/statistics${params.toString() ? `?${params.toString()}` : ''}`);
  },
};
