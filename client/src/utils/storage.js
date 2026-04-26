// Storage utilities for better session management

const LOCAL_SESSION_KEY = "gesturai_auth";
const SESSION_STORAGE_KEY = "gesturai_auth_session";

export function getStoredSession() {
  const candidates = [
    localStorage.getItem(LOCAL_SESSION_KEY),
    sessionStorage.getItem(SESSION_STORAGE_KEY),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }
  return null;
}

export function saveSession(session, persist = false) {
  const serialized = JSON.stringify(session);

  if (persist) {
    localStorage.setItem(LOCAL_SESSION_KEY, serialized);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

export function clearSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function isSessionValid(session) {
  return session && session.token && session.user && session.user.id;
}

export function saveToken(token) {
  if (token) {
    localStorage.setItem("gesturai_auth_token", token);
  }
}

export function getToken() {
  return localStorage.getItem("gesturai_auth_token");
}

export function clearToken() {
  localStorage.removeItem("gesturai_auth_token");
}
