import React from 'react'

const Projetos = () => {
  return (
    <section id="project" className="w-full py-20 px-4 bg-gradient-to-b from-midnightNavy to-[#0a0a1a]">
      <h2 className="text-4xl font-cursive font-bold text-stardustWhite mb-16 text-center">
        Meus Projetos
      </h2>

      <div className="flex justify-center flex-wrap gap-8 max-w-6xl mx-auto">
        {/* Projeto Mister Kitty */}
        <a
          href="https://n1nji.itch.io/mister-kitty"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden p-4 transition-all duration-500 hover:border-[#ff4da6]/50 hover:shadow-[0_0_20px_rgba(255,77,166,0.2)] max-w-sm"
        >
          {/* Container da Imagem */}
          <div className="overflow-hidden rounded-xl">
            <img
              src="/assets/misterkitty.png"
              alt="Capa do Mister Kitty"
              className="w-full h-auto object-cover transform group-hover:scale-110 transition duration-500 select-none pointer-events-none"
            />
          </div>

          {/* Info do Projeto */}
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-bold text-[#ff4da6] group-hover:text-[#ff7eb6] transition-colors">
              Mister Kitty: A Meowtastic Adventure
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Uma aventura felina vibrante com mecânicas de plataforma e visuais cativantes.
            </p>

            {/* Badge/Tech Stack */}
            <div className="flex items-center justify-between pt-2">
              <img
                src="assets/badge-color.png"
                alt="Badge"
                className="h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xs text-stardustWhite/50 font-mono italic">
                Ver no Itch.io →
              </span>
            </div>
          </div>
        </a>

        {/* Placeholder para próximos projetos (ajuda a visualizar o grid) */}
        <div className="hidden md:flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 w-[384px] text-white/20">
          Novo projeto em breve...
        </div>
      </div>
    </section>
  )
}

export default Projetos