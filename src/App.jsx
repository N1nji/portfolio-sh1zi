import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Hero from './components/Hero.jsx';
import Gallery from './components/Gallery.jsx';
import Header from './components/Header.jsx';
import GatoSplash from './components/GatoSplash.jsx';
import BugReportButton from './components/BugReportButton.jsx';
import Bio from './components/Bio.jsx';
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import PainelPastas from './pages/PainelPastas.jsx';

import './styles/index.css'

function App() {
    return (
        <Router>
            <Routes>
                {/* Página de Login */}
                <Route path="/login" element={<Login />} />

                {/* Painel Admin */}
                <Route path="/admin" element={<Admin />} />

                {/* Painel das Pastas */}
                <Route path="/painel-pastas" element={<PainelPastas />} />

                <Route path="*" element={<p className="text-center text-black mt-10">Página não encontrada 💔</p>} />

                {/* Página principal do Portfólio */}
                <Route
                path="/"
                element={   
        <div className="flex flex-col min-h-screen">
            <GatoSplash />
            <Header />
            <main className="pt-10 flex-grow"> {/* padding pra compensar o header fixo */}
            <Hero />
            <Bio />
            <Gallery />
            <BugReportButton />
            </main>
            <Footer />
        </div>
        }
    />
    </Routes>
    </Router>
    )
}

export default App