import { useState } from 'react'
import axios from 'axios'

export default function ProfilePictureUploader({ currentPhoto, onUpload }) {
  const [preview, setPreview] = useState(currentPhoto || null)
  const [loading, setLoading] = useState(false)

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_PRESET

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    formData.append('folder', 'profile_pictures')

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      )

      const imageUrl = response.data.secure_url
      setPreview(imageUrl)
      onUpload(imageUrl)

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao enviar a imagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
        className="relative w-full h-full group cursor-pointer"
         onClick={() => {
      // Em mobile, permitir abrir seleção de arquivo ao tocar na foto
      document.getElementById('file-input-profile').click()
    }}
    >
      <img
        src={preview || '/img/default-profile.png'}
        className="w-full h-full object-cover rounded-full border shadow"
      />
      <label className="absolute bottom-2 right-20 bg-astralBlue text-white rounded-full p-2 cursor-pointer hover:bg-midnightBlue transition opacity-0 group-hover:opacity-100">
        ✏️
        <input
          id="file-input-profile"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
      
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
          <span className="text-white text-sm">Enviando...</span>
        </div>
      )}
    </div>
  )
}
