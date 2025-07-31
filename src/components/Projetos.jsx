// src/components/Projetos.jsx
import React from 'react'

const Projetos = () => {
  return (
    <section className="w-full py-10 px-4 bg-gradient-to-b from-midnightNavy to-midnightNavy">
      <h2 className="text-4xl font-cursive font-bold text-stardustWhite mb-10 text-center">Projetos</h2>

      <div className="flex justify-center flex-wrap gap-6 max-w-4xl mx-auto">
        {/* Projeto Mister Kitty */}
        <a
          href="https://n1nji.itch.io/mister-kitty" // <- Trocar pelo link real depois
          target="_blank"
          rel="noopener noreferrer"
          className="transform hover:scale-105 transition duration-300"
        >
          <img
            src="/assets/misterkitty.png" // <- Você pode colocar esse arquivo na pasta public/
            alt="Capa do Mister Kitty"
            className="rounded-xl shadow-lg max-w-xs object-cover mx-auto"
          />
          <p className="mt-2 text-center font-medium text-[#ff4da6]">Mister Kitty: A Meowtastic Adventure</p>
    

    <div className="mt-2 flex justify-center">
          <img
            src="assets/badge-color.png"
            alt="Badge"
            className="max-w-xs transform hover:scale-105 transition duration-300"
            >
          </img>

        {/* Futuramente adicionar mais projetos aqui */}
      </div>
       </a>
      </div>
    </section>
  )
}

export default Projetos
