import { useState } from 'react'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '../firebase'

export default function EditArtModal({ folderId, art, onClose }) {
  const [title, setTitle] = useState(art.title || '')
  const [description, setDescription] = useState(art.description || '')
  const [file, setFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    let newSource = art.source
    let type = art.type

    try {
      if (file) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_NAME
        const preset = import.meta.env.VITE_CLOUDINARY_PRESET

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", preset)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: formData
        })

        const data = await res.json()
        if (!data.secure_url) throw new Error("Erro ao fazer upload no Cloudinary")

        newSource = data.secure_url
        type = file.type.startsWith('video') ? 'video' : 'image'
      }

      await update(dbRef(db, `folders/${folderId}/artworks/${art.id}`), {
        title,
        description,
        source: newSource,
        type
      })

      onClose()
    } catch (error) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-bold">Editar Arte</h2>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descrição"
          className="w-full border p-2 rounded resize-none h-24"
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={e => setFile(e.target.files[0])}
        />

        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Pré-visualização:</p>
          {file ? (
            file.type.startsWith('video') ? (
              <video src={URL.createObjectURL(file)} className="w-full h-40 rounded" muted autoPlay loop />
            ) : (
              <img src={URL.createObjectURL(file)} className="w-full h-40 object-cover rounded" />
            )
          ) : (
            art.type === 'video' ? (
              <video src={art.source} className="w-full h-40 rounded" muted autoPlay loop />
            ) : (
              <img src={art.source} className="w-full h-40 object-cover rounded" />
            )
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >{isSaving ? "Salvando..." : "Salvar"}</button>
        </div>
      </div>
    </div>
  )
}
