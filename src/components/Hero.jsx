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
    console.log("Salvando no Firebase:", imageUrl)
    const photoRef = ref(db, 'profilePhoto')
    set(photoRef, {
      url: imageUrl,
      updatedAt: Date.now()
    })
  }

  return (
    <motion.section
      id="home"
      // MELHORIA: Gradiente mais suave e padding maior para respiro
      className="relative bg-gradient-to-b from-astralBlue via-midnightBlue to-midnightBlue py-24 px-8 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Elemento Decorativo: Um brilho de fundo para dar profundidade */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-buttercream/5 rounded-full blur-[120px] -z-1" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Texto */}
        <div className="text-center md:text-left md:max-w-2xl">
          <motion.h1 
            className="text-6xl md:text-8xl font-cursive font-bold mb-6 text-buttercream drop-shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Artista Digital
          </motion.h1>
          
          <p className="text-xl md:text-2xl font-medium text-ivory/90 mb-8 max-w-lg leading-relaxed">
            Criações com muito amor, carinho e muita dedicação!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="mailto:saraemily3003@gmail.com?subject=Sobre%20seu%20portfólio&body=Olá,%20vi%20seu%20portfólio%20e%20gostaria%20de%20falar%20sobre..."
              className="bg-buttercream text-midnightBlue font-bold px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(255,251,235,0.3)] transition-all duration-300 text-center"
            >
              Me contrate
            </a>
          </div>
        </div>

        {/* Imagem de Perfil */}
        <div className="relative">
          {/* MELHORIA: Moldura decorativa atrás da foto */}
          <div className="absolute -inset-4 border-2 border-buttercream/20 rounded-full animate-[spin_10s_linear_infinite]" />
          
          <div className="relative w-56 h-56 md:w-80 md:h-80 bg-buttercream rounded-full overflow-hidden shadow-2xl border-4 border-buttercream/10">
            {isAdmin ? (
              <ProfilePictureUploader currentPhoto={profilePhoto} onUpload={handleUpload} />
            ) : (
              <img
                src={profilePhoto || 'https://via.placeholder.com/400x400?text=Foto'}
                alt="Avatar"
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-110"
              />
            )}
          </div>
        </div>
        
      </div>
    </motion.section>
  )
}