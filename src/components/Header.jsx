import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-midnightBlue/60 backdrop-blur-md shadow-2xl"
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo com brilho */}
        <h1 className="text-2xl font-lobster font-bold tracking-wide text-buttercream drop-shadow-[0_0_8px_rgba(254,243,199,0.3)]">
          Emis
        </h1>

        <nav className="flex flex-row gap-8 items-center">
          {[
            { id: "#home", src: "/assets/home.png", label: "Home" },
            { id: "#galeria", src: "/assets/gallery.png", label: "Galeria" },
            { id: "#contato", src: "/assets/contact-mail.png", label: "Sobre" },
            { id: "#project", src: "/assets/game.png", label: "Projetos" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.id}
              className="group relative flex items-center justify-center transition-all"
            >
              {/* Ícone com animação de escala e brilho */}
              <motion.img
                src={item.src}
                alt={item.label}
                className="w-6 h-6 object-contain filter brightness-90 group-hover:brightness-110"
                whileHover={{ y: -4, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />

              {/* Tooltip refinado */}
              <span className="absolute -bottom-10 scale-0 group-hover:scale-100 transition-all duration-200 text-[10px] font-bold tracking-widest uppercase text-midnightBlue bg-buttercream px-3 py-1 rounded-full shadow-lg">
                {item.label}
              </span>

              {/* Indicador de Hover (pontinho embaixo) */}
              <span className="absolute -bottom-2 w-0 h-1 bg-buttercream rounded-full transition-all duration-300 group-hover:w-1" />
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}