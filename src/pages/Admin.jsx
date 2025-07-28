import { FaSignOutAlt, FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { auth, db, } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { ref, push, set, update } from 'firebase/database'
import { useRef } from 'react'
import ConfirmModal from '../components/ConfirmModal'

export default function Admin() {
    const [confirmLogout, setConfirmLogout] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'image',
        category: 'Mister Kitty',
        file: null,
        folderTitle: '',
        cover: null
    })
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [ previewArt, setPreviewArt ] = useState(null)
    const [ previewCover, setPreviewCover ] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0);

    
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
            if (currentUser?.email !== adminEmail) {
                navigate('/')
            } else {
                setUser(currentUser)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        const confirm = window.confirm("Deseja mesmo sair?")
        if(!confirm) return

        await signOut(auth)
        navigate('/login')
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if ( name === 'file' && files[0]) {
            setForm(prev => ({ ...prev, file: files[0] }))
            const reader = new FileReader()
            reader.onload = () => setPreviewArt(reader.result)
            reader.readAsDataURL(files[0])
        } else if (name === 'cover' && files[0]) {
            setForm(prev => ({ ...prev, cover: files[0] }))
            const reader = new FileReader()
            reader.onload = () => setPreviewCover(reader.result)
            reader.readAsDataURL(files[0])
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }
  
    const uploadWithProgress = (formData, mediaType) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

            xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`);
            
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percent= Math.round((e.loaded * 100) / e.total);
                    setUploadProgress(percent);
                }
            });

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error("Erro ao fazer upload para Cloudinary"));
                }
            };

            xhr.onerror = () => reject(new Error("Erro de rede no upload"));
            xhr.send(formData);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)

        if (!form.file) {
            alert("Selecione um arquivo amorzinho.")
            setUploading(false)
            return
        }

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
            const preset = import.meta.env.VITE_CLOUDINARY_PRESET;

        //Upload da arte
        const artData = new FormData();
        artData.append("file", form.file);
        artData.append("upload_preset", preset);
        artData.append("folder", form.category);

        const mediaType = form.type === "video" ? "video" : "image"
        const data = await uploadWithProgress(artData, mediaType);
        console.log("Cloudinary response:", data)
        const fileURL = data.secure_url;

        if (!fileURL) throw new Error("Cloudinary não retornou a URL.");
        

        // Upload da capa se fornecida
        let coverURL = null
        if (form.cover) {
            const coverData = new FormData();
            coverData.append("file", form.cover);
            coverData.append("upload_preset", preset);
            coverData.append("folder", form.category);

            const resCover = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: coverData
        })
        const coverJson = await resCover.json()
        coverURL = coverJson.secure_url 
    }

    // Atualiza dados da pasta no Firebase
        const folderRef = ref(db, `folders/${form.category}`)
        await update(folderRef, {
            title: form.folderTitle || form.category,
            cover: coverURL || fileURL,
            category: form.category
        })
            console.log("Cloudinary response:", data); 

            const newArtworkRef = push(ref(db, `folders/${form.category}/artworks`))

            const artworkData = {
                id: newArtworkRef.key,
                title: form.title,
                description: form.description,
                type: form.type,
                source: fileURL
            }

            await set(newArtworkRef, artworkData)

            setSuccess(true)
            setForm({
                title: '',
                description: '',
                type: 'image',
                category: 'Mister Kitty',
                file: null,
                folderTitle: '',
                cover: null
            })
            fileInputRef.current.value = null
        } catch (err) {
            console.log("Erro ao fazer upload:", err.message || err);
            alert("Erro ao enviar arte. Veja o console.")
            console.log("Erro ao fazer upload:", err.message || err);
        } finally {
            setUploading(false)
            setTimeout(() => setSuccess(false), 4000)
            setUploadProgress(0);
        }
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-midnightBlue via-dustyBlue to-midnightNavy text-white">

        {/* Sidebar */}
        <aside 
        className={`fixed md:static top-0 left-0 h-full md:h-screen z-50 w-64 bg-black bg-opacity-30 p-6 flex flex-col justify-between shadow-lg transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
            <div>
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <p className="text-sm mb-2">Bem-Vindo,</p>
                <p className="text-sm font-semibold break-words">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-4 mt-10">
                <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-white text-midnightNavy px-3 py-2 rounded hover:bg-gray-200 transition"
            >
                <FaArrowLeft /> Voltar pro site
            </button>
            <button
                onClick={() => navigate('/painel-pastas')}
                className="flex items-center gap-2 bg-blue-500 text-midnightNavy px-3 py-2 rounded hover:bg-blue-700 transition"
            >
                <FaArrowRight /> Ir para Painel-Pastas
            </button>
            <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
        >
            <FaSignOutAlt /> Sair
        </button>
    </div>
</aside>

        {/* Botão de abrir menu - só no mobile */}
        <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden absolute top-4 left-4 z-50 bg-white text-midnightNavy px-3 py-2 rounded shadow-lg"
        >
            ☰
        </button>
        {/* Conteúdo principal */}
        <main className="flex-1 p-6 md:p-10">
            <h1 className="text-2xl font-cursive font-bold mb-6">🎨 Adicionar nova arte</h1>

        <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-xl max-w-3xl w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
            type="text"
            name="title"
            placeholder="Título da arte"
            className="p-3 border rounded bg-white text-black"
            value={form.title}
            onChange={handleChange}
            required
        />

            <input
            type="text"
            name="folderTitle"
            placeholder="Título da pasta (opcional)"
            value={form.folderTitle}
            onChange={handleChange}
            className="p-3 border rounded bg-white text-black"
        />
        </div>
        
        <textarea
        name="description"
        placeholder="Descrição da arte"
        className="p-3 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
        value={form.description}
        onChange={handleChange}
       />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <select
       name="type"
       value={form.type}
       onChange={handleChange}
       className="p-3 border rounded bg-white text-black"
    >
        <option value="image">Imagem</option>
        <option value="video">Vídeo</option>
    </select>
    

        <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="p-3 border rounded bg-white text-black"
    >
        <option value="Mister Kitty">Mister Kitty</option>
        <option value="Artes">Artes</option>
        <option value="Pixel Art">Pixel Art</option>
        <option value="Animações">Animações</option>
    </select>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold mb-1">Imagem/Vídeo:</label>
            <div className="relative">
                <input
                type="file"
                name="file"
                accept="image/*,video/*"
                onChange={handleChange}
                ref={fileInputRef}
                required
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="bg-indigo-700 text-white px-4 py-2 rounded text-center cursor-pointer z-0">
                 📁 Selecionar Arquivo
                 </div>
                </div>
                {previewArt && (
                    form.type ==="image" ? (
                        <img src={previewArt} alt="Prévia" className="mt-2 h-32 object-cover rounded border" />
                    ) : (
                        <video src={previewArt} className="mt-2 h-32 rounded border" controls />
                    )
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">Capa (opcional):</label>
                <div className="relative">
                <input
                type="file"
                name="cover"
                accept="image/*,video/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="bg-indigo-700 text-white px-4 py-2 rounded text-center cursor-pointer z-0">
                📁 Selecionar Arquivo
            </div>
        </div>
            {previewCover && (
                <img src={previewCover} alt="Prévia da capa" className="mt-2 h-32 object-cover rounded border" />
            )}
            </div>
        </div>

        <button
        type="submit"
        disabled={uploading}
        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-3 rounded flex items-center justify-center gap-2 transition"
    >
        <FaPlus />
        {uploading ? "Enviando, linda..." : "Adicione aqui sua obra-prima!"}
        </button>

        {uploading && (
        <>
          <div className="w-full bg-gray-300 rounded overflow-hidden h-4 mt-2">
            <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
            />
            </div>
            <p className="text-center text-sm text-indigo-800 mt-1">
                Enviando, linda... {uploadProgress}%
                </p>
                </>
        )}

        {success && (
            <p className="text-green-800 mt-2 text-sm animate-pulse text-center">
                Obra-prima adicionada com sucesso!
            </p>
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
        </form>
     </main>
    </div>
    )
}