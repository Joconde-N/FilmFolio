import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { tmdbApi } from '../services/tmdb'

const SearchBar = ({ onResults, onClear }) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim().length < 2) {
        onClear()
        return
      }

      setIsLoading(true)
      try {
        const data = await tmdbApi.searchMovies(query)
        onResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
        onResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, onResults, onClear])

  const handleClear = () => {
    setQuery('')
    onClear()
  }

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input w-full pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 rounded-b-lg p-2 text-center text-sm text-gray-400">
          Searching...
        </div>
      )}
    </div>
  )
}

export default SearchBar