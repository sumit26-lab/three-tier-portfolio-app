// lib/apiClient.ts
// lib/apiClient.ts
// export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
//   // 1. Ab hum 'token' mangenge, 'adminKey' nahi
//   const token = localStorage.getItem('token') || '';

//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...(options.headers as Record<string, string>),
//   };

//   // 2. Standard Authorization Header use karein
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const res = await fetch(url, { ...options, headers });

//   // 3. Agar token expire ho jaye (401), toh login pe wapas bhejo
//   if (res.status === 401 || res.status === 403) {
//     localStorage.removeItem('token');
//     if (window.location.pathname.startsWith('/admin')) {
//       window.location.href = "/login";
//     }
//   }

//   if (!res.ok) throw new Error(`Request failed: ${res.status}`);
//   return res.json();
// }

// frontend/src/lib/apiClient.ts

/**
 * ✅ Single API client for whole app
 * - Adds JWT automatically
 * - Handles JSON
 * - Auto logout on 401/403
 * - Works with React Query
 */

// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = localStorage.getItem("token");

//   // ✅ FIX HERE
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(options.headers as Record<string, string>),
//   };

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (res.status === 401 || res.status === 403) {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//     throw new Error("Unauthorized");
//   }

//   if (!res.ok) {
//     throw new Error(await res.text());
//   }

//   return res.json();
// }


// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = localStorage.getItem("token");

//   // ✅ safer than Record<string,string>
//   const headers = new Headers(options.headers || {});

//   headers.set("Content-Type", "application/json");

//   if (token) {
//     headers.set("Authorization", `Bearer ${token}`);
//   }

//   const res = await fetch(url, {
//     ...options,
//     headers,
//   });

//   // ✅ auto logout
//   if (res.status === 401 || res.status === 403) {
//     localStorage.removeItem("token");
//     window.location.href = "/admin/login";
//     throw new Error("Unauthorized");
//   }

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Request failed");
//   }

//   // ✅ safe JSON parsing
//   const contentType = res.headers.get("content-type");

//   if (contentType?.includes("application/json")) {
//     return res.json();
//   }

//   return res.text() as T;
// }



export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  /* ============================= */
  /* 🚀 SMART 401 HANDLING        */
  /* ============================= */

  const isLoginCall = url.includes("/login");

  if ((res.status === 401 || res.status === 403) && !isLoginCall) {
    // only for protected routes
    localStorage.removeItem("token");
    window.location.replace("/login"); // replace better than href
    throw new Error("Session expired");
  }

  /* ============================= */

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return (await res.text()) as T;
}
