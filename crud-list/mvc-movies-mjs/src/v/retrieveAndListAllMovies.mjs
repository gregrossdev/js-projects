import Movie from "../m/Movie.mjs";

const tableBodyEl = document.querySelector("table#movies>tbody");
// retrieve all movie records
Movie.retrieveAll();
// list all movie records
for (const key of Object.keys(Movie.instances)) {
    const movie = Movie.instances[key];
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = movie.movieId;
    row.insertCell().textContent = movie.title;
    row.insertCell().textContent = movie.releaseDate ? movie.releaseDate.toISOString().split('T')[0] : "";
}
