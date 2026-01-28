import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaDiscord, FaLinkedin, FaXTwitter } from 'react-icons/fa6'

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
      className="bg-midnightBlue text-moonlightGray py-24 px-6 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }} // Melhor que 'animate' para disparar quando chegar na seção
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* 🔹 Lado esquerdo (texto + redes) */}
        <div className="order-2 md:order-1">
          <h2 className="text-4xl text-stardustWhite font-cursive md:text-5xl font-bold mb-6">
            SOBRE MIM
          </h2>

          <p className="text-xl font-cursive text-buttercream mb-6 italic">
            Co-Founder & Artista da N1S1 Games
          </p>

          <div className="text-base font-cursive md:text-lg leading-relaxed space-y-4 text-ivory/90">
            <p>
              Ilustradora e artista digital apaixonada por criar mundos imaginativos, personagens
              carismáticos e experiências visuais envolventes. 
            </p>
            <p>
              Desenha desde a infância, acumulando 
              <span className="text-buttercream font-bold"> mais de 7 anos de experiência </span> 
              com ilustração e expressão artística.
            </p>
            <p>
              Atua como <span className="text-stardustWhite underline decoration-buttercream/50 underline-offset-4">diretora de arte</span> no jogo indie <span className="italic text-buttercream">Mister Kitty</span>, desenvolvendo desde os primeiros conceitos visuais e sprites até animações e cenários completos. 
            </p>
          </div>

          {/* 🔗 Redes sociais */}
          <div className="flex gap-6 mt-10">
            {[
              { icon: <FaDiscord size={26} />, href: "https://www.discord.com/users/str4nnyy", label: "Discord" },
              { icon: <FaLinkedin size={26} />, href: "https://www.linkedin.com/in/emis-mendes/", label: "LinkedIn" },
              { icon: <FaXTwitter size={26} />, href: "https://x.com/Str4nnyy", label: "Twitter" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#fef3c7" }} // Cor buttercrem no hover
                animate={highlight ? { y: [0, -5, 0] } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-ivory/60 hover:text-buttercream transition-colors duration-300"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* 🔹 Lado direito (Vídeo com Moldura Artística) */}
        <div className="order-1 md:order-2 flex justify-center relative">
          {/* Glow de fundo para o vídeo */}
          <div className="absolute inset-0 bg-astralBlue/20 blur-[80px] rounded-full" />
          
          <motion.div 
            whileHover={{ rotate: 2, scale: 1.02 }}
            className="relative p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-2xl border border-white/10 bg-midnightBlue/40">
              <video 
                src="/assets/EmisNew.mov" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            
            {/* Detalhe decorativo - Canto da moldura */}
            <div className="absolute -bottom-4 -right-4 bg-buttercream text-midnightBlue px-4 py-1 rounded-full text-xs font-bold shadow-lg">
              HELLO!
            </div>
          </motion.div>
        </div>
        
      </div>
    </motion.section>
  )
}