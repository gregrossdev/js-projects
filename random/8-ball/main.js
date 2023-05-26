const magic8Ball = {};
magic8Ball.listOfAnswers = ["No", "Yes", "I don't think so...", "Of course!", "Indubitably", "In your dreams."];

const ball = document.getElementById('8ball'); 
const questionButton = document.getElementById('questionButton'); 



const onReady = (callback) =>{
  if (document.readyState!='loading') callback();
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  else document.attachEvent('onreadystatechange', function() {
    if (document.readyState=='complete') callback();
  });
};

onReady(() => { 
  document.getElementById('answer').style.display = 'none';
  magic8Ball.askQuestion = () => {    
    const answer = document.getElementById('answer');
    const randomNumber = Math.random();
    const randomNumberForListOfAnswers = randomNumber * magic8Ball.listOfAnswers.length;
    const randomIndex = Math.floor(randomNumberForListOfAnswers);
    const response = magic8Ball.listOfAnswers[randomIndex];

    ball.src = "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/09/magic8ballAnswer.png"

    // $("#8ball").effect("shake");
    fadeIn(answer);
    answer.textContent = response; 
    
    console.log(randomNumberForListOfAnswers);
    console.log(answer);
    console.log(response); 
  };

  
  questionButton.addEventListener('click', effects); 
  // ** click handler **
  function effects() {
    answer.style.display = 'none';
    ball.src = "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/09/magic8ballQuestion.png"
    const question = prompt("ASK A YES/NO QUESTION!");
    console.log(question);
    setTimeout(() => {
      magic8Ball.askQuestion(question);
    }, 500);
  }

});


// ** FADE OUT FUNCTION **
function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) 
          el.style.display = "none";
        else 
          requestAnimationFrame(fade);
        
    })();
};

// ** FADE IN FUNCTION **
function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) >= 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

