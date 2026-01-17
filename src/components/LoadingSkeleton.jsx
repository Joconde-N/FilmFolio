const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700 h-64 rounded-lg mb-3"></div>
          <div className="bg-gray-700 h-4 rounded mb-2"></div>
          <div className="bg-gray-700 h-3 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton