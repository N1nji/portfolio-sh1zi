import { useEffect, useState } from 'react'
import { ref, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import Modal from './Modal'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSignOutAlt, FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa'

export default function Gallery() {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedArt, setSelectedArt] = useState(null)
  const [folders, setFolders] = useState([])
  const [categoryFilter, setCategoryFiler] = useState("Todos")

  const isPixelArtFolder = selectedFolder?.id === "Animações"

  useEffect(() => {
    const foldersRef = ref(db, 'folders')

    const unsubscribe = onValue(foldersRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const folderList = Object.entries(data).map(([id, folder]) => ({
          id,
          title: folder.title,
          cover: folder.cover,
          category: folder.category || "Outros",
          artworks: folder.artworks ? Object.values(folder.artworks).sort((a, b) => a.index - b.index) : []
        }))
        setFolders(folderList)
      }
    })

    return () => unsubscribe()
  }, [])

  const categories = ["Todos", "Mister Kitty", "Artes", "Pixel Art", "Animações"]

  const filteredFolders = categoryFilter === "Todos"
    ? folders
    : folders.filter(folder => folder.category === categoryFilter)

  return (
    <section
      id="galeria"
      onContextMenu={(e) => e.preventDefault()}
      className="min-h-screen bg-gradient-to-b from-midnightBlue via-midnightBlue to-midnightNavy py-12 px-4 sm:px-6 text-center"
    >
      {/* Título com estilo aprimorado */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-cursive font-bold text-stardustWhite mb-12 tracking-wide drop-shadow-lg"
      >
        {selectedFolder ? selectedFolder.title.toUpperCase() : "GALERIA"}
      </motion.h2>

      {/* 🔘 FILTROS POR CATEGORIA (Glassmorphism style) */}
      {!selectedFolder && (
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFiler(cat)}
              className={`px-6 py-2 rounded-full border-2 text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
                categoryFilter === cat
                  ? 'bg-stardustWhite text-midnightBlue border-stardustWhite shadow-white/20'
                  : 'bg-transparent text-stardustWhite border-white/20 hover:border-stardustWhite/50 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 📁 Lista de Pastas */}
      {!selectedFolder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {filteredFolders.map((folder, idx) => (
            <motion.div
              key={folder.id}
              className="group cursor-pointer bg-eclipseBlack/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-xl"
              onClick={() => setSelectedFolder(folder)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={folder.cover}
                  alt={folder.title}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 image-pixelated"
                />
              </div>
              <div className="p-6 bg-eclipseBlack">
                <h3 className="text-stardustWhite text-2xl font-semibold tracking-tight group-hover:text-white transition-colors">
                  {folder.title}
                </h3>
                <span className="text-xs text-moonlightGray uppercase tracking-widest mt-2 block opacity-60">
                  {folder.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* 🔙 Voltar - Estilizado como botão de ação real */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => setSelectedFolder(null)}
              className="flex items-center gap-2 font-poppins font-medium bg-white/10 hover:bg-white/20 text-stardustWhite px-5 py-2.5 rounded-lg border border-white/10 transition-all active:scale-95"
            >
              <FaArrowLeft className="text-sm" /> Voltar para pastas
            </button>
          </div>

          {/* 🎨 Pixel Art (estilo Itch.io refinado) */}
          {isPixelArtFolder ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-start bg-black/20 p-6 rounded-2xl border border-white/5">
              {selectedFolder.artworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className="cursor-pointer aspect-square flex items-center justify-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/20 shadow-inner"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <img
                    src={art.source}
                    alt={art.title}
                    className="w-full h-full object-contain image-pixelated select-none pointer-events-none"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            // 🖼️ Galeria padrão (Cards com profundidade)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedFolder.artworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  className="bg-eclipseBlack/30 border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-white/20 group cursor-pointer"
                  onClick={() => setSelectedArt(art)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                    {art.type === 'video' ? (
                      <video
                        src={art.source}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={art.source}
                        alt={art.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105 select-none pointer-events-none"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">Ver Detalhes</span>
                    </div>
                  </div>
                  <div className="p-5 text-left">
                    <h4 className="text-stardustWhite font-semibold text-lg line-clamp-1">{art.title}</h4>
                    {art.description && (
                      <p className="text-sm text-moonlightGray mt-1 line-clamp-2 opacity-80 font-poppins">
                        {art.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🪟 Modal */}
      <AnimatePresence mode="wait">
        {selectedArt && (
          <Modal art={selectedArt} onClose={() => setSelectedArt(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}