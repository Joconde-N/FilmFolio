import { useState, useEffect } from 'react'
import { tmdbApi } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import LoadingSkeleton from '../components/LoadingSkeleton'

const Discover = () => {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getPopular()
        ])
        
        setTrendingMovies(trending.results || [])
        setPopularMovies(popular.results || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleSearchResults = (results) => {
    setSearchResults(results)
    setIsSearching(true)
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearching(false)
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Discover Movies</h1>
        <SearchBar onResults={handleSearchResults} onClear={handleClearSearch} />
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Discover Movies</h1>
      
      <SearchBar onResults={handleSearchResults} onClear={handleClearSearch} />

      {isSearching ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No movies found. Try a different search term.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Trending This Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {trendingMovies.slice(0, 12).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Popular Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {popularMovies.slice(0, 12).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Discover