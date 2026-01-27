const BACKEND_URL = "http://localhost:3000";

const depEl = document.querySelector("#departure");
const arrEl = document.querySelector("#arrival");
const dateEl = document.querySelector("#date");
const btnEl = document.querySelector("#searchBtn");
const resultsEl = document.querySelector("#results");

function renderEmptyStart() {
  resultsEl.innerHTML = `
    <div class="empty">
      <p>It’s time to book your future trip.</p>
    </div>
  `;
}

function renderNoTrips() {
  resultsEl.innerHTML = `
    <div class="empty">
      <p>No trip found.</p>
    </div>
  `;
}

function fmtTime(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderTrips(trips) {
  resultsEl.innerHTML = trips
    .map(
      (t) => `
      <div class="tripRow">
        <div class="left">
          <div class="route">${t.departure} &gt; ${t.arrival}</div>
        </div>
        <div class="mid">${fmtTime(t.date)}</div>
        <div class="price">${t.price}€</div>
        <button class="bookBtn" data-id="${t._id}">Book</button>
      </div>
    `,
    )
    .join("");

  resultsEl.querySelectorAll(".bookBtn").forEach((b) => {
    b.addEventListener("click", () => {
      addToCart(b.dataset.id);
      b.textContent = "Added";
      b.disabled = true;
    });
  });
}

renderEmptyStart();

btnEl.addEventListener("click", async () => {
  const departure = depEl.value.trim();
  const arrival = arrEl.value.trim();
  const date = dateEl.value; // YYYY-MM-DD

  if (!departure || !arrival || !date) {
    alert("Please fill departure, arrival and date.");
    return;
  }

  const url =
    `${BACKEND_URL}/trips?departure=${encodeURIComponent(departure)}` +
    `&arrival=${encodeURIComponent(arrival)}` +
    `&date=${encodeURIComponent(date)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.result) {
    renderNoTrips();
    return;
  }

  if (data.trips.length === 0) {
    renderNoTrips();
    return;
  }

  renderTrips(data.trips);
});
