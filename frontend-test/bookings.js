//const BACKEND_URL = "http://localhost:3000";
const BACKEND_URL = "https://tickethack-backend-liart.vercel.app";

const rowsEl = document.querySelector("#bookingsRows");

function renderEmpty() {
  rowsEl.innerHTML = `
    <div class="empty">
      <img src="./assets/train.png" alt="train" />
      <p>No bookings yet.</p>
    </div>
  `;
}

async function loadBookings() {
  const res = await fetch(`${BACKEND_URL}/bookings`);
  const data = await res.json();

  if (!data.result) {
    rowsEl.innerHTML = `<p>Error loading bookings</p>`;
    return;
  }

  if (!data.bookings || data.bookings.length === 0) return renderEmpty();

  rowsEl.innerHTML = data.bookings
    .map(
      (b) => `
    <div class="tripRow">
      <div>
        <div class="route">${b.trip.departure} &gt; ${b.trip.arrival}</div>
        <div class="meta">${b.waitingTime || ""}</div>
      </div>
      <div class="meta">${b.time || ""}</div>
      <div class="price">${b.trip.price}€</div>
      <div class="meta">${new Date(b.trip.date).toLocaleDateString()}</div>
    </div>
  `,
    )
    .join("");
}

loadBookings();
