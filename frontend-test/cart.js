const BACKEND_URL = "http://localhost:3000";

const rowsEl = document.querySelector("#cartRows");
const totalEl = document.querySelector("#total");
const purchaseBtn = document.querySelector("#purchaseBtn");

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function removeFromCart(tripId) {
  setCart(getCart().filter((x) => x._id !== tripId));
}

function fmtTime(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    rowsEl.innerHTML = `
      <div class="empty">
        <img src="./assets/notfound.png" alt="notfound" />
        <p>Your cart is empty.</p>
      </div>
    `;
    totalEl.textContent = "0€";
    purchaseBtn.disabled = true;
    return;
  }

  purchaseBtn.disabled = false;

  const total = cart.reduce((sum, t) => sum + (t.price || 0), 0);
  totalEl.textContent = `${total}€`;

  rowsEl.innerHTML = cart
    .map(
      (t) => `
    <div class="tripRow">
      <div>
        <div class="route">${t.departure} &gt; ${t.arrival}</div>
        <div class="meta">${new Date(t.date).toLocaleDateString()}</div>
      </div>
      <div class="meta">${fmtTime(t.date)}</div>
      <div class="price">${t.price}€</div>
      <button class="danger delBtn" data-id="${t._id}">X</button>
    </div>
  `,
    )
    .join("");

  rowsEl.querySelectorAll(".delBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id);
      renderCart();
    });
  });
}

purchaseBtn.addEventListener("click", async () => {
  const cart = getCart();
  const tripIds = cart.map((t) => t._id);

  const res = await fetch(`${BACKEND_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tripIds }),
  });

  const data = await res.json();
  if (!data.result) {
    alert(data.error || "Purchase failed");
    return;
  }

  setCart([]);
  window.location.assign("./bookings.html");
});

renderCart();
