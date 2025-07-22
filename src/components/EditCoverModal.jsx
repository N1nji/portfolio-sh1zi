// components/EditCoverModal.jsx
import { useState } from "react"
import { ref as dbRef, update } from "firebase/database"
import { db } from "../firebase"

export default function EditCoverModal({ folder, onClose, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
        const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
        const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
      setIsUploading(true)

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("upload_preset", preset) // 🔁 coloque o nome do seu preset aqui

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (!data.secure_url) throw new Error("Erro ao obter URL da imagem do Cloudinary")

      await update(dbRef(db, `folders/${folder.id}`), {
        cover: data.secure_url
      })

      setSelectedFile(null)
      if (onUploaded) onUploaded()
      onClose()
    } catch (error) {
      alert("Erro ao fazer upload: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edite sua nova capa aqui:</h2>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2 text-gray-600">Preview da nova capa:</p>
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : folder.cover}
            alt="Pré-visualização da capa"
            className="rounded-md object-cover w-full h-48 border"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-4"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isUploading ? "Enviando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}
