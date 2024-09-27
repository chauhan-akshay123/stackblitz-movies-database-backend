let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Use the CORS middleware properly
app.use(express.json());

let db;

// Initialize SQLite database connection
(async () => {
  db = await open({
    filename: "./BD_4.1_CW/database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// Function to fetch all movies
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let response = await db.all(query, []);
  return { movies: response };
}

// Route to get all movies
app.get("/movies", async (req, res) => {
  let results = await fetchAllMovies();
  res.status(200).json(results);
});

// Function to fetch movies by Genre
async function fetchMoviesByGenre(genre){
  let query = "SELECT * FROM movies WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { movies: response };
}

// Route to get movies by genre
app.get("/movies/genre/:genre", async (req, res)=>{
 let genre = req.params.genre;
 let results = await fetchMoviesByGenre(genre);

 res.status(200).json(results);
});

// function to fetch movies by ID
async function fetchMoviesById(id){
  let query = "SELECT * FROM movies WHERE id = ?";
  let response = await db.get(query, [id]);
  return { movies: response };
}

// Route to fetch movie details by ID
app.get("/movies/details/:id", async (req, res)=>{
 let id = req.params.id;
 let results = await fetchMoviesById(id);

 res.status(200).json(results);
});

// function to fecth movie details by release year
async function fetchMoviesByReleaseYear(releaseYear){
  let query = "SELECT * FROM movies WHERE release_year = ?";
  let response = await db.all(query, [releaseYear]);
  return { movies: response };
}


// Route to fetch movie details by release year
app.get("/movies/release-year/:year", async (req, res)=>{
 let releaseYear = req.params.year;
 let results = await fetchMoviesByReleaseYear(releaseYear);

 res.status(200).json(results);
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
