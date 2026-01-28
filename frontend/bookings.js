import { wireAuthUI } from "./auth.js";
wireAuthUI();

//const BACKEND_URL = "http://localhost:3000";
const BACKEND_URL = "https://tickethack-backend-liart.vercel.app";

const rowsEl = document.querySelector("#bookingsRows");

function renderEmpty() {
  rowsEl.innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <p style="margin:0; font-weight:700;">No bookings yet.</p>
      <p style="margin:6px 0 0; color:#6b7280;">Why not plan a trip?</p>
    </div>
  `;
}

/* sans user connecté
async function loadBookings() {
  try {
    const res = await fetch(`${BACKEND_URL}/bookings`);
    const data = await res.json();

    if (!data.result) {
      rowsEl.innerHTML = `<p>Error loading bookings</p>`;
      return;
    }

    if (!data.bookings || data.bookings.length === 0) {
      renderEmpty();
      return;
    }

    rowsEl.innerHTML = data.bookings
      .map(
        (b) => `
        <div class="tripRow">
          <div>
            <div class="route">${b.trip.departure} > ${b.trip.arrival}</div>
            <div class="meta">${b.waitingTime || ""}</div>
          </div>
          <div class="meta">${b.time || ""}</div>
          <div class="price">${b.trip.price}€</div>
          <div class="meta">${new Date(b.trip.date).toLocaleDateString()}</div>
        </div>
      `,
      )
      .join("");
  } catch (e) {
    console.error(e);
    rowsEl.innerHTML = `<p>Error loading bookings</p>`;
  }
}*/

//avec user connecté
async function loadBookings() {
  const user = localStorage.getItem("user");
  if (!user) {
    alert("Veuillez vous connecter");
    window.location.assign("./index.html");
    return;
  }

  const res = await fetch(`${BACKEND_URL}/bookings`);
  const data = await res.json();

  if (!data.result) {
    rowsEl.innerHTML = `<p>Error loading bookings</p>`;
    return;
  }

  const myBookings = (data.bookings || []).filter(
    (b) => (b.user || "").trim().toLowerCase() === user.trim().toLowerCase(),
  );

  if (myBookings.length === 0) return renderEmpty();

  rowsEl.innerHTML = myBookings
    .map(
      (b) => `
    <div class="tripRow">
      <div>
        <div class="route">${b.trip.departure} > ${b.trip.arrival}</div>
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
