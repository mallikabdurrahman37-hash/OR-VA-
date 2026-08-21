// =========================================================
// ORÈVA — Cart
// Client-side cart (localStorage) so anonymous visitors can
// shop freely; synced into the order at checkout time.
// =========================================================
const CART_KEY = 'oreva_cart_v1';
const WISHLIST_KEY = 'oreva_wishlist_v1';

function read(key){
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch(e){ return []; }
}
function write(key, val){
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent('oreva:cart-updated'));
}

export function getCart(){ return read(CART_KEY); }

export function addToCart(item){
  // item: { id, name, price, image, size, shippingCharge, stock }
  const cart = read(CART_KEY);
  const existing = cart.find(c => c.id === item.id && c.size === item.size);
  if (existing) {
    existing.qty = Math.min(existing.qty + (item.qty || 1), item.stock || 99);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  write(CART_KEY, cart);
}

export function updateQty(id, size, qty){
  const cart = read(CART_KEY);
  const line = cart.find(c => c.id === id && c.size === size);
  if (line) {
    line.qty = Math.max(1, Math.min(qty, line.stock || 99));
    write(CART_KEY, cart);
  }
}

export function removeFromCart(id, size){
  const cart = read(CART_KEY).filter(c => !(c.id === id && c.size === size));
  write(CART_KEY, cart);
}

export function clearCart(){ write(CART_KEY, []); }

export function cartCount(){
  return read(CART_KEY).reduce((sum, c) => sum + c.qty, 0);
}

export function cartTotals(){
  const cart = read(CART_KEY);
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  // Highest product-specific shipping charge among cart items (0 = free shipping item)
  const shippingCharge = cart.length
    ? Math.max(...cart.map(c => (typeof c.shippingCharge === 'number' ? c.shippingCharge : 0)))
    : 0;
  return { subtotal, shippingCharge, total: subtotal + shippingCharge };
}

// ---------- Wishlist ----------
export function getWishlist(){ return read(WISHLIST_KEY); }

export function isWishlisted(id){
  return read(WISHLIST_KEY).some(w => w.id === id);
}

export function toggleWishlist(item){
  let list = read(WISHLIST_KEY);
  if (list.some(w => w.id === item.id)) {
    list = list.filter(w => w.id !== item.id);
  } else {
    list.push(item);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('oreva:wishlist-updated'));
  return list.some(w => w.id === item.id);
}

export function wishlistCount(){ return read(WISHLIST_KEY).length; }
