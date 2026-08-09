import { register } from "../data/auth.js";

const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const registerBtn = document.getElementById("register-btn");
const authError = document.getElementById("auth-error");

const namePattern = /^[a-zA-Z\s'-]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

registerBtn.addEventListener("click", handleRegister);

async function handleRegister() {
  hideFieldError("name");
  hideFieldError("email");
  hideFieldError("password");
  hideFieldError("confirm-password");
  authError.hidden = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let isValid = true;

  if (!name) {
    showFieldError("name", "Name is required.");
    isValid = false;
  } else if (name.length < 2) {
    showFieldError("name", "Name must be at least 2 characters.");
    isValid = false;
  } else if (!namePattern.test(name)) {
    showFieldError(
      "name",
      "Name can only contain letters, spaces, and hyphens.",
    );
    isValid = false;
  }

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
  } else if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters.");
    isValid = false;
  }

  if (!confirmPassword) {
    showFieldError("confirm-password", "Please confirm your password.");
    isValid = false;
  } else if (password && password !== confirmPassword) {
    showFieldError("confirm-password", "Passwords do not match.");
    isValid = false;
  }

  if (!isValid) return;

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account…";

  try {
    await register({ name, email, password });
    window.location.href = "index.html";
  } catch (error) {
    authError.textContent = error.message;
    authError.hidden = false;
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
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
