import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
        await signInWithEmailAndPassword(auth, email, password)
        navigate('/admin') // apos o login
    } catch (err) {
        setError('Já esqueceu o login vida?')
    }
}

return (
    <div className="min-h-screen bg-gradient-to-br from-midnightBlue via-deepNavy to-midnightBlue text-white flex justify-center items-center">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center text-midnightNavy">Login do Admin</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Senha"
            className="w-full mb-3 p-2 border rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-midnightNavy text-white px-4 py-2 rounded w-full">
                Entrar
            </button>
        </form>
    </div>
    )
}