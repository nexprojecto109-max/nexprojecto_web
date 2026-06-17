import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  getUserDoc, createUserDoc, updateUserDoc, addOrderDoc
} from '../firebase/firestoreService'
import { DB } from '../data/db'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fires on initial load AND whenever auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserDoc(firebaseUser.uid)
        if (profile) {
          setUser({ id: firebaseUser.uid, ...profile })
        } else {
          // Edge case: Auth account exists but Firestore doc missing
          setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || '', email: firebaseUser.email, role: 'user', purchasedProjects: [] })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      await createUserDoc(cred.user.uid, { name, email, role: 'user' })
      setUser({ id: cred.user.uid, name, email, role: 'user', purchasedProjects: [] })
      toast.success('Account created! Welcome to NexProjecto 🎉')
      return true
    } catch (err) {
      toast.error(firebaseErrorMessage(err))
      return false
    }
  }

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserDoc(cred.user.uid)
      toast.success(`Welcome back, ${profile?.name || 'there'}! 👋`)
      return { success: true, role: profile?.role || 'user' }
    } catch (err) {
      toast.error(firebaseErrorMessage(err))
      return { success: false }
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    toast.success('Logged out successfully')
  }

  // projectId + paymentInfo: { phone, transactionId }
  const purchaseProject = async (projectId, paymentInfo = {}) => {
    if (!user) return null
    const project = DB.getProjects().find(p => p.id === projectId)
    if (!project) return null

    const order = {
      userId: user.id,
      projectId,
      projectTitle: project.title,
      amount: project.price,
      status: 'pending', // becomes 'completed' once admin verifies payment
      phone: paymentInfo.phone || '',
      transactionId: paymentInfo.transactionId || '',
      date: new Date().toISOString()
    }

    try {
      const savedOrder = await addOrderDoc(order)
      const updatedPurchased = [...(user.purchasedProjects || []), projectId]
      await updateUserDoc(user.id, { purchasedProjects: updatedPurchased })
      setUser({ ...user, purchasedProjects: updatedPurchased })
      toast.success('Order placed! We will verify your payment shortly 🚀')
      return { order: savedOrder, project }
    } catch (err) {
      toast.error('Could not place order. Please try again.')
      console.error('[NexProjecto] purchaseProject failed:', err)
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, purchaseProject }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

function firebaseErrorMessage(err) {
  const code = err?.code || ''
  if (code.includes('email-already-in-use')) return 'Email already registered!'
  if (code.includes('invalid-email')) return 'Invalid email address'
  if (code.includes('weak-password')) return 'Password must be at least 6 characters'
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) return 'Invalid email or password'
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.'
  if (code.includes('network-request-failed')) return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}
