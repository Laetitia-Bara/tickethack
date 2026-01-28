const LOGIN_OK = "Clovis";
const PASSWORD_OK = "clovisthebest";

const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const submitBtn = document.querySelector("#loginSubmit");
const forgotBtn = document.querySelector("#forgotPwd");

const displayName =
  LOGIN_OK.charAt(0).toUpperCase() + LOGIN_OK.slice(1).toLowerCase();

localStorage.setItem("user", displayName);

submitBtn.addEventListener("click", () => {
  const login = loginInput.value.trim();
  const password = passwordInput.value.trim();

  if (!login || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (
    login.toLowerCase() === LOGIN_OK.toLowerCase() &&
    password === PASSWORD_OK
  ) {
    localStorage.setItem("user", login);
    window.location.href = "index.html";
  } else {
    alert("Identifiants incorrects");
  }
});

forgotBtn.addEventListener("click", () => {
  alert(`Login : ${LOGIN_OK}\nMot de passe : ${PASSWORD_OK}`);
});
