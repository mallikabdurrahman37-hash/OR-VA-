// =========================================================
// ORÈVA — Orders
// COD only. expectedDelivery = orderDate + 6 days.
// Cancellation only permitted pre-shipment, enforced live
// against Firestore (not just the UI state).
// =========================================================
import {
  db, collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, serverTimestamp, Timestamp,
} from './firebase-config.js';

export const STAGES = ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

// Maps the admin-controlled orderStatus string to a stage index.
export function stageIndex(orderStatus){
  const map = {
    'placed': 0, 'order placed': 0,
    'confirmed': 1, 'order confirmed': 1,
    'shipped': 2,
    'out for delivery': 3,
    'delivered': 4,
  };
  const key = (orderStatus || '').toLowerCase();
  return key in map ? map[key] : 0;
}

// ---------------------------------------------------------
// WhatsApp verification (manual). Firestore is the only source
// of truth; nothing here is ever stored in localStorage.
// ---------------------------------------------------------
export const VERIFICATION_PENDING = 'pending_verification';
export const VERIFICATION_CONFIRMED = 'confirmed';
export const WHATSAPP_NUMBER = '919239529167';

// Returns 'pending' | 'confirmed' | 'legacy'.
// Orders without the field (or with an unrecognised value) are legacy:
// their historical verification state is unknown, so we show nothing.
export function verificationState(order){
  const v = order && order.verificationStatus;
  if (v === VERIFICATION_CONFIRMED) return 'confirmed';
  if (v === VERIFICATION_PENDING) return 'pending';
  return 'legacy';
}

// Builds the prefilled message from a saved order (uses real fields:
// items[].name / size / qty and shippingAddress.*).
export function buildWhatsAppMessage(order){
  const a = order.shippingAddress || {};
  const ref = order.orderNumber || order.id || '';
  const lines = (order.items || []).map(it => {
    const parts = [`- ${it.name || 'Item'}`];
    if (it.size) parts.push(`Size: ${it.size}`);
    parts.push(`Quantity: ${it.qty || 1}`);
    return parts.join(' | ');
  });
  const cityLine = [a.city, a.state].filter(Boolean).join(', ') + (a.pincode ? ` - ${a.pincode}` : '');
  return [
    'Hello ORÈVA Team,',
    '',
    'I would like to complete the verification of my order.',
    '',
    `Order ID: ${ref}`,
    '',
    `Customer Name: ${order.customerName || a.name || ''}`,
    '',
    'Order Items:',
    '',
    ...lines,
    '',
    'Shipping Address:',
    a.addressLine || '',
    cityLine,
    '',
    `Phone Number: ${order.phone || a.phone || ''}`,
    '',
    'Please verify my order and complete the confirmation process.',
    '',
    'Thank you.',
  ].join('\n');
}

export function buildWhatsAppUrl(order){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}

// Small status pill for lists / headers. Empty string for legacy orders.
export function verificationBadgeHTML(order){
  const st = verificationState(order);
  if (st === 'confirmed') return '<span class="badge-pill status-active">Verification Confirmed</span>';
  if (st === 'pending') return '<span class="badge-pill status-warn">Pending Verification</span>';
  return '';
}

// Customer-facing verification card. Empty string for legacy orders.
// Cancelled orders no longer need verification, so the pending prompt is hidden.
export function verificationSectionHTML(order){
  const st = verificationState(order);
  if (st === 'legacy') return '';
  if (st === 'confirmed') {
    return `<div class="card mt-2" id="wa-verification" style="border-color:var(--moss)">
      <div class="flex justify-between items-center" style="flex-wrap:wrap;gap:0.5rem">
        <span class="small" style="font-weight:600;color:var(--ink)">WhatsApp Verification</span>
        <span class="badge-pill status-active">Verification Confirmed</span>
      </div>
      <p class="small mt-1">Thank you! We have received and verified your WhatsApp confirmation.</p>
    </div>`;
  }
  if (order.cancelled) return '';
  return `<div class="card mt-2" id="wa-verification" style="background:#F3E7D6;border-color:#E4CBA0">
    <div class="flex justify-between items-center" style="flex-wrap:wrap;gap:0.5rem">
      <span class="small" style="font-weight:600;color:#7A5A24">WhatsApp Verification</span>
      <span class="badge-pill status-warn">Pending Verification</span>
    </div>
    <h3 class="h4 mt-1" style="color:#7A5A24">Complete Your Order Verification</h3>
    <p class="small mt-1" style="color:#7A5A24">Your order has been received successfully! We're sorry for the extra wait. As a growing brand, we're still improving our verification process.</p>
    <p class="small mt-1" style="color:#7A5A24"><strong>Please remember to send the confirmation message on WhatsApp to complete your order verification.</strong></p>
    <a class="btn btn-primary btn-sm mt-2" id="wa-reopen" href="${buildWhatsAppUrl(order)}" target="_blank" rel="noopener">Open WhatsApp to Complete Verification</a>
  </div>`;
}

function publicOrderNumber(){
  const rand = Math.floor(1000 + Math.random() * 9000);
  const y = new Date().getFullYear();
  return `ORV-${y}-${rand}`;
}

export async function createOrder({ user, customerName, customerEmail, phone, shippingAddress, items, subtotal, shippingCharge }){
  const orderDate = new Date();
  const expectedDelivery = new Date(orderDate);
  expectedDelivery.setDate(expectedDelivery.getDate() + 6);

  const payload = {
    userId: user ? user.uid : 'guest',
    customerName,
    customerEmail,
    phone,
    shippingAddress,
    items,
    subtotal,
    shippingCharge,
    totalAmount: subtotal + shippingCharge,
    paymentMethod: 'COD',
    orderStatus: 'Order Placed',
    // WhatsApp verification is tracked separately from fulfilment (orderStatus).
    // New orders always start pending; only the admin panel may set 'confirmed'.
    verificationStatus: VERIFICATION_PENDING,
    orderDate: serverTimestamp(),
    expectedDelivery: Timestamp.fromDate(expectedDelivery),
    courierService: '',
    trackingId: '',
    delayNote: '',
    cancelled: false,
    orderNumber: publicOrderNumber(),
  };
  const ref = await addDoc(collection(db, 'orders'), payload);
  return { id: ref.id, ...payload };
}

export async function fetchOrdersForUser(uid){
  const q = query(collection(db, 'orders'), where('userId', '==', uid));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.orderDate?.seconds || 0) - (a.orderDate?.seconds || 0));
  return list;
}

export async function fetchOrderById(id){
  const snap = await getDoc(doc(db, 'orders', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Cancellation is only valid before shipment. We re-read the live
// document first — a stale UI button must never bypass this check.
export async function requestCancellation(orderId){
  const ref = doc(db, 'orders', orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ok: false, reason: 'Order not found.' };
  const data = snap.data();
  if (data.cancelled) return { ok: false, reason: 'This order is already cancelled.' };
  const idx = stageIndex(data.orderStatus);
  if (idx >= 2 /* Shipped or later */) {
    return { ok: false, reason: 'This order has already shipped and can no longer be cancelled here. Please contact us for help.' };
  }
  await updateDoc(ref, { cancelled: true, orderStatus: 'Order Placed', delayNote: 'Cancelled by customer before shipment.' });
  return { ok: true };
}

export function canCancel(order){
  return !order.cancelled && stageIndex(order.orderStatus) < 2;
}
