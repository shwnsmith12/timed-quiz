// Elements for Initial Question Count and the Timer/Time Remaining
var questionCount = 0;
let timeRemaining = 60;
// These should return the value for elements of the timer, the scores, the buttons, etc.
let timer = document.getElementById("timer");
let scoresDiv = document.getElementById("scores-div");
let buttonsDiv = document.getElementById("buttons")
let questionDiv = document.getElementById("question-div");
let viewScoresBtn = document.getElementById("view-scores")
// Start Button that starts the test/timer when clicked
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);
let results = document.getElementById("results");
let choices = document.getElementById("choices");
// Arrays for storing scores locally
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));
let emptyArray = [];
let score = 0

/* Function for setting the timer, and stating it will remove time
at a rate of 1000 ms per tick or 1 second per second.
*/
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    timeRemaining--;
    timer.textContent = "";
    timer.textContent = "Time: " + timeRemaining;
    if (timeRemaining <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

//function to load the questions on the page
function displayQuestions() {
  removeEls(startButton);
  /* if statement show if the question count isn't greater than the the total amount of questions, then
  to display the next question
  */
  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation();

        /* the below if statement shows if the answer is correct then
        add to the score positively, but if answered incorrectly
        to subtract 5 points per wrong question, and take a
        total of 10 seconds off the overall timer
        */
        if (el.innerText === questions[questionCount].answer) {
          score += timeRemaining;
        } else {
          score -= 5;
          timeRemaining = timeRemaining - 10;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
  }
}

/*
The function below is meant to create the button submit the score the user received. It will remove the timer once completed
and give the user a message stating their score, and prompting them to input their initials. It will track multiple scores
locally, until the "clear score" button is used.*
*/
function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  let initialsInput = document.createElement("input");
  let postScoreBtn = document.createElement("input");

  results.innerHTML = `You scored ${score} points! Enter initials: `;
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score!");
  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (scr1, scr2) => {
  if(scr1 !== null) {
    return scr1
  } else {
    return scr2
  }
}

const removeEls = (...els) => {
    for (let el of els) el.remove();
  }

/* the below function displays all locally stored scores with the
input values for Initials & Score
*/
function displayAllScores() {
  removeEls(timer, startButton, results);
  let scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    let inits = obj.initials;
    let savedScore = obj.score;
    let resultsP = document.createElement("p");
    resultsP.innerText = `${inits}: ${savedScore}`;
    scoresDiv.append(resultsP);
  });
}

/* This function creates the button for viewing the locally stored scores
*/
function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
  });
}
// This function creates the button for clearing the locally stored scores
function clearScoresBtn() {    
  let clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scoresDiv);
    window.localStorage.removeItem("highScores");
  })
  scoresDiv.append(clearBtn)
}

viewScores();