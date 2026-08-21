// =========================================================
// ORÈVA — Products data layer (Firestore: products collection)
// =========================================================
import { db, collection, getDocs, getDoc, doc, query, where, orderBy, limit as fbLimit } from './firebase-config.js';

function mapDoc(d){
  const data = d.data();
  return {
    id: d.id,
    name: data.name || 'Untitled piece',
    description: data.description || '',
    category: data.category || '',
    price: typeof data.price === 'number' ? data.price : 0,
    compareAtPrice: typeof data.compareAtPrice === 'number' ? data.compareAtPrice : null,
    images: Array.isArray(data.images) ? data.images.slice(0, 5) : [],
    featured: !!data.featured,
    bestSeller: !!data.bestSeller,
    stock: typeof data.stock === 'number' ? data.stock : 0,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    isActive: data.isActive !== false,
    createdAt: data.createdAt || null,
    shippingCharge: typeof data.shippingCharge === 'number' ? data.shippingCharge : 0,
  };
}

export async function fetchAllProducts(){
  const q = query(collection(db, 'products'), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function fetchProductById(id){
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return mapDoc(snap);
}

export async function fetchFeatured(max = 8){
  const q = query(collection(db, 'products'), where('isActive', '==', true), where('featured', '==', true), fbLimit(max));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function fetchBestSellers(max = 8){
  const q = query(collection(db, 'products'), where('isActive', '==', true), where('bestSeller', '==', true), fbLimit(max));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function fetchByCategory(category){
  const q = query(collection(db, 'products'), where('isActive', '==', true), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export function filterAndSort(products, { q, sort } = {}){
  let list = [...products];
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle));
  }
  switch (sort) {
    case 'price-asc': list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'newest': list.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0)); break;
    default: break;
  }
  return list;
}

export function productCardHTML(p){
  const img = p.images[0] || '';
  const tag = p.bestSeller ? 'Best Seller' : (p.featured ? 'New' : '');
  return `
  <article class="product-card">
    <div class="product-media">
      <a href="product.html?id=${p.id}" aria-label="${p.name}">
        ${img ? `<img src="${img}" alt="${p.name}" loading="lazy">` : `<div class="skeleton" style="width:100%;height:100%"></div>`}
      </a>
      ${tag ? `<span class="product-tag">${tag}</span>` : ''}
      <button class="wishlist-toggle" data-wish-id="${p.id}" aria-label="Toggle wishlist"></button>
    </div>
    <div class="product-info">
      <a href="product.html?id=${p.id}"><h3 class="product-name">${p.name}</h3></a>
      <div class="product-price">
        <span class="price-now">${'\u20B9' + p.price.toLocaleString('en-IN')}</span>
        ${p.compareAtPrice ? `<span class="price-was">${'\u20B9' + p.compareAtPrice.toLocaleString('en-IN')}</span>` : ''}
      </div>
    </div>
  </article>`;
}
