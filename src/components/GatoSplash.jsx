import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GatoSplash() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 3000)

    const handleScroll = () => setShow(false)
    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <AnimatePresence>
        {show && (
            <motion.div
            className="fixed inset-0 bg-midnightBlue flex items-center justify-center z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-40 h-40 bg-transparent rounded-full flex items-center justify-center text-deepNavy font-bold text-2xl"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}

        >
           <img src="/assets/GATINHO AZUL.png"
           />
        
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>
  )
}
