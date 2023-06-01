/**
 * @fileOverview  The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2014-2015 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { isNonEmptyString, isIntegerOrIntegerString, cloneObject }
  from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation,
  RangeConstraintViolation, UniquenessConstraintViolation }
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

/**
 * Define two Enumerations
 */
const GenreEL = new Enumeration(["Action", "Animation", "Comedy", "Documentary", "Drama", "Family", "Film-Noir",
  "Horror", "Musical", "Romance", "Adventure", "Fantasy", "Sci-Fi", "Crime", "War"]);
const MovieRatingEL = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
  "PG13":"Not Under 13", "R":"Restricted", "NC17":"Not Under 17"});

/**
 * The class Movie
 * @class
 */
class Movie {
  // using a single record parameter with ES6 function parameter destructuring
  constructor ({movieId, title, rating, genres}) {
    // assign properties by invoking implicit setters
    this.movieId = movieId;
    this.title = title;
    this.rating = rating;
    this.genres = genres;
  }
  get movieId() {
    return this._movieId;
  }
  static checkMovieId( m) {
    if (!m) return new NoConstraintViolation();
    else if (!isIntegerOrIntegerString( m)) {
      return new RangeConstraintViolation("The value of movie ID must be an integer!");
    } else if (!isIntegerOrIntegerString( m) || parseInt( m) < 1) {
      return new RangeConstraintViolation(
          "The value of movie ID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkMovieIdAsId( m) {
    var validationResult = Movie.checkMovieId( m);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!m) {
        validationResult = new MandatoryValueConstraintViolation(
            "A value for the movie ID must be provided!");
      } else if (Movie.instances[m]) {
        validationResult = new UniquenessConstraintViolation(
            "There is already a movie record with this movie ID!");
      } else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  }
  set movieId( m) {
    const validationResult = Movie.checkMovieIdAsId( m);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieId = m;
    } else {
      throw validationResult;
    }
  }
  get title() {
    return this._title;
  }
  static checkTitle( t) {
    if (!t) {
      return new MandatoryValueConstraintViolation(
          "A title must be provided!");
    } else if (!isNonEmptyString( t)) {
      return new RangeConstraintViolation(
          "The title must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set title( t) {
    const validationResult = Movie.checkTitle( t);
    if (validationResult instanceof NoConstraintViolation) {
      this._title = t;
    } else {
      throw validationResult;
    }
  }
  get rating() {
    return this._rating;
  }
  static checkRating( r) {
    if (!r) {
      return new NoConstraintViolation();
    } else if (!isIntegerOrIntegerString(r) ||
        parseInt(r) < 1 || parseInt(r) > MovieRatingEL.MAX) {
      return new RangeConstraintViolation(
          `Invalid value for movie rating: ${r}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  set rating( r) {
    const validationResult = Movie.checkRating( r);
    if (validationResult instanceof NoConstraintViolation) {
      this._rating = parseInt( r);
    } else {
      throw validationResult;
    }
  }
  get genres() {
    return this._genres;
  }
  static checkGenre( g) {
    if (!g) {
      return new MandatoryValueConstraintViolation(
          "No genre provided!");
    } else if (!Number.isInteger( g) || g < 1 || g > GenreEL.MAX) {
      return new RangeConstraintViolation(`Invalid value for genre: ${g}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkGenres( genres) {
    if (!genres || Array.isArray( genres) && genres.length === 0) {
      return new MandatoryValueConstraintViolation(
          "No genre provided!");
    } else if (!Array.isArray( genres)) {
      return new RangeConstraintViolation(
          "The value of genres must be an array!");
    } else {
      for (const g of genres) {
        const validationResult = Movie.checkGenre( g);
        if (!(validationResult instanceof NoConstraintViolation)) {
          return validationResult;
        }
      }
      return new NoConstraintViolation();
    }
  }
  set genres( gs) {
    const validationResult = Movie.checkGenres( gs);
    if (validationResult instanceof NoConstraintViolation) {
      this._genres = gs;
    } else {
      throw validationResult;
    }
  }
  /*********************************************************
   ***  Other Instance-Level Methods  ***********************
   **********************************************************/
  toString() {
    return `Movie{ Movie ID: ${this.movieId}, title: ${this.title},
    rating: ${this.rating},
    genres: ${this.genres.toString()}}`;
  }
  toJSON() {  // is invoked by JSON.stringify
    const rec = {};
    for (let p of Object.keys( this)) {
      // copy only property slots with underscore prefix
      if (p.charAt(0) === "_") {
        // remove underscore prefix
        rec[p.substr(1)] = this[p];
      }
    }
    return rec;
  }
}
/**********************************************************
 ***  Class-level ("static") properties  ******************
 **********************************************************/
// initially an empty collection (in the form of a map)
Movie.instances = {};

/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new movie row
 */
Movie.add = function (slots) {
  var movie = null;
  try {
    movie = new Movie( slots);
  } catch (e) {
    console.log( `${e.constructor.name} : ${e.message}`);
    movie = null;
  }
  if (movie) {
    Movie.instances[movie.movieId] = movie;
    console.log( `${movie.toString()} created!`);
  }
};
/**
 *  Update an existing movie row
 */
Movie.update = function (slots) {
  var noConstraintViolated = true,
      updatedProperties = [];
  const movie = Movie.instances[slots.movieId],
      objectBeforeUpdate = cloneObject( movie);
  try {
    if (movie.title !== slots.title) {
      movie.title = slots.title;
      updatedProperties.push("title");
    }
    if (movie.rating !== slots.rating) {
      movie.rating = slots.rating;
      updatedProperties.push("rating");
    }
    if (!movie.genres.isEqualTo( slots.genres)) {
      movie.genres = slots.genres;
      updatedProperties.push("genres");
    }
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
    noConstraintViolated = false;
    // restore object to its state before updating
    Movie.instances[slots.movieId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log(`Properties ${updatedProperties.toString()} modified for movie ${slots.movieId}`);
    } else {
      console.log(`No property value changed for movie ${slots.movieId}!`);
    }
  }
};
/**
 *  Delete a movie
 */
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log(`${Movie.instances[movieId].toString()} deleted!`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no movie with Movie ID ${movieId} in the database!`);
  }
};
/**
 *  Convert row to object
 */
Movie.convertRec2Obj = function (movieRow) {
  var movie={};
  try {
    movie = new Movie( movieRow);
  } catch (e) {
    console.log(`${e.constructor.name} while deserializing a movie row: ${e.message}`);
  }
  return movie;
};
/**
 *  Load all movie table rows and convert them to objects
 */
Movie.retrieveAll = function () {
  var moviesString="";
  try {
    if (localStorage["movies"]) {
      moviesString = localStorage["movies"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    const movies = JSON.parse( moviesString);
    console.log(`${Object.keys(movies).length} movies loaded.`);
    for (let key of Object.keys( movies)) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
  var error=false;
  const nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    const moviesString = JSON.stringify( Movie.instances);
    localStorage["movies"] = moviesString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log(`${nmrOfMovies} movie records saved.`);
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
Movie.generateTestData = function () {
  try {
    Movie.instances[1] = new Movie({
      movieId: 1,
      title: "Pulp Fiction",
      rating: MovieRatingEL.R,
      genres: [GenreEL.CRIME, GenreEL.DRAMA]
    });
    Movie.instances[2] = new Movie({
      movieId: 2,
      title: "Star Wars",
      rating: MovieRatingEL.PG,
      genres: [GenreEL.ACTION, GenreEL.ADVENTURE, GenreEL.FANTASY, GenreEL.SCI_FI]
    });
    Movie.instances[3] = new Movie({
      movieId: 3,
      title: "Casablanca",
      rating: MovieRatingEL.PG,
      genres: [GenreEL.DRAMA, GenreEL.FILM_NOIR, GenreEL.ROMANCE, GenreEL.WAR]
    });
    Movie.instances[4] = new Movie({
      movieId: 4,
      title: "The Godfather",
      rating: MovieRatingEL.R,
      genres: [GenreEL.CRIME, GenreEL.DRAMA]
    });
    Movie.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear data
 */
Movie.clearData = function () {
  if (confirm( "Do you really want to delete all movie data?")) {
    try {
      Movie.instances = {};
      localStorage["movies"] = "{}";
      console.log( "All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
};

export default Movie;
export { GenreEL, MovieRatingEL };
