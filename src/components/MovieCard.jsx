import { Link } from 'react-router-dom'
import { Star, Plus, Check } from 'lucide-react'
import { getImageUrl } from '../services/tmdb'
import { storage } from '../utils/storage'
import toast from 'react-hot-toast'

const MovieCard = ({ movie, showWatchlistButton = true }) => {
  const isInWatchlist = storage.isInWatchlist(movie.id)

  const handleAddToWatchlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWatchlist) {
      storage.removeFromWatchlist(movie.id)
      toast.success('Removed from watchlist')
    } else {
      storage.addToWatchlist(movie)
      toast.success('Added to watchlist')
    }
    
    // Force re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('watchlistUpdated'))
  }

  return (
    <div className="card group hover:scale-105 transition-transform duration-200">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image'
            }}
          />
          {showWatchlistButton && (
            <button
              onClick={handleAddToWatchlist}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isInWatchlist
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-black/50 hover:bg-black/70'
              }`}
            >
              {isInWatchlist ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-2">{movie.title}</h3>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard