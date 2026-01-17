import { useState, useEffect } from 'react'
import { BarChart3, Clock, Star, Calendar, TrendingUp } from 'lucide-react'
import { storage } from '../utils/storage'

const Stats = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    totalRuntime: 0,
    averageRating: 0,
    topGenres: [],
    thisMonth: 0,
    thisYear: 0
  })

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = () => {
    const watchlist = storage.getWatchlist()
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    // Basic counts
    const total = watchlist.length
    const byStatus = watchlist.reduce((acc, movie) => {
      acc[movie.status] = (acc[movie.status] || 0) + 1
      return acc
    }, {})

    // Runtime calculation (estimated for watched movies)
    const watchedMovies = watchlist.filter(m => m.status === 'watched')
    const totalRuntime = watchedMovies.length * 120 // Assume 2 hours average

    // Average personal rating
    const ratedMovies = watchlist.filter(m => m.personalRating)
    const averageRating = ratedMovies.length > 0 
      ? ratedMovies.reduce((sum, m) => sum + m.personalRating, 0) / ratedMovies.length
      : 0

    // Movies added this month/year
    const thisMonthCount = watchlist.filter(movie => {
      const addedDate = new Date(movie.dateAdded)
      return addedDate.getMonth() === thisMonth && addedDate.getFullYear() === thisYear
    }).length

    const thisYearCount = watchlist.filter(movie => {
      const addedDate = new Date(movie.dateAdded)
      return addedDate.getFullYear() === thisYear
    }).length

    // Top genres (simplified - would need genre data from API)
    const genreCount = {}
    watchlist.forEach(movie => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1
        })
      }
    })

    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ id, count, name: `Genre ${id}` }))

    setStats({
      total,
      byStatus,
      totalRuntime,
      averageRating,
      topGenres,
      thisMonth: thisMonthCount,
      thisYear: thisYearCount
    })
  }

  const statusLabels = {
    plan_to_watch: 'Plan to Watch',
    watching: 'Watching',
    watched: 'Watched',
    dropped: 'Dropped'
  }

  const statusColors = {
    plan_to_watch: 'bg-blue-600',
    watching: 'bg-yellow-600',
    watched: 'bg-green-600',
    dropped: 'bg-red-600'
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Stats</h1>

      {stats.total === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No data to show yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Add some movies to your watchlist to see statistics
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total}</div>
              <div className="text-gray-400">Total Movies</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stats.byStatus.watched || 0}
              </div>
              <div className="text-gray-400">Watched</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatTime(stats.totalRuntime)}
              </div>
              <div className="text-gray-400">Watch Time</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </div>
              <div className="text-gray-400">Avg Rating</div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Status Breakdown
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${statusColors[status]}`}></div>
                    <span>{statusLabels[status]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">
                      ({((count / stats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                This Month
              </h2>
              <div className="text-2xl font-bold text-blue-400">
                {stats.thisMonth} movies added
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Year
              </h2>
              <div className="text-2xl font-bold text-green-400">
                {stats.thisYear} movies added
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Movies per month (avg):</span>
                  <span>{(stats.thisYear / 12).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion rate:</span>
                  <span>
                    {stats.total > 0 
                      ? (((stats.byStatus.watched || 0) / stats.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currently watching:</span>
                  <span>{stats.byStatus.watching || 0}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Personal Ratings</h2>
              <div className="space-y-2 text-sm">
                {[10, 9, 8, 7, 6].map(rating => {
                  const count = storage.getWatchlist().filter(m => m.personalRating === rating).length
                  return (
                    <div key={rating} className="flex justify-between">
                      <span className="text-gray-400">{rating}/10:</span>
                      <span>{count} movies</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stats