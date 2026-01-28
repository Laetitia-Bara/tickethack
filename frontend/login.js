import { setUser } from "./auth.js";

const LOGIN_OK = "Clovis";
const PASSWORD_OK = "clovisthebest";

const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const submitBtn = document.querySelector("#loginSubmit");
const forgotBtn = document.querySelector("#forgotPwd");

submitBtn.addEventListener("click", () => {
  const login = loginInput.value.trim();
  const password = passwordInput.value.trim();

  if (!login || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // login insensible à la casse
  if (
    login.toLowerCase() === LOGIN_OK.toLowerCase() &&
    password === PASSWORD_OK
  ) {
    const displayName =
      login.charAt(0).toUpperCase() + login.slice(1).toLowerCase();
    setUser(displayName);
    window.location.href = "index.html";
  } else {
    alert("Identifiants incorrects");
  }
});

forgotBtn.addEventListener("click", () => {
  alert(`Login : ${LOGIN_OK}\nMot de passe : ${PASSWORD_OK}`);
});
