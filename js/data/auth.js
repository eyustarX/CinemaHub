const USERS_KEY = "cinemahub_users";
const SESSION_KEY = "cinemahub_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 2; // 2 hours

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function register({ name, email, password }) {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  createSession(newUser);
  return toPublicUser(newUser);
}

export async function login({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  const passwordHash = await hashPassword(password);

  if (!user || user.passwordHash !== passwordHash) {
    throw new Error("Incorrect email or password.");
  }

  createSession(user);
  return toPublicUser(user);
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const session = JSON.parse(raw);
  if (Date.now() > session.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }

  return session.user;
}

function createSession(user) {
  const session = {
    user: toPublicUser(user),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
