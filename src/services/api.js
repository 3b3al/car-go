// ---------------------------------------------------------------------------
// Central API client for CarGo backend
// Base URL: https://cargo-project-production.up.railway.app
// ---------------------------------------------------------------------------

const BASE_URL = "https://cargo-project-production.up.railway.app/api";

// ── Utility ───────────────────────────────────────────────────────────────
/**
 * Returns true if the string looks like a MongoDB ObjectId (24 hex chars).
 * Use this to guard API calls that require a real DB id.
 */
export function isMongoId(id) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

// ── Token helpers ─────────────────────────────────────────────────────────
const TOKEN_KEY = "cargo_token_v1";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Core fetch wrapper ────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Try to parse JSON regardless of status code
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    // Auto-clear stale / invalid tokens so subsequent requests are not blocked
    if (res.status === 401 || res.status === 403) {
      removeToken();
    }
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
/**
 * Extract the JWT from whatever field the backend uses.
 * Tries: token, access_token, accessToken, jwt, and common nested paths.
 */
export function extractToken(data) {
  if (!data) return null;
  return (
    data.token ??
    data.access_token ??
    data.accessToken ??
    data.jwt ??
    data.data?.token ??
    data.data?.access_token ??
    data.data?.jwt ??
    data.user?.token ??
    data.user?.jwt ??
    null
  );
}

export const authApi = {
  /**
   * Register a new user.
   * @param {{ username: string, email: string, password: string, role: string }} payload
   */
  async register(payload) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // Log in dev so you can see the exact response shape
    if (import.meta.env.DEV) console.log("[auth/register]", data);
    return data;
  },

  /**
   * Login an existing user.
   * @param {{ email: string, password: string }} payload
   */
  async login(payload) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (import.meta.env.DEV) console.log("[auth/login]", data);
    return data;
  },
};

// ── Products ──────────────────────────────────────────────────────────────
export const productApi = {
  /** GET /api/product — all products (requires auth) */
  getAll() {
    return request("/product");
  },

  /** GET /api/product/search?name= — search products (requires auth) */
  search(name) {
    return request(`/product/search?name=${encodeURIComponent(name)}`);
  },

  /** GET /api/product/:id — single product (requires auth) */
  getById(id) {
    return request(`/product/${id}`);
  },

  /**
   * POST /api/product — create product (seller, multipart)
   * @param {FormData} formData
   */
  create(formData) {
    return request("/product", { method: "POST", body: formData });
  },

  /** PATCH /api/product/:id */
  patch(id, formData) {
    return request(`/product/${id}`, { method: "PATCH", body: formData });
  },

  /** PUT /api/product/:id */
  update(id, formData) {
    return request(`/product/${id}`, { method: "PUT", body: formData });
  },

  /** DELETE /api/product/:id */
  remove(id) {
    return request(`/product/${id}`, { method: "DELETE" });
  },

  // Seller-scoped variants
  seller: {
    getAll() {
      return request("/product/seller");
    },
    search(name) {
      return request(`/product/seller/search?name=${encodeURIComponent(name)}`);
    },
    getById(id) {
      return request(`/product/seller/${id}`);
    },
    patch(id, formData) {
      return request(`/product/seller/${id}`, { method: "PATCH", body: formData });
    },
    update(id, formData) {
      return request(`/product/seller/${id}`, { method: "PUT", body: formData });
    },
    remove(id) {
      return request(`/product/seller/${id}`, { method: "DELETE" });
    },
  },
};

// ── Orders ────────────────────────────────────────────────────────────────
export const orderApi = {
  /**
   * POST /api/order/ — place a new order (requires auth)
   * @param {{ products: Array<{ product: string, quantity: number, price: number }> }} payload
   */
  create(payload) {
    return request("/order/", { method: "POST", body: JSON.stringify(payload) });
  },

  /** GET /api/order/my — current user's orders (requires auth) */
  getMine() {
    return request("/order/my");
  },

  /**
   * PATCH /api/order/:id — update order status (requires auth)
   * @param {string} id
   * @param {"pending"|"confirmed"|"shipped"|"delivered"|"cancelled"} status
   */
  updateStatus(id, status) {
    return request(`/order/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /** GET /api/order — all orders (admin, requires auth) */
  getAll() {
    return request("/order");
  },
};

// ── Users ─────────────────────────────────────────────────────────────────
export const userApi = {
  /** GET /api/user — all users (admin, requires auth) */
  getAll() {
    return request("/user");
  },

  /** GET /api/user/:id — single user (requires auth) */
  getById(id) {
    return request(`/user/${id}`);
  },
};

// ── Reviews ───────────────────────────────────────────────────────────────
export const reviewApi = {
  /**
   * POST /api/review — create a review (requires auth)
   * @param {{ product: string, rating: number, comment: string }} payload
   */
  create(payload) {
    return request("/review", { method: "POST", body: JSON.stringify(payload) });
  },

  /** GET /api/review — all reviews (public) */
  getAll() {
    return request("/review");
  },

  /** GET /api/review/product/:productId — reviews for a product (public) */
  getByProduct(productId) {
    return request(`/review/product/${productId}`);
  },

  /** GET /api/review/:id — single review (public) */
  getById(id) {
    return request(`/review/${id}`);
  },

  /**
   * PUT /api/review/:id — update review (requires auth)
   * @param {string} id
   * @param {{ rating?: number, comment?: string }} payload
   */
  update(id, payload) {
    return request(`/review/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },

  /** DELETE /api/review/:id — delete review (requires auth) */
  remove(id) {
    return request(`/review/${id}`, { method: "DELETE" });
  },
};

// ── AI / Damage Detection ─────────────────────────────────────────────────
export const damageApi = {
  /**
   * POST /api/detect-damage — upload image for damage detection (public)
   * @param {File} imageFile
   * @returns {Promise<{ damage_type: string, description: string, confidence: number }>}
   */
  detect(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    return request("/detect-damage", { method: "POST", body: formData });
  },
};

// ── Recommendations ───────────────────────────────────────────────────────
export const recommendApi = {
  /**
   * GET /api/recommend/content?itemName= — content-based recommendations (public)
   * @param {string} itemName
   */
  byContent(itemName) {
    return request(`/recommend/content?itemName=${encodeURIComponent(itemName)}`);
  },

  /**
   * GET /api/recommend/trending?limit= — trending products (public)
   * @param {number} limit
   */
  trending(limit = 10) {
    return request(`/recommend/trending?limit=${limit}`);
  },

  /**
   * GET /api/recommend/user?userId= — collaborative recommendations (public)
   * @param {string} userId
   */
  byUser(userId) {
    return request(`/recommend/user?userId=${encodeURIComponent(userId)}`);
  },
};
