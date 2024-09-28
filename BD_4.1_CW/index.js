let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  
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
  try{
  let results = await fetchAllMovies();

  if(results.movies.length === 0){
    return res.status(404).json({ message: "No Movies Found !" });
  }

  res.status(200).json(results);
  } catch (error){
    return res.status(500).json({ error: error.message });
  }
});

// Function to fetch movies by Genre
async function fetchMoviesByGenre(genre){
  let query = "SELECT * FROM movies WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { movies: response };
}

// Route to get movies by genre
app.get("/movies/genre/:genre", async (req, res)=>{
 try{ 
 let genre = req.params.genre;
 let results = await fetchMoviesByGenre(genre);
 
 if(results.movies.length === 0){
   return res.status(404).json({ message: "No movie of this genre found !" });
 }

res.status(200).json(results);
 } catch(error){
   return res.status(500).json({ error: error.message });
 }
});

// function to fetch movies by ID
async function fetchMoviesById(id){
  let query = "SELECT * FROM movies WHERE id = ?";
  let response = await db.get(query, [id]);
  return { movie: response };
}

// Route to fetch movie details by ID
app.get("/movies/details/:id", async (req, res)=>{
 try{ 
 let id = req.params.id;
 let results = await fetchMoviesById(id);

 if(results.movie === undefined){
   res.status(404).json({ message: "No movie found !" });
 }

 res.status(200).json(results);
 } catch(error){
   return res.status(500).json({ error: error.message });
 }
});

// function to fecth movie details by release year
async function fetchMoviesByReleaseYear(releaseYear){
  let query = "SELECT * FROM movies WHERE release_year = ?";
  let response = await db.all(query, [releaseYear]);
  return { movies: response };
}


// Route to fetch movie details by release year
app.get("/movies/release-year/:year", async (req, res)=>{
 try{ 
 let releaseYear = req.params.year;
 let results = await fetchMoviesByReleaseYear(releaseYear);

 if(results.movies.length === 0){
    return res.status(404).json({ message: "No movies found !" });
 }

 res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
