// auth.js
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const userBadge = document.querySelector("#user-badge");

export function getUser() {
  return localStorage.getItem("user");
}

export function setUser(username) {
  localStorage.setItem("user", username);
}

export function logout() {
  localStorage.removeItem("user");
}

export function refreshUserUI() {
  if (!userBadge || !loginBtn || !logoutBtn) return;

  const user = getUser();

  if (user) {
    userBadge.textContent = `Connecté en tant que ${user}`;
    userBadge.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
  } else {
    userBadge.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
  }
}

export function wireAuthUI() {
  loginBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  logoutBtn?.addEventListener("click", () => {
    logout();
    refreshUserUI();
  });

  refreshUserUI();
}
