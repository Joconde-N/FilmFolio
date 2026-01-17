import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Discover from './pages/Discover'
import Watchlist from './pages/Watchlist'
import MovieDetails from './pages/MovieDetails'
import Collections from './pages/Collections'
import Stats from './pages/Stats'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#374151',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App