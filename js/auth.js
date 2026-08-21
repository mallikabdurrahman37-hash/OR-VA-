// =========================================================
// ORÈVA — Authentication
// Anonymous browsing by default, upgradeable to email/password
// or Google. Writes/updates the `users/{uid}` profile doc.
// =========================================================
import {
  auth, db,
  onAuthStateChanged, signInAnonymously,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup, updateProfile,
  doc, getDoc, setDoc, serverTimestamp,
} from './firebase-config.js';

let currentUser = null;
const listeners = [];

export function onUserReady(cb){
  listeners.push(cb);
  if (currentUser !== null) cb(currentUser);
}

function notify(user){
  currentUser = user;
  listeners.forEach(cb => cb(user));
}

// Ensure every visitor has a session — anonymous if nothing else.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    try { await signInAnonymously(auth); }
    catch (e) { console.error('Anonymous sign-in failed', e); notify(null); }
    return; // onAuthStateChanged will fire again with the anon user
  }
  notify(user);
});

export function isAnonymous(){
  return !!currentUser && currentUser.isAnonymous;
}

export function getCurrentUser(){
  return currentUser;
}

async function ensureUserDoc(user, extra = {}){
  if (!user || user.isAnonymous) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const base = {
    email: user.email || '',
    profileName: user.displayName || extra.profileName || '',
    photoURL: user.photoURL || '',
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  } else {
    await setDoc(ref, base, { merge: true });
  }
}

export async function registerWithEmail(email, password, profileName){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (profileName) await updateProfile(cred.user, { displayName: profileName });
  await ensureUserDoc(cred.user, { profileName });
  return cred.user;
}

export async function loginWithEmail(email, password){
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function loginWithGoogle(){
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function logout(){
  await signOut(auth);
}

export function friendlyAuthError(err){
  const code = err && err.code ? err.code : '';
  const map = {
    'auth/email-already-in-use': 'That email already has an ORÈVA account. Try signing in instead.',
    'auth/invalid-email': 'That email address doesn\u2019t look right.',
    'auth/weak-password': 'Use at least 6 characters for your password.',
    'auth/wrong-password': 'That password doesn\u2019t match this account.',
    'auth/user-not-found': 'No ORÈVA account uses that email yet.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before finishing.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
