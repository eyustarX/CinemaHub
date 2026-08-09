import { register } from "../data/auth.js";

const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const registerBtn = document.getElementById("register-btn");
const errorEl = document.getElementById("auth-error");

registerBtn.addEventListener("click", handleRegister);

async function handleRegister() {
  hideError();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    showError("Please fill in every field.");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account…";

  try {
    await register({ name, email, password });
    window.location.href = "index.html";
  } catch (error) {
    showError(error.message);
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
  }
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
}
