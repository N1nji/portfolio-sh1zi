import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { ref, onValue, set } from 'firebase/database'
import ProfilePictureUploader from './ProfilePictureUploader'

export default function Hero() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      if (currentUser?.email === adminEmail) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const photoRef = ref(db, 'profilePhoto')
    const unsubscribe = onValue(photoRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.url) {
        const version = data.updatedAt || Date.now()
        setProfilePhoto(`${data.url}?v=${version}`)
      } else {
        setProfilePhoto(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleUpload = (imageUrl) => {
    const photoRef = ref(db, 'profilePhoto')
    set(photoRef, { url: imageUrl, updatedAt: Date.now() })
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("saraemily3003@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.section
      id="home"
      // py-20 para garantir o respiro da imagem 1, sem exagerar como na 2
      className="relative bg-gradient-to-b from-astralBlue via-midnightBlue to-midnightBlue py-13 px-6 min-h-[400px] flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Lado Esquerdo: Texto */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl font-cursive md:text-6xl font-bold mb-4 text-buttercream">
            Artista Digital
          </h1>
          <p className="text-lg font-cursive md:text-xl text-ivory mb-8">
            Criações com muito amor, carinho e muita dedicação!
          </p>
          
          <div className="flex justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyEmail}
              className="bg-deepNavy text-white px-8 py-3 rounded-full shadow-lg transition-all font-medium min-w-[160px]"
            >
              {copied ? "✅ E-mail Copiado!" : "Me contrate"}
            </motion.button>
          </div>
        </div>

        {/* Lado Direito: Imagem */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative group w-48 h-48 md:w-64 md:h-64">
            {/* Brilho sutil de fundo apenas no hover para não poluir */}
            <div className="absolute -inset-1 bg-buttercream/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative w-full h-full bg-buttercream rounded-full overflow-hidden shadow-md border-4 border-white/10">
              {isAdmin ? (
                <ProfilePictureUploader currentPhoto={profilePhoto} onUpload={handleUpload} />
              ) : (
                <img
                  src={profilePhoto || 'https://via.placeholder.com/200x200?text=Foto'}
                  alt="Profile"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              )}
            </div>
          </div>
        </div>
        
      </div>
    </motion.section>
  )
}