import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Clock, Calendar, Plus, Check, Play, FolderPlus } from 'lucide-react'
import { tmdbApi, getImageUrl, getYouTubeUrl } from '../services/tmdb'
import { storage } from '../utils/storage'
import MovieCard from '../components/MovieCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import toast from 'react-hot-toast'

const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [collections, setCollections] = useState([])

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await tmdbApi.getMovieDetails(id)
        setMovie(data)
        setIsInWatchlist(storage.isInWatchlist(parseInt(id)))
        setCollections(storage.getCollections())
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      storage.removeFromWatchlist(parseInt(id))
      toast.success('Removed from watchlist')
    } else {
      storage.addToWatchlist(movie)
      toast.success('Added to watchlist')
    }
    setIsInWatchlist(!isInWatchlist)
  }

  const addToCollection = (collectionId) => {
    storage.addMovieToCollection(collectionId, movie)
    toast.success('Added to collection')
    setShowCollections(false)
  }

  const getTrailerKey = () => {
    if (!movie?.videos?.results) return null
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    )
    return trailer?.key
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex gap-8 mb-8">
          <div className="bg-gray-700 w-80 h-96 rounded-lg"></div>
          <div className="flex-1 space-y-4">
            <div className="bg-gray-700 h-8 rounded w-3/4"></div>
            <div className="bg-gray-700 h-4 rounded w-1/2"></div>
            <div className="bg-gray-700 h-20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Movie not found</p>
      </div>
    )
  }

  const trailerKey = getTrailerKey()

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12">
        <div className="w-full lg:w-80 flex-shrink-0">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image'
            }}
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
              <span className="text-sm">({movie.vote_count} votes)</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{movie.runtime} min</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres?.map(genre => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
          
          <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isInWatchlist
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isInWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            
            <button
              onClick={() => setShowCollections(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              <FolderPlus className="h-5 w-5" />
              Add to Collection
            </button>
            
            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                <Play className="h-5 w-5" />
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collections Modal */}
      {showCollections && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add to Collection</h3>
              <button
                onClick={() => setShowCollections(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {collections.length > 0 ? (
              <div className="space-y-2">
                {collections.map(collection => {
                  const isInCollection = collection.movies.some(m => m.id === movie.id)
                  return (
                    <button
                      key={collection.id}
                      onClick={() => !isInCollection && addToCollection(collection.id)}
                      disabled={isInCollection}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isInCollection 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-sm text-gray-400">
                        {collection.movies.length} movies
                        {isInCollection && ' • Already added'}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No collections yet</p>
                <button
                  onClick={() => {
                    setShowCollections(false)
                    // Navigate to collections page
                    window.location.href = '/collections'
                  }}
                  className="btn-primary"
                >
                  Create Collection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Trailer</h3>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={getYouTubeUrl(trailerKey)}
                className="w-full h-full rounded"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {movie.credits.cast.slice(0, 10).map(person => (
              <div key={person.id} className="flex-shrink-0 text-center">
                <img
                  src={getImageUrl(person.profile_path, 'w200')}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200/374151/9CA3AF?text=No+Image'
                  }}
                />
                <p className="text-sm font-medium">{person.name}</p>
                <p className="text-xs text-gray-400">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movie.similar.results.slice(0, 12).map(similarMovie => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MovieDetails