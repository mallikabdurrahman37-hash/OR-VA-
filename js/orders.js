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
