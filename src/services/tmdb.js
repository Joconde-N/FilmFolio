const API_KEY = '4e44d9029b1270a757cddc766a1bcb63' // Demo key - replace with your own
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const tmdbApi = {
  // Get trending movies
  getTrending: async () => {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
    return response.json()
  },

  // Get popular movies
  getPopular: async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    return response.json()
  },

  // Search movies
  searchMovies: async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    return response.json()
  },

  // Get movie details
  getMovieDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`)
    return response.json()
  },

  // Get genres
  getGenres: async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    return response.json()
  },

  // Discover movies with filters
  discoverMovies: async (filters = {}) => {
    const params = new URLSearchParams({
      api_key: API_KEY,
      ...filters
    })
    const response = await fetch(`${BASE_URL}/discover/movie?${params}`)
    return response.json()
  }
}

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getYouTubeUrl = (key) => {
  return `https://www.youtube.com/embed/${key}`
}