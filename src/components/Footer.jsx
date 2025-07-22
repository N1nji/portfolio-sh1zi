import { FaLinkedin, FaXTwitter } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="w-full px-6 py-6 text-center text-sm text-moonlightGray bg-gradient-to-r from-midnightBlue to-midnightNavy">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
        {/* Texto principal */}
        <p>
          Desenvolvido por <strong className="text-white">N1nji</strong>
        </p>

        {/* Links e Ano */}
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Emi's Arts. Todos os direitos reservados.
        </p>

        {/* Redes (opcional) */}
        <div className="flex gap-4 text-moonlightGray">
          <a href="https://linkedin.com/in/emis-mendes-1b1a9b370/" target="_blank" className="hover:text-white transition">
            <FaLinkedin size={20} />
          </a>
          <a href="https://x.com/Str4nnyy" target="_blank" className="hover:text-white transition">
            <FaXTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
