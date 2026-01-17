import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Calendar, StickyNote, Trash2 } from 'lucide-react'
import { storage } from '../utils/storage'
import { getImageUrl } from '../services/tmdb'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-blue-600' },
  { value: 'watching', label: 'Watching', color: 'bg-yellow-600' },
  { value: 'watched', label: 'Watched', color: 'bg-green-600' },
  { value: 'dropped', label: 'Dropped', color: 'bg-red-600' }
]

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dateAdded')

  useEffect(() => {
    loadWatchlist()
    
    const handleWatchlistUpdate = () => loadWatchlist()
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate)
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate)
  }, [])

  useEffect(() => {
    let filtered = [...watchlist]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(movie => movie.status === statusFilter)
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0)
        case 'personalRating':
          return (b.personalRating || 0) - (a.personalRating || 0)
        case 'releaseDate':
          return new Date(b.release_date) - new Date(a.release_date)
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded)
      }
    })
    
    setFilteredList(filtered)
  }, [watchlist, statusFilter, sortBy])

  const loadWatchlist = () => {
    setWatchlist(storage.getWatchlist())
  }

  const updateMovie = (movieId, updates) => {
    storage.updateWatchlistItem(movieId, updates)
    loadWatchlist()
    toast.success('Updated successfully')
  }

  const removeMovie = (movieId) => {
    storage.removeFromWatchlist(movieId)
    loadWatchlist()
    toast.success('Removed from watchlist')
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
        <p className="text-gray-400 mb-8">Your watchlist is empty. Start adding movies!</p>
        <Link to="/" className="btn-primary">
          Discover Movies
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Watchlist</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
        >
          <option value="dateAdded">Recently Added</option>
          <option value="title">Title</option>
          <option value="rating">TMDB Rating</option>
          <option value="personalRating">Personal Rating</option>
          <option value="releaseDate">Release Date</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredList.map(movie => (
          <div key={movie.id} className="card flex gap-4">
            <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
              <img
                src={getImageUrl(movie.poster_path, 'w200')}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x300/374151/9CA3AF?text=No+Image'
                }}
              />
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <Link to={`/movie/${movie.id}`}>
                  <h3 className="text-lg font-semibold hover:text-blue-400">
                    {movie.title}
                  </h3>
                </Link>
                <button
                  onClick={() => removeMovie(movie.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Added {new Date(movie.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select
                    value={movie.status}
                    onChange={(e) => updateMovie(movie.id, { status: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value} className="bg-gray-700">
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Personal Rating</label>
                  <select
                    value={movie.personalRating || ''}
                    onChange={(e) => updateMovie(movie.id, { 
                      personalRating: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" className="bg-gray-700">No Rating</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-gray-700">{i + 1}/10</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Notes
                </label>
                <textarea
                  placeholder="Add your thoughts about this movie..."
                  value={movie.notes || ''}
                  onChange={(e) => updateMovie(movie.id, { notes: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Watchlist