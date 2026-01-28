//const BACKEND_URL = "http://localhost:3000";
const BACKEND_URL = "https://tickethack-backend-liart.vercel.app";

const depEl = document.querySelector("#departure");
const arrEl = document.querySelector("#arrival");
const dateEl = document.querySelector("#date");
const btnEl = document.querySelector("#btn-search");

const resultsCardEl = document.querySelector("#results");
const noTripEl = document.querySelector("#no-trip");
const resultsListEl = document.querySelector("#results-list");

// helpers cart (on stocke les trips complets)
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(trip) {
  const cart = getCart();
  if (!cart.some((x) => x._id === trip._id)) cart.push(trip);
  setCart(cart);
}

function fmtTime(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function showInitialState() {
  // on cache "no trip" et on vide la liste
  if (noTripEl) noTripEl.style.display = "none";
  if (resultsListEl) resultsListEl.innerHTML = "";
}

function showNoTrip() {
  if (noTripEl) noTripEl.style.display = "block";
  if (resultsListEl) resultsListEl.innerHTML = "";
}

function renderTrips(trips) {
  if (noTripEl) noTripEl.style.display = "none";

  resultsListEl.innerHTML = trips
    .map(
      (t) => `
      <div class="tripRow">
        <div>
          <div class="route">${t.departure} > ${t.arrival}</div>
          <div class="meta">${new Date(t.date).toLocaleDateString()}</div>
        </div>
        <div class="meta">${fmtTime(t.date)}</div>
        <div class="price">${t.price}€</div>
        <button class="miniBtn bookBtn" data-id="${t._id}">Book</button>
      </div>
    `,
    )
    .join("");

  resultsListEl.querySelectorAll(".bookBtn").forEach((b) => {
    b.addEventListener("click", () => {
      const trip = trips.find((x) => x._id === b.dataset.id);
      addToCart(trip);
      b.textContent = "Added";
      b.disabled = true;
    });
  });
}

showInitialState();

btnEl.addEventListener("click", async () => {
  const departure =
    depEl.value.trim().charAt(0).toUpperCase() +
    depEl.value.trim().slice(1).toLowerCase();

  const arrival =
    arrEl.value.trim().charAt(0).toUpperCase() +
    arrEl.value.trim().slice(1).toLowerCase();

  const date = dateEl.value;

  // check date passée
  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selected < today) {
    alert(
      "Oups ! Tu ne vas pas partir hier ? Choisis une date à partir d'aujourd'hui ^^",
    );
    return;
  }

  if (!departure || !arrival || !date) {
    alert(
      "Oups ! Remplis bien tous le schamps sinon tu vas partir pour Poudlard, voir 9 3/4 !",
    );
    return;
  }

  const url = `${BACKEND_URL}/trips?departure=${encodeURIComponent(
    departure,
  )}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.result || !data.trips || data.trips.length === 0) {
      showNoTrip();
      return;
    }

    renderTrips(data.trips);
  } catch (e) {
    console.error(e);
    alert("Backend unreachable");
  }
  resultsListEl.scrollTop = 0;
});

function capitalizeInput(input) {
  input.addEventListener("input", () => {
    const v = input.value;
    if (!v) return;

    input.value = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  });
}

capitalizeInput(depEl);
capitalizeInput(arrEl);

function showLoading() {
  if (noTripEl) noTripEl.style.display = "none";
  resultsListEl.innerHTML = `
    <div class="loadingBox">
      <div class="spinner"></div>
      <p id="message">Recherche ...…</p>
    </div>
  `;
}

function setSearching(isSearching) {
  btnEl.disabled = isSearching;
  btnEl.textContent = isSearching ? "Recherche ..." : "Search";
}

// Déclenchement au click Enter
[depEl, arrEl, dateEl].forEach((el) =>
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnEl.click();
  }),
);

//Empêche submit dans les form
document.querySelectorAll("form").forEach((f) => {
  f.addEventListener("submit", (e) => e.preventDefault());
});

// Ajout connexion user
const LOGIN = "Clovis";
const PASSWORD = "clovisthebest";

const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const userBadge = document.querySelector("#user-badge");

function refreshUserUI() {
  const user = localStorage.getItem("user");

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

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("user");
  refreshUserUI();
});

refreshUserUI();

// mot de passe oublié
forgotPwd.addEventListener("click", () => {
  alert(`Login : ${LOGIN}\nMot de passe : ${PASSWORD}`);
});
