const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");


// SEARCH MOVIES
async function findMovies() {

    let searchTerm = movieSearchBox.value.trim();

    if (searchTerm.length === 0) {
        searchList.classList.add("hide-search-list");
        return;
    }

    const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=fc1fef96`;

    const response = await fetch(url);

    const data = await response.json();

    if (data.Response === "True") {

        displayMovieList(data.Search);

    }
}


// DISPLAY SEARCH LIST
function displayMovieList(movies) {

    searchList.innerHTML = "";

    searchList.classList.remove("hide-search-list");

    movies.forEach(movie => {

        const movieListItem = document.createElement("div");

        movieListItem.classList.add("search-list-item");

        movieListItem.dataset.id = movie.imdbID;

        let moviePoster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "image_not_found.png";

        movieListItem.innerHTML = `
        
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>

            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        searchList.appendChild(movieListItem);


        // CLICK MOVIE
        movieListItem.addEventListener("click", async () => {

            // CLEAR SEARCH INPUT
            movieSearchBox.value = "";

            // HIDE SEARCH LIST
            searchList.classList.add("hide-search-list");

            // FETCH MOVIE DETAILS
            const result = await fetch(
                `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=fc1fef96`
            );

            const movieDetails = await result.json();

            displayMovieDetails(movieDetails);

        });

    });

}


// DISPLAY MOVIE DETAILS
function displayMovieDetails(details) {

    resultGrid.innerHTML = `

        <div class="movie-poster">
            <img src="${details.Poster}">
        </div>

        <div class="movie-info">

            <h3 class="movie-title">${details.Title}</h3>

            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Rated: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>

            <p class="genre">
                <b>Genre:</b> ${details.Genre}
            </p>

            <p class="writer">
                <b>Writer:</b> ${details.Writer}
            </p>

            <p class="actors">
                <b>Actors:</b> ${details.Actors}
            </p>

            <p class="plot">
                <b>Plot:</b> ${details.Plot}
            </p>

            <p class="language">
                <b>Language:</b> ${details.Language}
            </p>

            <p class="award">
                <b><i class="fa-solid fa-award"></i></b>
                ${details.Awards}
            </p>
               <button class="favorite-btn" onclick='addToFavorite(${JSON.stringify(details)})'>
    Add To Favorite
</button>
        </div>
    `;
}



// HIDE WHEN CLICKING OUTSIDE
window.addEventListener("click", (e) => {

    if (e.target.id !== "movie-search-box") {

        searchList.classList.add("hide-search-list");

    }

})




const defaultMoviesContainer = document.getElementById("default-movies");

const popularMovies = [
    "Avatar",
    "Avengers",
    "Batman",
    "Titanic",
    "Interstellar",
    "Joker",
    "Gladiator",
    "Inception"
];

async function loadPopularMovies() {

    defaultMoviesContainer.innerHTML = "";

    for (let movieName of popularMovies) {

        const response = await fetch(
            `https://www.omdbapi.com/?t=${movieName}&apikey=fc1fef96`
        );

        const movie = await response.json();

        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `

            <img src="${movie.Poster}" alt="${movie.Title}">

            <div class="movie-card-content">

                <h3>${movie.Title}</h3>

                <p>${movie.Year}</p>

                <button onclick="showMovie('${movie.imdbID}')">
                    View Details
                </button>

            </div>
        `;

        defaultMoviesContainer.appendChild(movieCard);
    }
}

async function showMovie(id) {

    const response = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=fc1fef96`
    );

    const details = await response.json();

    displayMovieDetails(details);

    resultGrid.scrollIntoView({
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", loadPopularMovies);



const favoriteMovies = document.getElementById("favorite-movies");

let favorites = [];

// ADD FAVORITE
function addToFavorite(movie){

    const exist = favorites.find(
        item => item.imdbID === movie.imdbID
    );

    if(exist) return;

    favorites.push(movie);

    displayFavorites();
}

// DISPLAY FAVORITES
function displayFavorites(){

    favoriteMovies.innerHTML = "";

    favorites.forEach(movie => {

        favoriteMovies.innerHTML += `

        <div class="movie-card">

            <img src="${movie.Poster}">

            <div class="movie-card-content">

                <h3>${movie.Title}</h3>

                <p>${movie.Year}</p>

                <button onclick="removeFavorite('${movie.imdbID}')">
                    Remove
                </button>

            </div>

        </div>
        `;
    });
}

// REMOVE FAVORITE
function removeFavorite(id){

    favorites = favorites.filter(
        movie => movie.imdbID !== id
    );

    displayFavorites();
}
