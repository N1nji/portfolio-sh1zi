// components/EditFolderModal.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EditFolderModal({ folder, onClose, onSave }) {
  const [newTitle, setNewTitle] = useState(folder.title)
  const [category, setCategory] = useState(folder.category || 'Artes')

  const handleSave = () => {
    if (newTitle.trim() !== '') {
      onSave(folder.id, {
        title: newTitle.trim(),
        category: category
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Editar título da pasta</h2>
        
        <input
          type="text"
          className="w-full border rounded p-2 mb-4"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="Mister Kitty">😸 Mister Kitty</option>
          <option value="Artes">🎨 Artes</option>
          <option value="Pixel Art">🟣 Pixel Art</option>
          <option value="Animações">🎞️ Animações</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  )
}
