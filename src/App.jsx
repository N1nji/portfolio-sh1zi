import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Hero from './components/Hero.jsx';
import Gallery from './components/Gallery.jsx';
import Projetos from './components/Projetos.jsx';
import Header from './components/Header.jsx';
import GatoSplash from './components/GatoSplash.jsx';
import BugReportButton from './components/BugReportButton.jsx';
import Bio from './components/Bio.jsx';
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import PainelPastas from './pages/PainelPastas.jsx';
import StarsBackground from './components/StarsBackground.jsx';

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
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-midnightNavy via-midnightNavy to-midnightNavy">
            <GatoSplash />
            <StarsBackground />
            <Header />
            <main className="flex-grow overflow-x-hidden"> {/* padding pra compensar o header fixo */}
            <Hero />
            <Bio />
            <Gallery />
            <Projetos />
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