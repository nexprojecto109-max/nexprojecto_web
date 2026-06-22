import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getReviewsByProject, getUserReviewForProject, upsertReview } from '../firebase/firestoreService'
import { useAuth } from '../context/AuthContext'

function StarRow({ value, onChange, size = '1.4rem' }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <FiStar
          key={n}
          onClick={() => onChange && onChange(n)}
          style={{
            cursor: onChange ? 'pointer' : 'default',
            fontSize: size,
            color: n <= value ? '#FCD34D' : 'var(--text-muted)',
            fill: n <= value ? '#FCD34D' : 'none'
          }}
        />
      ))}
    </div>
  )
}

export default function ReviewSection({ project, alreadyPurchased }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [existing, setExisting] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const list = await getReviewsByProject(project.id)
      if (!active) return
      setReviews(list)
      if (user) {
        const mine = await getUserReviewForProject(project.id, user.id)
        if (!active) return
        setExisting(mine)
        setRating(mine?.rating || 0)
        setComment(mine?.comment || '')
      }
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [project.id, user?.id])

  // Combine seed rating/reviews count with real submitted reviews for display
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : project.rating
  const totalReviews = reviews.length > 0 ? reviews.length : project.reviews

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating')
      return
    }
    setSubmitting(true)
    const review = {
      projectId: project.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString()
    }
    try {
      const saved = await upsertReview(review)
      setExisting(saved)
      const list = await getReviewsByProject(project.id)
      setReviews(list)
      toast.success(existing ? 'Review updated! 🌟' : 'Thanks for your review! 🌟')
    } catch (err) {
      toast.error('Could not save review. Please try again.')
      console.error('[NexProjecto] review submit failed:', err)
    }
    setSubmitting(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontWeight: '700', fontSize: '1.2rem' }}>
          Ratings &amp; <span className="gradient-text">Reviews</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRow value={Math.round(avgRating)} size="1.1rem" />
          <strong>{avgRating}</strong>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Review form */}
      {user ? (
        alreadyPurchased ? (
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              {existing ? 'Update your review' : 'Write a review'}
            </h4>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '0.75rem' }}>
                <StarRow value={rating} onChange={setRating} />
              </div>
              <textarea
                rows={3}
                placeholder="Share your experience with this project..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ marginBottom: '0.75rem' }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" className="btn-primary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : existing ? 'Update Review' : 'Submit Review'}
              </motion.button>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Purchase this project to leave a review.
          </div>
        )
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Login and purchase this project to leave a review.
        </div>
      )}

      {/* Reviews list - horizontal auto-scroll */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to review this project!</p>
      ) : (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <style>{`
            @keyframes scrollReviews {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .reviews-track {
              display: flex;
              gap: 1rem;
              animation: scrollReviews ${Math.max(reviews.length * 6, 20)}s linear infinite;
              width: max-content;
            }
            .reviews-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="reviews-track">
            {[...reviews, ...reviews].map((r, idx) => (
              <div key={`${r.id}-${idx}`} className="glass-card" style={{ padding: '1.1rem', minWidth: 280, maxWidth: 320, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0
                    }}><FiUser /></div>
                    <strong style={{ fontSize: '0.9rem' }}>{r.userName}</strong>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {new Date(r.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <StarRow value={r.rating} size="1rem" />
                {r.comment && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
