/**
 * Constructor function for the class Book
 * @constructor
 * @param {{movieId: integer, title: string, releaseDate: Date}} slots - Object creation slots.
 */
function Movie( slots) {
  this.movieId = slots.movieId;
  this.title = slots.title;
  this.releaseDate = slots.releaseDate;
}
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Movie.instances = {};  // initially an empty collection (a map)

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
// Convert record/row to object
Movie.convertRec2Obj = function (movieRec) {
  const movie = new Movie( movieRec);
  return movie;
};

// Load the movie table from Local Storage
Movie.retrieveAll = function () {
  var moviesString="";
  try {
    if (localStorage.getItem("movies")) {
      moviesString = localStorage.getItem("movies");
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    const movies = JSON.parse( moviesString);
    const keys = Object.keys( movies);
    console.log(`${keys.length} movies loaded.`);
    for (const key of keys) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};

//  Save all movie objects to Local Storage
Movie.saveAll = function () {
  var error = false;
  try {
    const moviesString = JSON.stringify( Movie.instances);
    localStorage.setItem("movies", moviesString);
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) {
    const nmrOfMovies = Object.keys( Movie.instances).length;
    console.log(`${nmrOfMovies} movies saved.`);
  }
};
//  Create a new movie row
Movie.add = function (slots) {
  const movie = new Movie( slots);
  // add movie to the Movie.instances collection
  Movie.instances[slots.movieId] = movie;
  console.log(`Movie ${slots.title} created!`);
};
//  Update an existing movie row
Movie.update = function (slots) {
  const movie = Movie.instances[slots.movieId]
  if (movie.title !== slots.title) movie.title = slots.title;
  if (movie.releaseDate !== slots.releaseDate) movie.releaseDate = slots.releaseDate;
  console.log(`Movie ${slots.title} modified!`);
};
//  Delete a movie row from persistent storage
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log(`Movie with Movie ID ${movieId} deleted`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no movie with Movie ID ${movieId} in the database!`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
//  Create and save test data
Movie.generateTestData = function () {
  Movie.instances["1"] = new Movie({movieId:1, title:"Pulp Fiction", releaseDate:"1994-05-12"});
  Movie.instances["2"] = new Movie({movieId:2, title:"Star Wars", releaseDate:"1977-05-25"});
  Movie.instances["3"] = new Movie({movieId:3, title:"Casablanca", releaseDate:"1943-01-23"});
  Movie.instances["4"] = new Movie({movieId:4, title:"The Godfather", releaseDate:"1972-03-15"});
  Movie.saveAll();
  alert("Test data is generated.")
};
//  Clear data
Movie.clearData = function () {
  if (confirm("Do you really want to delete all movie data?")) {
    Movie.instances = {};
    localStorage.setItem("movies", "{}");
  }
};
