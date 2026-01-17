const STORAGE_KEYS = {
  WATCHLIST: 'filmfolio_watchlist',
  COLLECTIONS: 'filmfolio_collections'
}

export const storage = {
  // Watchlist operations
  getWatchlist: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveWatchlist: (watchlist) => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist))
  },

  addToWatchlist: (movie) => {
    const watchlist = storage.getWatchlist()
    const movieData = {
      ...movie,
      status: 'plan_to_watch',
      personalRating: null,
      notes: '',
      dateAdded: new Date().toISOString()
    }
    
    const exists = watchlist.find(item => item.id === movie.id)
    if (!exists) {
      watchlist.push(movieData)
      storage.saveWatchlist(watchlist)
    }
    return movieData
  },

  removeFromWatchlist: (movieId) => {
    const watchlist = storage.getWatchlist()
    const filtered = watchlist.filter(item => item.id !== movieId)
    storage.saveWatchlist(filtered)
  },

  updateWatchlistItem: (movieId, updates) => {
    const watchlist = storage.getWatchlist()
    const index = watchlist.findIndex(item => item.id === movieId)
    if (index !== -1) {
      watchlist[index] = { ...watchlist[index], ...updates }
      storage.saveWatchlist(watchlist)
    }
  },

  isInWatchlist: (movieId) => {
    const watchlist = storage.getWatchlist()
    return watchlist.some(item => item.id === movieId)
  },

  // Collections operations
  getCollections: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveCollections: (collections) => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections))
  },

  createCollection: (name) => {
    const collections = storage.getCollections()
    const newCollection = {
      id: Date.now().toString(),
      name,
      movies: [],
      createdAt: new Date().toISOString()
    }
    collections.push(newCollection)
    storage.saveCollections(collections)
    return newCollection
  },

  deleteCollection: (collectionId) => {
    const collections = storage.getCollections()
    const filtered = collections.filter(col => col.id !== collectionId)
    storage.saveCollections(filtered)
  },

  addMovieToCollection: (collectionId, movie) => {
    const collections = storage.getCollections()
    const collection = collections.find(col => col.id === collectionId)
    if (collection && !collection.movies.find(m => m.id === movie.id)) {
      collection.movies.push(movie)
      storage.saveCollections(collections)
    }
  },

  removeMovieFromCollection: (collectionId, movieId) => {
    const collections = storage.getCollections()
    const collection = collections.find(col => col.id === collectionId)
    if (collection) {
      collection.movies = collection.movies.filter(m => m.id !== movieId)
      storage.saveCollections(collections)
    }
  }
}