import { ref, set, onValue, runTransaction } from "firebase/database"
import { db } from "../firebase"
import { useEffect, useState } from "react"
import { FaHeart } from "react-icons/fa"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function Modal({ art, onClose }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!art) return

    const likeRef = ref(db, `likes/${art.id}`)

    // ⚠️ Verifica localStorage primeiro
    const likedArt = localStorage.getItem(`liked_${art.id}`) === "true"
    setLiked(likedArt)

    // 🧠 Observa mudanças no banco
    const unsubscribe = onValue(likeRef, snapshot => {
      if (snapshot.exists()) {
        const value = snapshot.val()
        setLikes(value)

        if (value === 0 && likedArt) {
          localStorage.removeItem(`liked_${art.id}`)
          setLiked(false)
        }

      } else {
        set(likeRef, 0)
        setLikes(0)

        localStorage.removeItem(`liked_${art.id}`)
        setLiked(false)
      }
    })

    return () => unsubscribe()
  }, [art])

  const handleLike = () => {
    if (liked || !art) return

    const likeRef = ref(db, `likes/${art.id}`)

    runTransaction(likeRef, current => {
      return (current || 0) + 1
    }).then(() => {
      setLiked(true)
      localStorage.setItem(`liked_${art.id}`, "true")

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        scalar: 1.2,
        disableForReducedMotion: true
      })
    }).catch((err) => {
      console.error("Erro ao dar like:", err)
    })
  }

  if (!art) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-auto"
      onClick={onClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-transparent rounded-2xl overflow-hidden shadow-2xl relative w-full max-w-md sm:max-w-lg"
        initial={{ opacity: 0, y:-50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-4xl font-bold text-gray-500 hover:text-red-500 transition"
        >
          ×
        </button>

        {art.type === "video" ? (
          <video src={art.source} controls autoPlay className="w-full max-h-[80vh] object-contain mx-auto bg-black rounded-t-xl" />
        ) : (
          <img src={art.source} alt={art.title} 
          className="w-full max-h-[80vh] object-contain mx-auto rounded-t-xl image-pixelated select-none pointer-events-none"
          />
        )}

        <div className="p-4 text-center">
          <h2 className="text-2xl text-white font-extrabold font-Poppins">{art.title}</h2>
          <p className="text-white font-extrabold mt-2 font-Poppins">{art.description}</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <motion.button
              onClick={handleLike}
              disabled={liked}
              className={`text-2xl transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              whileTap={{ scale: 1.6, rotate: 10 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500}}
            >
              <FaHeart />
            </motion.button>

            <span className="text-white">{likes}</span>
          </div>

          <motion.button
            onClick={onClose}
            className="mt-5 px-6 py-2 bg-eclipseBlack text-white rounded-full hover:bg-red-600 transition font-poppins"
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            Fechar janela
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
