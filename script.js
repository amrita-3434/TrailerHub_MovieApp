// Check if intro screen has already been shown
const hasIntroShown = sessionStorage.getItem('introShown');

if (!hasIntroShown) {
  // Show intro screen
  introScreen.classList.remove('hidden');

  // Hide intro screen after 4 seconds
  setTimeout(() => {
    introScreen.classList.add('hidden');
    sessionStorage.setItem('introShown', 'true'); // Mark as shown
  }, 4000); // 4000ms = 4 seconds
} else {
  // Directly hide the intro screen if it was already shown
  introScreen.classList.add('hidden');
} 

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const trailerModal = document.getElementById('trailerModal');
const trailerIframe = document.getElementById('trailerIframe');

                                                    // API URLs for Bollywood & Hollywood movies
const BOLLYWOOD_API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_original_language=hi&api_key=${API_KEY}&page=1`;
const HOLLYWOOD_API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_original_language=en&api_key=${API_KEY}&page=1`;


                                                      // Fetch and display movies
const getMovies = async (url) => {
  const res = await fetch(url);
  const { results } = await res.json();
  return results; // Return movies instead of directly displaying
};

                                              // Fetch Bollywood and Hollywood movies together
const fetchAndDisplayMovies = async () => {
  // Fetch both Bollywood and Hollywood movies
  const bollywoodMovies = await getMovies(BOLLYWOOD_API_URL);
  const hollywoodMovies = await getMovies(HOLLYWOOD_API_URL);

                                              // Combine both movie arrays
  const allMovies = [...bollywoodMovies, ...hollywoodMovies];

                                              // Display all movies
  displayMovies(allMovies);
};

                                                  // Display movies in the DOM
const displayMovies = (movies) => {
  main.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie">
        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
        <div class="movie-info">
          <h3>${movie.release_date || 'N/A'}</h3>
          <span class="${getRatingClass(movie.vote_average)}">${movie.vote_average}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${movie.overview || 'No description available.'}
          <button onclick="showTrailer(${movie.id})">Watch Trailer</button>
        </div>
      </div>
    `
    )
    .join('');
};
                                              //get trailer link

const getTrailerLink = async (movieId) => {
  try {
    console.log("Fetching trailer for movie ID:", movieId);
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
    const { results } = await res.json();
    console.log("Trailer results:", results);
    const trailer = results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    console.log("Trailer found:", trailer);
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  } catch (error) {
    console.error("Error fetching trailer link:", error);
    return null;
  }
};
                                            //show trailer model 
const showTrailer = async (movieId) => {
  const trailerUrl = await getTrailerLink(movieId);
  if (trailerUrl) {
    trailerIframe.src = trailerUrl;
    trailerModal.classList.add('visible');
    console.log("Trailer modal shown with URL:", trailerUrl);
  } else {
    alert('Trailer not available.');
  }
};

                                      // Close trailer modal
const closeTrailer = () => {
  console.log("closing trailer model");
  trailerIframe.src = ''; // Clear the iframe source
  trailerModal.classList.remove('visible');
};


                                               // Get rating class for color
const getRatingClass = (rating) =>
  rating >= 8 ? 'green' : rating >= 5 ? 'orange' : 'red';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm) {
    const searchResults = await getMovies(SEARCH_API + searchTerm);
    if (searchResults.length > 0) {
      displayMovies(searchResults); // Display search results
    } else {
      main.innerHTML = '<p>No movies found. Please try a different search term.</p>';
    }
    search.value = ''; // Clear the search input
  }
});

                       // Initialize home page with both Bollywood and Hollywood movies
fetchAndDisplayMovies();