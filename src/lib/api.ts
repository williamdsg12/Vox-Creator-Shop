// Vox Creator Shop — Centralized API Client for React Dashboard

const ENV_API_URL = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : "";

export const API_BASE_URL = ENV_API_URL
  ? ENV_API_URL.replace(/\/$/, "")
  : "https://voxcreatorshop.vercel.app/api/v1";

export const MAIN_APP_LOGIN_URL = "https://voxcreatorshop.vercel.app/auth/login";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vox_token") || localStorage.getItem("voxcreator_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vox_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("vox_token");
  localStorage.removeItem("voxcreator_token");
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = MAIN_APP_LOGIN_URL;
      }
      throw new ApiError("Sessão expirada. Redirecionando para login...", 401);
    }

    if (!res.ok) {
      throw new ApiError(`Erro HTTP (${res.status})`, res.status);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    return (await res.text()) as unknown as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.warn(`[API Client] Error on ${endpoint}:`, err);
    throw new ApiError("Erro na conexão com o servidor", 500);
  }
}

export type UserLicenseStatus = {
  status: string;
  trial_ends_at?: string;
  credits_remaining?: number;
  user?: {
    name?: string;
    email?: string;
  };
  plan?: {
    id: string;
    name: string;
  };
};

export type KpiMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  accent: "neon" | "amber" | "orange" | "violet";
  spark: number[];
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  badge: string;
  type?: string;
};

export type RecommendationItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  actionText: string;
};

// Api methods
export async function getLicenseStatus(): Promise<UserLicenseStatus> {
  return fetchApi<UserLicenseStatus>("/license/status");
}

export async function getMe(): Promise<{ id: string; email: string; name: string }> {
  return fetchApi<{ id: string; email: string; name: string }>("/auth/me");
}

export async function getKpiMetrics(): Promise<KpiMetric[]> {
  return fetchApi<KpiMetric[]>("/analytics/kpis");
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  return fetchApi<ActivityItem[]>("/analytics/activity");
}

export async function getAiRecommendations(): Promise<RecommendationItem[]> {
  return fetchApi<RecommendationItem[]>("/ai/recommendations");
}
