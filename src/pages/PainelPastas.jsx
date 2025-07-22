// PainelPastas.jsx
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, remove, update } from 'firebase/database'
import { motion } from 'framer-motion'
import EditFolderModal from '../components/EditFolderModal'
import EditCoverModal from '../components/EditCoverModal'
import ConfirmModal from '../components/ConfirmModal'
import EditArtModal from '../components/EditModalArt'
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

export default function PainelPastas() {
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [user, setUser] = useState(null)
  const [folders, setFolders] = useState([])
  const navigate = useNavigate()
  const [editingFolder, setEditingFolder] = useState(null)
  const [editingCoverFolder, setEditingCoverFolder] = useState(null)
  const [deletingFolder, setDeletingFolder] = useState(null)
  const [deletingArt, setDeletingArt] = useState(null)
  const [editingArt, setEditingArt] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === adminEmail) {
        setUser(currentUser)
      } else {
        navigate('/')
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const foldersRef = ref(db, 'folders')
    const unsubscribe = onValue(foldersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const folderList = Object.entries(data).map(([id, folder]) => ({
          id,
          ...folder,
          artworks: folder.artworks
            ? Object.entries(folder.artworks).map(([key, art]) => ({
                ...art,
                id: key
              }))
            : []
        }))
        setFolders(folderList)
      } else {
        setFolders([])
      }
    })

    return () => unsubscribe()
  }, [])

  const confirmDeleteFolder = async () => {
    if (deletingFolder) {
      await remove(ref(db, `folders/${deletingFolder.id}`))
      setDeletingFolder(null)
    }
  }

  const confirmDeleteArt = async () => {
    if (deletingArt) {
      await remove(ref(db, `folders/${deletingArt.folderId}/artworks/${deletingArt.artId}`))
      setDeletingArt(null)
    }
  }

  const handleSaveTitle = async (folderId, updatedData) => {
    if (updatedData.title.trim() !== '') {
      await update(ref(db, `folders/${folderId}`), updatedData)
    }
    setEditingFolder(null)
  }

  if (!user) return <p className="text-center mt-10 text-white">Verificando acesso...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnightNavy via-midnightBlue to-blue-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black bg-opacity-30 p-4 flex flex-col md:fixed top-0 left-0 h-auto md:h-screen md:justify-between md:shadow-lg z-40">
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Admin</h2>
          <p className="text-sm text-white mb-1">Bem-vindo,</p>
          <p className="text-sm font-semibold text-white break-words">{user?.email}</p>
        </div>
        <div className="flex flex-col gap-4 mt-4 md:mt-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white text-midnightNavy px-3 py-2 rounded hover:bg-gray-200 transition"
          >
            <FaArrowLeft /> Voltar pro site
          </button>
          <button
          onClick={() => navigate('/admin')}
            className="flex items-center gap-2 bg-blue-700 text-midnightNavy px-3 py-2 rounded hover:bg-blue-600 transition"
         >
         <FaArrowLeft /> Voltar para o admin
         </button>
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="md:ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Painel de Pastas</h1>
        <div className="space-y-8">
          {folders.map(folder => (
            <motion.div
              key={folder.id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{folder.title}</h2>
                  <p className="text-sm text-gray-500">{folder.artworks.length} artes</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditingFolder(folder)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded shadow"
                  >
                    Editar Título
                  </button>
                  <button
                    onClick={() => setEditingCoverFolder(folder)}
                    className="text-sm bg-blue-400 hover:bg-blue-500 text-white font-medium px-3 py-1 rounded shadow"
                  >
                    Editar Capa
                  </button>
                  <button
                    onClick={() => setDeletingFolder(folder)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded shadow"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {folder.artworks.map(art => (
                  <div
                    key={art.id}
                    className="relative group rounded overflow-hidden shadow-md"
                  >
                    {art.type === 'video' ? (
                      <video
                        src={art.source}
                        className="w-full h-32 object-cover rounded"
                        muted
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={art.source}
                        alt={art.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <button
                      onClick={() => setDeletingArt({ folderId: folder.id, artId: art.id })}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ❌
                    </button>
                    <button
                      onClick={() => setEditingArt({ folderId: folder.id, art })}
                      className="absolute bottom-2 right-2 bg-yellow-400 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition text-sm"
                    >
                      ✏️
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modais */}
        {editingCoverFolder && (
          <EditCoverModal
            folder={editingCoverFolder}
            onClose={() => setEditingCoverFolder(null)}
            onUploaded={() => setEditingCoverFolder(null)}
          />
        )}

        {editingFolder && (
          <EditFolderModal
            folder={editingFolder}
            onClose={() => setEditingFolder(null)}
            onSave={handleSaveTitle}
          />
        )}

        {deletingFolder && (
          <ConfirmModal
            title="Deletar Pasta?"
            message={`Tem certeza que deseja deletar a pasta "${deletingFolder.title}" amor?`}
            onCancel={() => setDeletingFolder(null)}
            onConfirm={confirmDeleteFolder}
          />
        )}

        {deletingArt && (
          <ConfirmModal
            title="Deletar Arte?"
            message="Tem certeza que deseja deletar, amor?"
            onCancel={() => setDeletingArt(null)}
            onConfirm={confirmDeleteArt}
          />
        )}

        {editingArt && (
          <EditArtModal
            folderId={editingArt.folderId}
            art={editingArt.art}
            onClose={() => setEditingArt(null)}
          />
        )}
        {confirmLogout && (
            <ConfirmModal
            title="Deseja mesmo sair?"
            message="Você está prestes a sair do painel administrativo, amorzinho. 😢"
            onCancel={() => setConfirmLogout(false)}
            onConfirm={async () => {
            await signOut(auth)
            navigate('/login')
        }}
    />
        )}
      </main>
    </div>
  )
}
