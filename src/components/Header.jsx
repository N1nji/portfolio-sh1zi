import { motion } from 'framer-motion'

export default function Header() {
    return  (
  <motion.header
  className="bg-gradient-to-r from-midnightBlue to-astralBlue text-moonlightGray fixed top-0 w-full z-50 shadow-md"
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
    <h1 className="text-xl font-lobster font-bold tracking-wide text-buttercream">
      Emis
    </h1>
    <nav className="flex flex-row gap-6 text-sm md:text-base items-center">
      <a href="#home" className="group relative text-buttercream hover:text-ivory transition">
        <img src="/assets/home.png" alt="Home" className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        Home
      </span>
        </a>
      <a href="#galeria" className="group relative text-buttercream hover:text-ivory transition">
        <img src="/assets/gallery.png" alt="Home" className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
         Galeria
      </span>
        </a>
      <a href="#contato" className="group relative text-buttercream hover:text-ivory transition">
        <img src="/assets/contact-mail.png" alt="Home" className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        Contato
      </span>
        </a>
    </nav>
  </div>
</motion.header>
    )
}
