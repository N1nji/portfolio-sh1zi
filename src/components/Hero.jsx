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

  // Variantes para animação em cascata (staggered)
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.section
      id="home"
      className="relative bg-gradient-to-b from-astralBlue via-midnightBlue to-midnightBlue py-16 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-buttercream/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-astralBlue/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Texto */}
        <div className="text-center md:text-left md:max-w-xl">
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-cursive md:text-6xl font-bold mb-4 text-buttercream tracking-tight"
          >
            Artista Digital
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg font-cursive md:text-xl text-ivory/90 mb-8 leading-relaxed"
          >
            Criações com muito amor, carinho e muita dedicação!
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "#1a1a2e" }} // Simula eclipseBlack no hover
              whileTap={{ scale: 0.95 }}
              href="mailto:saraemily3003@gmail.com?subject=Sobre%20seu%20portfólio&body=Olá,%20vi%20seu%20portfólio%20e%20gostaria%20de%20falar%20sobre..."
              className="bg-deepNavy text-white px-10 py-4 rounded-full shadow-lg shadow-black/20 transition-colors duration-300 font-medium text-center"
            >
              Me contrate
            </motion.a>
          </motion.div>
        </div>

        {/* Imagem com Animação de Flutuação */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] // Efeito de flutuar
          }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative group"
        >
          {/* Brilho externo na foto */}
          <div className="absolute -inset-1 bg-gradient-to-r from-buttercream to-astralBlue rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative w-52 h-52 md:w-72 md:h-72 bg-buttercream rounded-full overflow-hidden shadow-2xl border-4 border-white/10">
            {isAdmin ? (
              <ProfilePictureUploader currentPhoto={profilePhoto} onUpload={handleUpload} />
            ) : (
              <img
                src={profilePhoto || 'https://via.placeholder.com/200x200?text=Foto'}
                alt="Profile"
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>
        </motion.div>

      </div>
    </motion.section>
  )
}