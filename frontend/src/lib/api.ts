import { BACKEND_URL, supabase } from "./supabase";

export class ApiError extends Error {
  status: number;
  payload?: any;
  constructor(msg: string, status: number, payload?: any) {
    super(msg);
    this.status = status;
    this.payload = payload;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      return { Authorization: `Bearer ${data.session.access_token}` };
    }
  } catch { /* noop */ }
  return {};
}

async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const bearer = await authHeaders();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...opts,
    credentials: "include",
    headers: {
      ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...bearer,
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = typeof data === "object" && data ? (data.detail || JSON.stringify(data)) : (text || res.statusText);
    throw new ApiError(String(msg), res.status, data);
  }
  return data as T;
}

export const api = {
  // auth
  session: (session_id: string) => req("/api/auth/session", { method: "POST", body: JSON.stringify({ session_id }) }),
  me: () => req("/api/auth/me"),
  logout: () => req("/api/auth/logout", { method: "POST" }),

  // profile
  patchProfile: (patch: Record<string, any>) =>
    req("/api/profile", { method: "PATCH", body: JSON.stringify(patch) }),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<{ url: string }>("/api/profile/avatar", { method: "POST", body: fd });
  },

  // orders
  createOrder: (payload: any) => req("/api/orders", { method: "POST", body: JSON.stringify(payload) }),
  listOrders: () => req<any[]>("/api/orders"),
  adminUpdateOrder: (id: string, status: string) =>
    req(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // testimonials
  createTestimonial: (rating: number, content?: string | null) =>
    req("/api/testimonials", { method: "POST", body: JSON.stringify({ rating, content: content || null }) }),
  deleteTestimonial: (id: string) => req(`/api/testimonials/${id}`, { method: "DELETE" }),
  replyTestimonial: (id: string, reply: string) =>
    req(`/api/admin/testimonials/${id}/reply`, { method: "POST", body: JSON.stringify({ reply }) }),

  // products
  createProduct: (body: any) => req("/api/admin/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: string, body: any) => req(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProduct: (id: string) => req(`/api/admin/products/${id}`, { method: "DELETE" }),
  uploadProductImage: (id: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<{ url: string }>(`/api/admin/products/${id}/image`, { method: "POST", body: fd });
  },

  // ingredients
  createIngredient: (pid: string, body: any) =>
    req(`/api/admin/products/${pid}/ingredients`, { method: "POST", body: JSON.stringify(body) }),
  updateIngredient: (id: string, body: any) =>
    req(`/api/admin/ingredients/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteIngredient: (id: string) => req(`/api/admin/ingredients/${id}`, { method: "DELETE" }),

  // settings & users
  updateSettings: (body: any) => req("/api/admin/settings", { method: "PATCH", body: JSON.stringify(body) }),
  updateUserRole: (uid: string, role: "admin" | "user") =>
    req(`/api/admin/users/${uid}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),

  // site images
  uploadSiteImage: (slot: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<{ url: string }>(`/api/admin/site-images?slot=${encodeURIComponent(slot)}`, {
      method: "POST",
      body: fd,
    });
  },

  // ai
  aiDescribe: (name: string, category?: string) =>
    req<{ description: string }>("/api/ai/describe", { method: "POST", body: JSON.stringify({ name, category }) }),
  aiBadge: (name: string, description?: string) =>
    req<{ badge: string }>("/api/ai/badge", { method: "POST", body: JSON.stringify({ name, description }) }),
  aiReplyTestimonial: (author: string, rating: number, content?: string | null) =>
    req<{ reply: string }>("/api/ai/reply-testimonial", { method: "POST", body: JSON.stringify({ author, rating, content }) }),
};
