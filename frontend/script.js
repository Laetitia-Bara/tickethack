const BACKEND_URL = "https://tickethack-backend-liart.vercel.app";

/*fetch('BACKEND_URL')
	.then(response => response.json())
	.then(data => {

document.querySelector("#btn-search").addEventListener("click", function () {
 const departure = document.querySelector('#departure').value;
 const arrival = document.querySelector('#arrival').value;
 const date = document.querySelector('#date').value;

})}) */

const depEl = document.querySelector("#departure");
const arrEl = document.querySelector("#arrival");
const dateEl = document.querySelector("#date");
const btnEl = document.querySelector("#searchBtn");
const resultsEl = document.querySelector("#results");

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

function renderEmptyStart() {
  resultsEl.innerHTML = `
    <div class="resultsEmpty">
      <img src="./assets/train.png" alt="train" />
      <div class="hr"></div>
      <p class="meta">It’s time to book your future trip.</p>
    </div>
  `;
}

function renderNoTrips() {
  resultsEl.innerHTML = `
    <div class="resultsEmpty">
      <img src="./assets/notfound.png" alt="notfound" />
      <div class="hr"></div>
      <p class="meta">No trip found.</p>
    </div>
  `;
}

function escapeHTML(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}

function renderTrips(trips) {
  resultsEl.innerHTML = trips
    .map(
      (t) => `
    <div class="tripRow">
      <div>
        <div class="route">${escapeHTML(t.departure)} &gt; ${escapeHTML(t.arrival)}</div>
        <div class="meta">${new Date(t.date).toLocaleDateString()}</div>
      </div>
      <div class="meta">${fmtTime(t.date)}</div>
      <div class="price">${t.price}€</div>
      <button class="bookBtn" data-id="${t._id}">Book</button>
    </div>
  `,
    )
    .join("");

  resultsEl.querySelectorAll(".bookBtn").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      const trip = trips.find((x) => x._id === id);
      addToCart(trip);
      b.textContent = "Added";
      b.disabled = true;
    });
  });
}

renderEmptyStart();

btnEl.addEventListener("click", async () => {
  const departure = depEl.value.trim();
  const arrival = arrEl.value.trim();
  const date = dateEl.value;

  if (!departure || !arrival || !date) {
    alert("Veuillez remplir départ, arrivée et date.");
    return;
  }

  const url = `${BACKEND_URL}/trips?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.result) return renderNoTrips();
  if (!data.trips || data.trips.length === 0) return renderNoTrips();

  renderTrips(data.trips);
});
