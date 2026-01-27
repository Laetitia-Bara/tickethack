const BACKEND_URL = "http://localhost:3000";

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

function removeFromCart(tripId) {
  const cart = getCart().filter((id) => id !== tripId);
  setCart(cart);
}
