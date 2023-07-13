import { CSGOdata } from "./CSGOdata.js";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let highScore = 0;
let score = 0;
let x, y;

// Function to generate a random number between 0 and 99
function random0to100() {
  return Math.floor(Math.random() * 99);
}

// sleep like in python
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// This code doesn't currently work because the fetch runs into a CORS error.
// I'm not sure how to fix this right now, stack overflow says it's a server side issue.
// So instead Ill just manually import the data to a json file for now.
// https://api.esportsearnings.com/v0/LookupHighestEarningPlayersByGame?apikey=615007f62697888759490d56af6b163d5dd9ba9c997ebecf986833d41088bc61&gameid=245&offset=0
// const apiKey =
//   "615007f62697888759490d56af6b163d5dd9ba9c997ebecf986833d41088bc61";
// // LookupHighestEarningPlayers (top 100 of all esports) == http://api.esportsearnings.com/v0/LookupHighestEarningPlayers?apikey=<apikey>&offset=<offset>
// const CSGO = "245";
// const Dota2 = "231";
// const LeagueOfLegends = "164";
// const Valorant = "646";
// const PUBG = "504";
// const Fortnite = "534";
// let offset = "0";

// https://www.esportsearnings.com/apidocs
// LookupHighestEarningPlayersByGame (top 100 of this game) == http://api.esportsearnings.com/v0/LookupHighestEarningPlayersByGame?apikey=<apikey>&gameid=<gameid>>&offset=<offset>
// apikey - The unique API Key associated with your account.
// format - Format of the output. (default: JSON)
// gameid - The unique ID associated with the game on the website.
// offset - The number of players to skip before returning results. (default: 0)

// fetching top 100 players of CSGO
// set the fetch to no-cors to avoid CORS error
// async function top100() {
//   const response = await fetch(
//     `https://api.esportsearnings.com/v0/LookupHighestEarningPlayersByGame?apikey=${apiKey}&gameid=${CSGO}&offset=${offset}`,
//     {
//       mode: "no-cors",
//     }
//   );
//   const data = await response.json();
//   console.log(data);
// }
// top100().catch((error) => console.error(error.message));

// Function to update the player information on the page
function updatePlayerInfo() {
  const leftName = document.getElementById("left-name");
  const leftEarnings = document.getElementById("left-earnings");
  const rightName = document.getElementById("right-name");
  const currentHandle = CSGOdata[x].CurrentHandle;
  const currentHandle2 = CSGOdata[y].CurrentHandle;

  leftName.innerHTML = `${CSGOdata[x].NameFirst} "<span class="player-handle-color">${currentHandle}</span>" ${CSGOdata[x].NameLast}`;
  leftEarnings.textContent = "$" + numberWithCommas(CSGOdata[x].TotalUSDPrize);

  rightName.innerHTML = `${CSGOdata[y].NameFirst} "<span class="player-handle-color">${currentHandle2}</span>" ${CSGOdata[y].NameLast}`;

  // change the background image of the left and right panels to show the player images
  const leftIMG = document.getElementById("left-panel");
  const rightIMG = document.getElementById("right-panel");
  leftIMG.style.background = `url(${CSGOdata[x].ImageURL})`;
  rightIMG.style.background = `url(${CSGOdata[y].ImageURL})`;
  leftIMG.style.backgroundRepeat = "no-repeat";
  rightIMG.style.backgroundRepeat = "no-repeat";
  leftIMG.style.backgroundSize = "cover";
  rightIMG.style.backgroundSize = "cover";
  leftIMG.style.backgroundPosition = "center";
  rightIMG.style.backgroundPosition = "center";
  document.body.appendChild(leftIMG);
  document.body.appendChild(rightIMG);
}

// need to show earnings of right player after button click
// this might be obsolete now that I have the counting animation
function showRightEarnings() {
  const rightEarnings = document.getElementById("right-earnings");
  rightEarnings.textContent = "$" + numberWithCommas(CSGOdata[y].TotalUSDPrize);
}

// hiding earnings after rounds
function hideRightEarnings() {
  const rightEarnings = document.getElementById("right-earnings");
  rightEarnings.textContent = "";
}

// Function to animate the right earnings counting up
// javascript runs on a single thread, so this is the only way to do it?
// if i do it in a for/while loop, it will just show the last one because of the single thread

// BUG: when clicking off the tab and coming back, the animation is still running
function rightEarningsCountingAnimation() {
  const rightEarnings = document.getElementById("right-earnings");
  const rightEarningsValue = Number(CSGOdata[y].TotalUSDPrize);
  const animationDuration = 1500; // Animation duration in milliseconds
  const frameDuration = 16; // Desired frame duration (60 frames per second)

  const totalFrames = Math.round(animationDuration / frameDuration);
  const increment = Math.ceil(rightEarningsValue / totalFrames);

  let earnings = 0;
  let frameCount = 0;

  function updateEarnings() {
    if (frameCount < totalFrames) {
      earnings += increment;
      rightEarnings.textContent = "$" + numberWithCommas(earnings);
      frameCount++;
      setTimeout(updateEarnings, frameDuration); // allows the animation to actually run asynchrously
    } else {
      rightEarnings.textContent = "$" + numberWithCommas(rightEarningsValue);
    }
  }

  updateEarnings();
}

// Function to handle button click
function handleButtonClick(isHigher) {
  const scoreValue = document.getElementById("score-value");
  const highScoreValue = document.getElementById("highscore-value");
  if (
    isHigher ==
    Number(CSGOdata[y].TotalUSDPrize) > Number(CSGOdata[x].TotalUSDPrize)
  ) {
    score++;
    scoreValue.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreValue.textContent = highScore;
      localStorage.setItem("highScore", highScore);
    }
  } else {
    score = 0;
    scoreValue.textContent = score;
  }

  // make buttons dissapear after click until next round
  higherBtn.style.display = "none";
  lowerBtn.style.display = "none";
}

window.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", "0");
  } else {
    highScore = parseInt(localStorage.getItem("highScore"));
  }

  x = random0to100();
  y = random0to100();

  while (x == y) {
    x = random0to100();
    y = random0to100();
  }

  const highScoreValue = document.getElementById("highscore-value");
  const scoreValue = document.getElementById("score-value");

  highScoreValue.textContent = highScore;
  scoreValue.textContent = score;

  updatePlayerInfo();
});

// Higher & Lower buttons
const higherBtn = document.getElementById("higher-button");
const lowerBtn = document.getElementById("lower-button");

higherBtn.addEventListener("click", function () {
  (async () => {
    handleButtonClick(true);
    rightEarningsCountingAnimation();

    const innerCircle = document.getElementById("inner-circle");

    // after a few seconds, start next round
    // if correct, show green in circle then go to next round
    // if correct, slide right player to left and create new player to the right
    // if incorrect, show red in circle then go to next round
    // if incorrect, reset score to 0, and create 2 new players
    // also need to implement the red/green circle
    if (score > 0) {
      circle.style.backgroundColor = "#396d14";
      innerCircle.textContent = "✓";

      await sleep(4000);
      hideRightEarnings();
      x = y;
      y = random0to100();
      while (x == y) {
        x = random0to100();
        y = random0to100();
      }
      higherBtn.style.display = "inline-block";
      lowerBtn.style.display = "inline-block";
      circle.style.backgroundColor = "#25252a";
      updatePlayerInfo();
      innerCircle.textContent = "VS";
    } else {
      circle.style.backgroundColor = "#9e180c";
      innerCircle.textContent = "✗";

      await sleep(4000);
      hideRightEarnings();
      x = random0to100();
      y = random0to100();
      while (x == y) {
        x = random0to100();
        y = random0to100();
      }
      higherBtn.style.display = "inline-block";
      lowerBtn.style.display = "inline-block";
      circle.style.backgroundColor = "#25252a";
      updatePlayerInfo();
      innerCircle.textContent = "VS";
    }
  })();
});

lowerBtn.addEventListener("click", function () {
  (async () => {
    handleButtonClick(false);
    rightEarningsCountingAnimation();

    const innerCircle = document.getElementById("inner-circle");

    // after a few seconds, start next round
    // if correct, show green in circle then go to next round
    // if correct, slide right player to left and create new player to the right
    // if incorrect, show red in circle then go to next round
    // if incorrect, reset score to 0, and create 2 new players
    // also need to implement the red/green circle

    if (score > 0) {
      circle.style.backgroundColor = "#396d14";
      innerCircle.textContent = "✓";

      await sleep(4000);
      hideRightEarnings();
      x = y;
      y = random0to100();
      while (x == y) {
        x = random0to100();
        y = random0to100();
      }
      higherBtn.style.display = "inline-block";
      lowerBtn.style.display = "inline-block";
      circle.style.backgroundColor = "#25252a";
      updatePlayerInfo();
      innerCircle.textContent = "VS";
    } else {
      circle.style.backgroundColor = "#9e180c";
      innerCircle.textContent = "✗";

      await sleep(4000);
      hideRightEarnings();
      x = random0to100();
      y = random0to100();
      while (x == y) {
        x = random0to100();
        y = random0to100();
      }
      higherBtn.style.display = "inline-block";
      lowerBtn.style.display = "inline-block";
      circle.style.backgroundColor = "#25252a";
      updatePlayerInfo();
      innerCircle.textContent = "VS";
    }
  })();
});
