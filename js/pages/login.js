import { login } from "../data/auth.js";

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const loginBtn = document.getElementById("login-btn");
const authError = document.getElementById("auth-error");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

loginBtn.addEventListener("click", handleLogin);

async function handleLogin() {
  hideFieldError("email");
  hideFieldError("password");
  authError.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let isValid = true;

  if (!email) {
    showFieldError("email", "Email is required.");
    isValid = false;
  } else if (!emailPattern.test(email)) {
    showFieldError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (!password) {
    showFieldError("password", "Password is required.");
    isValid = false;
  }

  if (!isValid) return;

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in…";

  try {
    await login({ email, password });
    window.location.href = "index.html";
  } catch (error) {
    authError.textContent = error.message;
    authError.hidden = false;
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In";
  }
}

function showFieldError(field, message) {
  const el = document.getElementById(`${field}-error`);
  el.textContent = message;
  el.hidden = false;
}

function hideFieldError(field) {
  document.getElementById(`${field}-error`).hidden = true;
}
