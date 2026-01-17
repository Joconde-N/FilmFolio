import { useState, useEffect } from 'react'
import { Plus, FolderOpen, Trash2, Edit2 } from 'lucide-react'
import { storage } from '../utils/storage'
import MovieCard from '../components/MovieCard'
import toast from 'react-hot-toast'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = () => {
    setCollections(storage.getCollections())
  }

  const createCollection = () => {
    if (!newCollectionName.trim()) return
    
    storage.createCollection(newCollectionName.trim())
    setNewCollectionName('')
    setShowCreateModal(false)
    loadCollections()
    toast.success('Collection created')
  }

  const deleteCollection = (collectionId) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      storage.deleteCollection(collectionId)
      loadCollections()
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null)
      }
      toast.success('Collection deleted')
    }
  }

  if (selectedCollection) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Collections
            </button>
            <h1 className="text-3xl font-bold">{selectedCollection.name}</h1>
          </div>
          <button
            onClick={() => deleteCollection(selectedCollection.id)}
            className="text-red-400 hover:text-red-300 p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {selectedCollection.movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {selectedCollection.movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} showWatchlistButton={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">This collection is empty</p>
            <p className="text-sm text-gray-500 mt-2">
              Add movies from the movie details page
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Collections</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Collection
        </button>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="card cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedCollection(collection)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">{collection.name}</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCollection(collection.id)
                  }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-gray-400 mb-4">
                {collection.movies.length} movie{collection.movies.length !== 1 ? 's' : ''}
              </p>
              
              {collection.movies.length > 0 && (
                <div className="flex -space-x-2">
                  {collection.movies.slice(0, 4).map((movie, index) => (
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded border-2 border-gray-800"
                      style={{ zIndex: 4 - index }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/92x138/374151/9CA3AF?text=No+Image'
                      }}
                    />
                  ))}
                  {collection.movies.length > 4 && (
                    <div className="w-12 h-16 bg-gray-700 rounded border-2 border-gray-800 flex items-center justify-center text-xs">
                      +{collection.movies.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No collections yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Collection
          </button>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="input w-full mb-4"
              onKeyPress={(e) => e.key === 'Enter' && createCollection()}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewCollectionName('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                className="btn-primary"
                disabled={!newCollectionName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Collections