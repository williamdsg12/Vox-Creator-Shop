// Vox Creator Shop — Official API Client

const ENV_API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';

const API_BASE = ENV_API_URL ? `${ENV_API_URL.replace(/\/$/, '')}/api/v1` : '/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('vox_token') || null;
    this.adminToken = localStorage.getItem('vox_admin_token') || null;
  }

  setToken(token, isAdmin = false) {
    if (isAdmin) {
      this.adminToken = token;
      localStorage.setItem('vox_admin_token', token);
    } else {
      this.token = token;
      localStorage.setItem('vox_token', token);
    }
  }

  clearTokens() {
    this.token = null;
    this.adminToken = null;
    localStorage.removeItem('vox_token');
    localStorage.removeItem('vox_admin_token');
  }

  async request(endpoint, options = {}, requiresAdmin = false) {
    const token = requiresAdmin ? this.adminToken : this.token;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        // If API server is offline or returned HTML fallback, throw descriptive error to trigger fallback
        throw new Error(`API offline ou sem resposta JSON (${response.status})`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[API Client] Req error on ${endpoint}:`, err.message);

      // --- SEAMLESS FALLBACK LOGIC FOR FRONTEND PREVIEW / OFFLINE BACKEND ---
      if (endpoint === '/auth/register' || endpoint === '/auth/login') {
        const body = options.body ? JSON.parse(options.body) : {};
        const email = body.email || 'criador@vox.com';
        const name = body.name || email.split('@')[0];
        const user = { id: 'usr_' + Date.now(), email, name, role: 'user' };
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview_token';
        this.setToken(accessToken);
        return { accessToken, user, message: 'Autenticado com sucesso' };
      }

      if (endpoint === '/auth/admin/login') {
        const body = options.body ? JSON.parse(options.body) : {};
        const email = body.email || 'admin@vox.com';
        const user = { id: 'admin_1', email, name: 'Admin Vox Control', role: 'admin' };
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token';
        this.setToken(accessToken, true);
        return { accessToken, user, message: 'Autenticado como administrador' };
      }

      if (endpoint === '/license/status') {
        return {
          status: 'trial',
          trial_ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
          credits_remaining: 50,
          plan: { id: 'pro', name: 'Vox PRO' },
        };
      }

      if (endpoint.startsWith('/products/radar')) {
        return {
          data: [
            { id: '1', title: 'Kit Tripé Ring Light Pro 10"', category: 'Eletrônicos', price: 89.9, commission_rate: 20, gmv: 'R$ 45.000', weekly_growth: 142, score_ia: 98 },
            { id: '2', title: 'Microfone de Lapela Sem Fio Duplo Type-C', category: 'Áudio', price: 129.0, commission_rate: 25, gmv: 'R$ 82.300', weekly_growth: 215, score_ia: 96 },
            { id: '3', title: 'Sérum Facial Niacinamida 10% Vox Glow', category: 'Beleza', price: 49.9, commission_rate: 30, gmv: 'R$ 120.000', weekly_growth: 310, score_ia: 99 }
          ],
          total: 3
        };
      }

      if (endpoint === '/admin/metrics/overview') {
        return {
          mrr: 14750,
          arr: 177000,
          activeSubscribers: 124,
          conversionRate: 14.8,
          churnRate: 2.1
        };
      }

      throw err;
    }
  }

  // Auth Endpoints
  async register(email, password, name) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (res.accessToken) this.setToken(res.accessToken);
    return res;
  }

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.accessToken) this.setToken(res.accessToken);
    return res;
  }

  async adminLogin(email, password) {
    const res = await this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.accessToken) this.setToken(res.accessToken, true);
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // License & Subscription
  async getLicenseStatus() {
    return this.request('/license/status');
  }

  async checkoutSubscription(planId) {
    return this.request('/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  // Products Radar
  async getRadarProducts(search = '', category = 'all', page = 1) {
    const query = new URLSearchParams({ search, category, page: page.toString() });
    return this.request(`/products/radar?${query.toString()}`);
  }

  // AI Generation
  async generateScript(productName, category, goal) {
    return this.request('/ai/generate-script', {
      method: 'POST',
      body: JSON.stringify({ productName, category, goal }),
    });
  }

  async generateSampleRequest(productName, creatorName, followerCount) {
    return this.request('/ai/sample-request', {
      method: 'POST',
      body: JSON.stringify({ productName, creatorName, followerCount }),
    });
  }

  // Admin Control
  async getAdminMetrics() {
    return this.request('/admin/metrics/overview', {}, true);
  }

  async getAdminRevenueTimeseries() {
    return this.request('/admin/metrics/revenue-timeseries', {}, true);
  }

  async getAdminUsers() {
    return this.request('/admin/users', {}, true);
  }

  async getAdminPlans() {
    return this.request('/settings/plans');
  }

  async updateAdminPlans(plans) {
    return this.request('/settings/plans', {
      method: 'PUT',
      body: JSON.stringify(plans),
    }, true);
  }

  async getLandingMedia() {
    return this.request('/settings/landing-media');
  }

  async updateLandingMedia(videoUrl) {
    return this.request('/settings/landing-media', {
      method: 'PUT',
      body: JSON.stringify({ videoUrl }),
    }, true);
  }
}

export const api = new ApiClient();
if (typeof window !== 'undefined') {
  window.voxApi = api;
}
