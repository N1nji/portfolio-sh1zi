import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaDiscord, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'

export default function Bio() {
    const contatoRef = useRef(null)
    const [highlight, setHighlight] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHighlight(entry.isIntersecting)
            },
            { threshold: 0.5 }
        )
        if (contatoRef.current) observer.observe(contatoRef.current)
            return () => {
        if (contatoRef.current) observer.unobserve(contatoRef.current)
        }
    }, [])

  return (
    <motion.section
    id="contato"
    ref={contatoRef}
      className="bg-midnightBlue text-moonlightGray py-20 px-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* 🔹 Lado esquerdo (texto + redes) */}
        <div>
          <h2 className="text-4xl text-stardustWhite font-cursive md:text-5xl font-bold mb-4">SOBRE MIM</h2>

          <p className="text-lg font-cursive md:text-xl mb-6">
            Co-Founder & Artista da N1S1 Games
          </p>

          <p className="text-base font-cursive md:text-lg leading-relaxed">
            Ilustradora e artista digital apaixonada por criar mundos imaginativos, personagens
            carismáticos e experiências visuais envolventes. Desenha desde a infância, acumulando
            <strong> mais de 7 anos de experiência </strong> com ilustração e expressão artística. <br /> Atua como diretora de
            arte no jogo indie Mister Kitty, desenvolvendo desde os primeiros conceitos visuais e sprites
            até animações e cenários completos. Une criatividade, técnica e sensibilidade em cada
            traço, sempre buscando contar histórias visuais que conectam com o público.
          </p>

          {/* 🔗 Redes sociais */}
          <div className="flex gap-6 mt-6">
            <motion.a
              href="https://www.discord.com/users/str4nnyy"
              target="_blank"
              whileHover={{ scale: 1.2 }}
              animate={highlight ? { scale: [1, 1.3, 1], color: "#60a5fa" } : {}}
              transition={{ duration: 0.6, repeat: 1 }}
              className="text-moonlightGray transition"
            >
              <FaDiscord size={28} />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/emis-mendes-1b1a9b370/"
              target="_blank"
              whileHover={{ scale: 1.2 }}
            animate={highlight ? { scale: [1, 1.3, 1], color: "#60a5fa" } : {}}
            transition={{ duration: 0.6, repeat: 1 }}
            className="text-moonlightGray transition"
            >
              <FaLinkedin size={28} />
            </motion.a>

            <motion.a
              href="https://x.com/Str4nnyy"
              target="_blank"
              whileHover={{ scale: 1.2 }}
            animate={highlight ? { scale: [1, 1.3, 1], color: "#d1d5db" } : {}}
            transition={{ duration: 0.6, repeat: 1 }}
            className="text-moonlightGray transition"
            >
              <FaXTwitter size={28} />
            </motion.a>
          </div>
        </div>

        {/* 🔹 Lado direito (animação futura) */}
        <div className="flex justify-center">
          <div className="w-72 h-72 bg-midnightBlue/10 rounded-xl flex items-center justify-center select-none pointer-events-none">
            <video src="/assets/EmisNew.mov" 
            autoPlay
            loop
            muted
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
