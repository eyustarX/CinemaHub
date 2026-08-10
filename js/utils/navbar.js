import { getCurrentUser, logout } from "../data/auth.js";

const authLink = document.getElementById("navbar-auth-link");

function renderAuthLink() {
  const user = getCurrentUser();

  if (user) {
    authLink.textContent = `Log Out (${user.name})`;
    authLink.href = "#";
    authLink.onclick = handleLogoutClick;
  } else {
    authLink.textContent = "Log In";
    authLink.href = "login.html";
    authLink.onclick = null;
  }
}

function handleLogoutClick(event) {
  event.preventDefault();
  logout();
  window.location.href = "index.html";
}

renderAuthLink();

const toggleBtn = document.getElementById("navbar-toggle");
const navLinks = document.getElementById("navbar-links");

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
    if (e.matches) {
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}
