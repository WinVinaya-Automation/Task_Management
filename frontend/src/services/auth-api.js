// const API = "http://localhost:5000/api/auth";
// const API = "http://192.168.1.20:5000/api/auth";
const API = `${window.location.protocol}//${window.location.hostname}:5000/api/auth`;

export async function signup(username, email, password, role) {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  }).then((res) => res.json());
}

export async function login(username, password) {
  return fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((res) => res.json());
}

export async function verifyToken(token) {
  return fetch(`${API}/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}

export async function createUser(username, email, password, role) {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  }).then((res) => res.json());
}

export async function checkUserExists(identifier) {
  const url = `${API}/check-user?identifier=${encodeURIComponent(identifier)}`;
  const res = await fetch(url);
  return res.json();
}

export async function resetPassword(identifier, newPassword) {
  return fetch(`${API}/reset-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, new_password: newPassword }),
  }).then((res) => res.json());
}
