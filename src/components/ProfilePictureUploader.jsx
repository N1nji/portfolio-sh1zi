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

    // Preview imediato local (UX Improvement)
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
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
      setPreview(currentPhoto) // Volta a foto anterior em caso de erro
      alert('Erro ao enviar a imagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="relative w-full h-full group cursor-pointer overflow-hidden rounded-full border-2 border-buttercream/20 shadow-xl"
      onClick={() => document.getElementById('file-input-profile').click()}
    >
      {/* Imagem de Perfil */}
      <img
        src={preview || 'https://via.placeholder.com/200x200?text=Foto'}
        className={`w-full h-full object-cover transition-all duration-500 ${loading ? 'blur-sm scale-95' : 'group-hover:scale-110'}`}
        alt="Profile Preview"
      />

      {/* Overlay de Hover (Aparece ao passar o mouse ou se estiver carregando) */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        
        {loading ? (
          // Spinner de Carregamento Moderno
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-buttercream border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Subindo...</span>
          </div>
        ) : (
          // Ícone de Edição
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">📸</span>
            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Trocar Foto</span>
          </div>
        )}
      </div>

      {/* Input Escondido */}
      <input
        id="file-input-profile"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  )
}