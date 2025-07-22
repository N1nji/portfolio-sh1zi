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
  onValue(photoRef, (snapshot) => {
    const url = snapshot.val()
    if (url) setProfilePhoto(url)
  })
}, [])


const handleUpload = (imageUrl) => {
  const photoRef = ref(db, 'profilePhoto')
  set(photoRef, imageUrl)
}


  return (
    <motion.section
      id="home"
      className="bg-gradient-to-b from-astralBlue via-midnightBlue to-midnightBlue py-16 px-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Texto */}
        <div className="text-center md:text-left md:max-w-xl">
          <h1 className="text-5xl font-cursive md:text-6xl font-bold mb-4 text-buttercream">
            Artista Digital
          </h1>
          <p className="text-lg font-cursive md:text-xl text-ivory mb-6">
            Criações com muito amor, carinho e muita dedicação!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
            href="mailto:saraemily3003@gmail.com?subject=Sobre%20seu%20portfólio&body=Olá,%20vi%20seu%20portfólio%20e%20gostaria%20de%20falar%20sobre..."
            className="bg-deepNavy text-white px-6 py-3 rounded-full hover:bg-eclipseBlack transition">
              Me contrate
            </a>
          </div>
        </div>

        {/* Imagem */}
        <div className="w-48 h-48 md:w-64 md:h-64 bg-buttercream rounded-full overflow-hidden shadow-md">
          {isAdmin? (
            <ProfilePictureUploader currentPhoto={profilePhoto} onUpload={handleUpload} />
          ) : (
          <img
            src={profilePhoto || '/img/esposalinda.jpg'}
            className="w-full h-full object-cover"
          />
        )}
        </div>
      </div>
    </motion.section>
  )
}
