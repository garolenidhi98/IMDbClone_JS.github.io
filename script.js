
// Get references to DOM elements
let searchBox = document.querySelector("#search-box")
let searchedMovieDisplay = document.querySelector("#searched-movie-display")
let favoriteMoviesDisplay = document.querySelector("#favorite-movie-list")

// Event listener to display favorite movies when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
  displayFavoriteMovieFromLocalStorage()
})

// Event listener for input in the search box
searchBox.addEventListener("input", fetchInputValue)

// Function to fetch movie details based on the search value
function fetchInputValue(e) {
  e.preventDefault()
  let searchedValue = searchBox.value
  console.log(searchedValue)
  fetchSearchedMovie(searchedValue)
}

// Function to fetch movie details from the API
function fetchSearchedMovie(searchedValue) {
  let searchedMovie = fetch(`https://www.omdbapi.com/?t=${searchedValue}&apikey=60af6e53`)
  searchedMovie.then((response) => {
    return response.json()
  }).then((value) => {
    if (value.Response == "False") {
      console.log('Movie Not found :(')
    }
    console.log(value)
    displayAllSearchedMovie(value)
  }).catch((error) => {
    console.log(error)
  });
}

// Function to display searched movie details
function displayAllSearchedMovie(value) {
  searchedMovieDisplay.innerHTML = ""
  let div = document.createElement('div')
  div.innerHTML = value.Response === "False" ? `<h1 style="color:blanchedalmond;">${"Movie not found"}</h1>` :
    `<div class="card" style="width: 18rem;">
    <img src="${value.Poster}" class="card-img-top" alt="${value.Title}">
    <div class="card-body">
      <h3 class="card-title" style="font-weight:600">${value.Title}</h3>
      <button class="btn btn-primary">Add to favourite</button>
      <button type="button" class="btn btn-success add-to-favorite" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${value.imdbID}"
      id="toggle-btn">
      Know more about this
    </button>
    <div class="modal fade" id="staticBackdrop-${value.imdbID}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content" style="background-color:black; color:white;">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color:white; font-weight:600;">${value.Title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="modal-body-img"><img src="${value.Poster}" class="recipe-video"></img></div>
            <div class="modal-small-headings">
              <ul id="movie-points">
                <li id="category-type" class="font-color">Type : ${value.Type}</li>
                <li id="rated" class="font-color">Rating : ${value.Rated}</li>
                <li id="country">Country : ${value.Country}</li>
                <li id="genre">Genre : ${value.Genre}</li>
                <li id="award">Award : ${value.Awards}</li>
              </ul>
            </div>
            <div class="modal-para">
              <p id="plot" class="font-color">Plot : 
              ${value.Plot}
              </p>
            </div>
            <div class="actors">Movie-Cast : ${value.Actors}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  </div>
    `

  searchedMovieDisplay.appendChild(div)

  // Add event listener to the "Add to Favorite" button for each searched movie
  const addToFavoriteButtons = searchedMovieDisplay.querySelectorAll('.btn-primary');
  addToFavoriteButtons.forEach((button) => {
    button.addEventListener('click', function () {
      addToFavorite(value);
    });
  });
}

// Function to add a movie to the favorite list
function addToFavorite(value) {
  let favorite = localStorage.getItem('favorite') ? JSON.parse(localStorage.getItem('favorite')) : [];

  // Check if the movie already exists in favorites
  let movieExists = false;
  favorite.forEach((obj) => {
    if (obj.imdbID === value.imdbID) {
      movieExists = true;
      return;
    }
  });

  // If the movie already exists, display an alert and return early
  if (movieExists) {
    alert("Favorite movie already exists");
    return;
  }

  // If the movie is new, add it to the favorites array
  favorite.push(value);

  // Save the updated favorites array to local storage
  localStorage.setItem('favorite', JSON.stringify(favorite));

  displayFavoriteMovieFromLocalStorage();
}

// Function to display favorite movies from local storage
function displayFavoriteMovieFromLocalStorage() {
  favoriteMoviesDisplay.innerHTML = ""
  let favorite = JSON.parse(localStorage.getItem('favorite'));
  if (favorite) {
    favorite.map((obj) => {
      let li = document.createElement('li');
      li.innerHTML = `<div class="card" style="width: 18rem;">
      <img src="${obj.Poster}" class="card-img-top" alt="${obj.Title}">
      <div class="card-body">
        <h5 class="card-title">${obj.Title}</h5>
        <button class="btn btn-danger" data-imdbid="${obj.imdbID}">Remove from favourite</button>
        <button type="button" class="btn btn-success add-to-favorite" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${obj.imdbID}"
        id="toggle-btn">
        Know more about this
      </button>
      <div class="modal fade" id="staticBackdrop-${obj.imdbID}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color: black;">${obj.Title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="modal-body-img"><img src="${obj.Poster}" class="recipe-video"></img></div>
            <div class="modal-small-headings">
              <ul id="movie-points">
                <li id="category-type" class="font-color">${obj.Type}</li>
                <li id="rated" class="font-color">${obj.Rated}</li>
                <li id="country">${obj.Country}</li>
                <li id="genre">${obj.Genre}</li>
                <li id="award">${obj.Awards}</li>
              </ul>
            </div>
            <div class="modal-para">
              <p id="plot" class="font-color">
              ${obj.Plot}
              </p>
            </div>
            <div class="actors">${obj.Actors}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
      `
      favoriteMoviesDisplay.append(li)
    })

  }else{
    favoriteMoviesDisplay.innerHTML = "<h2>You have no favorite movie :(</h2>"
  }

  // Add event listener to the "Remove from Favorite" button for each favorite movie
  const removeFromFavoriteButtons = favoriteMoviesDisplay.querySelectorAll('.btn-danger');
  removeFromFavoriteButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const imdbID = button.dataset.imdbid;
      console.log(imdbID);
      removeFromFavorite(imdbID);
      console.log('Remove from favorite button clicked! with id ' + imdbID);
    });
  });
}


// Function to remove a movie from the favorite list
function removeFromFavorite(id) {
  const favorite = JSON.parse(localStorage.getItem("favorite"));
  const index = favorite.findIndex((obj) => obj.imdbID === id); // Find index based on id
  if (index !== -1) {
    favorite.splice(index, 1); // Remove item at index
    localStorage.setItem("favorite", JSON.stringify(favorite));
    // Refresh the favorite movies display
    displayFavoriteMovieFromLocalStorage();
  }
}