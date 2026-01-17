# FilmFolio - Movie Watchlist

A modern, portfolio-ready Movie Watchlist Web Application built with React and Tailwind CSS. Discover movies, manage your personal watchlist, create custom collections, and track your viewing statistics.

## 🎬 Features

- **Discover Movies**: Browse trending and popular movies with search functionality
- **Personal Watchlist**: Save movies with custom status, ratings, and notes
- **Collections**: Create custom movie lists for different themes
- **Statistics**: Track your viewing habits and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Modern dark UI with smooth animations
- **Local Storage**: All data persists locally without requiring authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd FilmFolio
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠 Tech Stack

- **Framework**: React 18 (JavaScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Data Source**: TMDB API
- **Storage**: LocalStorage

## 📱 Pages & Features

### 1. Discover (/)
- Browse trending and popular movies
- Search movies with live results
- Add movies to watchlist with one click
- Responsive movie grid layout

### 2. Watchlist (/watchlist)
- View all saved movies
- Update movie status (Plan to Watch, Watching, Watched, Dropped)
- Add personal ratings (1-10)
- Write personal notes
- Filter by status and sort by various criteria

### 3. Movie Details (/movie/:id)
- Detailed movie information
- Watch trailers (YouTube embed)
- View cast and crew
- See similar movies
- Add/remove from watchlist

### 4. Collections (/collections)
- Create custom movie collections
- Organize movies by themes
- Visual collection previews
- Easy collection management

### 5. Stats (/stats)
- Total movies and watch time
- Status breakdown with percentages
- Monthly and yearly activity
- Personal rating distribution
- Completion rates and quick facts

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme
- **Responsive**: Mobile-first design approach
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Skeleton screens while loading
- **Toast Notifications**: User feedback for actions
- **Empty States**: Friendly messages when no data exists

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── MovieCard.jsx   # Movie display card
│   ├── SearchBar.jsx   # Search functionality
│   └── LoadingSkeleton.jsx # Loading placeholders
├── pages/              # Route components
│   ├── Discover.jsx    # Home/discover page
│   ├── Watchlist.jsx   # Personal watchlist
│   ├── MovieDetails.jsx # Movie detail view
│   ├── Collections.jsx # Custom collections
│   └── Stats.jsx       # Statistics dashboard
├── services/           # External API services
│   └── tmdb.js        # TMDB API integration
├── utils/             # Utility functions
│   └── storage.js     # LocalStorage operations
├── App.jsx            # Main app component
├── main.jsx          # React entry point
└── index.css         # Global styles
```

## 🔧 Configuration

### TMDB API Key

The app uses a demo TMDB API key. For production use:

1. Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Replace the API key in `src/services/tmdb.js`:
   ```javascript
   const API_KEY = 'your_api_key_here'
   ```

### Customization

- **Colors**: Modify Tailwind config in `tailwind.config.js`
- **Styling**: Update component classes or add custom CSS
- **Features**: Extend functionality by adding new components/pages

## 🌟 Key Components

### MovieCard
Reusable component for displaying movie information with watchlist integration.

### SearchBar
Live search with debouncing and loading states.

### Storage Utility
Handles all LocalStorage operations for watchlist and collections.

### TMDB Service
API integration for fetching movie data, search, and details.

## 📱 Responsive Design

- **Mobile**: Optimized for touch interactions
- **Tablet**: Adaptive grid layouts
- **Desktop**: Full-featured experience

## 🎯 Portfolio Highlights

This project demonstrates:

- **React Fundamentals**: Components, hooks, state management
- **Modern JavaScript**: ES6+, async/await, destructuring
- **API Integration**: RESTful API consumption
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first CSS approach
- **User Experience**: Loading states, error handling, notifications
- **Code Organization**: Clean file structure and separation of concerns

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `npm run build` then deploy `dist` folder
- **Netlify**: Connect repository for automatic deployments
- **GitHub Pages**: Use `gh-pages` package for deployment

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

---

**FilmFolio** - Your personal movie companion 🎬