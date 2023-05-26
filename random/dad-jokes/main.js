
const jokeText = document.querySelector('.joke-text');
const newJokeBtn = document.querySelector('.joke-btn');
const tweetBtn = document.querySelector('.tweet-btn');

function getJoke() {
  fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    const joke = data.joke;
    jokeText.innerText = joke;
    const tweetLink = `https://twitter.com/share?text=${joke}`;
    tweetBtn.setAttribute('href', tweetLink);
  })
  .catch(error => {
    jokeText.innerText = 'ruh roh raggy';
    tweetBtn.removeAttribute('href');
    console.log(error);
  });
}



getJoke();

newJokeBtn.addEventListener('click', getJoke);
