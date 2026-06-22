// ─────────────────────────────────────────────────────────────
// FIRESTORE DATA SERVICE
// ─────────────────────────────────────────────────────────────
// Replaces the old localStorage-based DB for important data:
// users, orders, reviews, contact messages, consultations.
//
// Analytics/interaction events intentionally stay in localStorage
// (src/data/db.js) to avoid burning through Firestore's free quota
// on every page view / click.
//
// Firestore collections used:
//   users          (doc id = Firebase Auth UID)
//   orders
//   reviews
//   messages       (contact form submissions)
//   consultations
// ─────────────────────────────────────────────────────────────

import {
  doc, getDoc, setDoc, updateDoc, addDoc, collection,
  getDocs, query, where, orderBy
} from 'firebase/firestore'
import { db } from './config'

// ─── USERS ───────────────────────────────────────
export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createUserDoc(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    purchasedProjects: [],
    createdAt: new Date().toISOString()
  })
}

export async function updateUserDoc(uid, updates) {
  await updateDoc(doc(db, 'users', uid), updates)
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ─── ORDERS ──────────────────────────────────────
export async function addOrderDoc(order) {
  const ref = await addDoc(collection(db, 'orders'), order)
  return { id: ref.id, ...order }
}

export async function getAllOrders() {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('date', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getOrdersByUser(userId) {
  const snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateOrderDoc(orderId, updates) {
  await updateDoc(doc(db, 'orders', orderId), updates)
}

// ─── REVIEWS ─────────────────────────────────────
export async function getReviewsByProject(projectId) {
  const snap = await getDocs(query(collection(db, 'reviews'), where('projectId', '==', projectId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getUserReviewForProject(projectId, userId) {
  const snap = await getDocs(query(
    collection(db, 'reviews'),
    where('projectId', '==', projectId),
    where('userId', '==', userId)
  ))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function upsertReview(review) {
  const existing = await getUserReviewForProject(review.projectId, review.userId)
  if (existing) {
    await updateDoc(doc(db, 'reviews', existing.id), review)
    return { id: existing.id, ...review }
  }
  const ref = await addDoc(collection(db, 'reviews'), review)
  return { id: ref.id, ...review }
}

// ─── CONTACT MESSAGES ────────────────────────────
export async function addMessageDoc(message) {
  const ref = await addDoc(collection(db, 'messages'), message)
  return { id: ref.id, ...message }
}

export async function getAllMessages() {
  const snap = await getDocs(query(collection(db, 'messages'), orderBy('date', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ─── CONSULTATIONS ───────────────────────────────
export async function addConsultationDoc(consultation) {
  const ref = await addDoc(collection(db, 'consultations'), consultation)
  return { id: ref.id, ...consultation }
}

export async function getAllConsultations() {
  const snap = await getDocs(query(collection(db, 'consultations'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateConsultationDoc(id, updates) {
  await updateDoc(doc(db, 'consultations', id), updates)
}

// ─── PROJECTS (Firebase Firestore) ───────────────
export async function getAllProjects() {
  const snap = await getDocs(collection(db, 'projects'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProjectById(id) {
  const snap = await getDoc(doc(db, 'projects', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function addProjectDoc(project) {
  const { id, ...data } = project
  await setDoc(doc(db, 'projects', id), data)
  return project
}

export async function updateProjectDoc(id, updates) {
  await updateDoc(doc(db, 'projects', id), updates)
}

export async function deleteProjectDoc(id) {
  const { deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'projects', id))
}

export async function seedProjectsIfEmpty(defaults) {
  const snap = await getDocs(collection(db, 'projects'))
  if (!snap.empty) return // already seeded
  for (const p of defaults) {
    const { id, ...data } = p
    await setDoc(doc(db, 'projects', id), data)
  }
}
