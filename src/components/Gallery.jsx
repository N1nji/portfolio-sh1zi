import { useEffect, useState } from 'react'
import { ref, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import Modal from './Modal'
import { motion } from 'framer-motion'
import { FaSignOutAlt, FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa'
import { AnimatePresence } from 'framer-motion'

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
      className="bg-gradient-to-b from-midnightBlue via-midnightBlue to-midnightNavy py-7 text-center"
    >
      <h2 className="text-4xl font-cursive font-bold text-stardustWhite mb-10 text-center">
        {selectedFolder ? selectedFolder.title : "GALERIA"}
      </h2>

      {/* 🔘 FILTROS POR CATEGORIA */}
      {!selectedFolder && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFiler(cat)}
              className={`px-4 py-2 rounded-full border tex-sm font-medium transition ${
                categoryFilter === cat
                  ? 'bg-white text-eclipseBlack'
                  : 'bg-eclipseBlack text-white hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 📁 Lista de Pastas */}
      {!selectedFolder ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto image-pixelated">
          {filteredFolders.map(folder => (
            <motion.div
              key={folder.id}
              className="cursor-pointer bg-eclipseBlack hover:brightness-110 hover:scale-105 rounded-xl p-4 transition text-center"
              onClick={() => setSelectedFolder(folder)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={folder.cover}
                alt={folder.title}
                className="rounded-xl mb-4 h-40 object-cover w-full select-none pointer-events-none"
              />
              <h3 className="text-moonlightGray text-xl font-semibold">
                {folder.title}
              </h3>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* 🔙 Voltar */}
          <button
            onClick={() => setSelectedFolder(null)}
            className="flex gap-4 font-lobster bg-dustyBlue text-midnightNavy px-3 py-2 rounded hover:bg-midnightBlue transition"
          >
            <FaArrowLeft /> Voltar para pastas
          </button>

          {/* 🎨 Pixel Art (estilo Itch.io) */}
          {isPixelArtFolder ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-0 justify-start max-w-5xl mx-auto">
              {selectedFolder.artworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className="cursor-pointer p-1 rounded transition-transform hover:scale-105"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.5 }}
                >
                  <img
                    src={art.source}
                    alt={art.title}
                    className="w-full max-w-[96px] mx-auto image-pixelated select-none pointer-events-none"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            // 🖼️ Galeria padrão
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto image-pixelated">
              {selectedFolder.artworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  className="rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 relative cursor-pointer group"
                  onClick={() => setSelectedArt(art)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {art.type === 'video' ? (
                    <video
                      src={art.source}
                      className="w-full h-64 object-cover"
                      muted
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={art.source}
                      alt={art.title}
                      className="w-full h-64 object-cover group-hover:brightness-110 transition duration-300 select-none pointer-events-none"
                    />
                  )}
                  <p className="p-4 text-center font-poppins text-stardustWhite">{art.title}</p>
                  {art.description && (
                    <p className="text-sm text-gray-400 font-poppins text-center px-2">{art.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
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
