// Vox Creator Shop — Official API Client

const API_BASE = '/api/v1';

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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }
      return data;
    } catch (err) {
      console.warn(`[API Client] Req error on ${endpoint}:`, err.message);
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
