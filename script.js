import { CSGOdata } from "./CSGOdata.js";

let highScore = 0;
let score = 0;
let x, y;

const higherBtn = document.getElementById("higher-button");
const lowerBtn = document.getElementById("lower-button");

const scoreValue = document.getElementById("score-value");
const highScoreValue = document.getElementById("highscore-value");

const innerCircle = document.getElementById("inner-circle");

function chooseNumberFrom0to100() {
  return Math.floor(Math.random() * 99);
}

function addCommasToNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// this comment is temporary and will be removed soon
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
//     `https://api.esportsearnings.com/v0/LookupHighestEarningPlayersByGame?apikey=${apiKey}&gameid=${CSGO}&offset=${offset}`

function updatePlayerInfo() {
  const leftName = document.getElementById("left-name");
  const leftEarnings = document.getElementById("left-earnings");
  const rightName = document.getElementById("right-name");
  const currentHandle = CSGOdata[x].CurrentHandle;
  const currentHandle2 = CSGOdata[y].CurrentHandle;
  const leftIMG = document.getElementById("left-panel");
  const rightIMG = document.getElementById("right-panel");

  leftName.innerHTML = `${CSGOdata[x].NameFirst} "<span class="player-handle-color">${currentHandle}</span>" ${CSGOdata[x].NameLast}`;
  leftEarnings.textContent = "$" + addCommasToNumber(CSGOdata[x].TotalUSDPrize);
  rightName.innerHTML = `${CSGOdata[y].NameFirst} "<span class="player-handle-color">${currentHandle2}</span>" ${CSGOdata[y].NameLast}`;

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

function hideEarningsOnRightPanel() {
  const rightEarnings = document.getElementById("right-earnings");
  rightEarnings.textContent = "";
}

// BUG: when clicking off the tab and coming back, the animation is still running
// the animation stops when the tab isn't active but the new round will continue to start which causes the earnings to never be removed
function animateCountingOnRightPanelEarnings() {
  const rightEarnings = document.getElementById("right-earnings");
  const rightEarningsValue = Number(CSGOdata[y].TotalUSDPrize);
  const animationDuration = 1500;
  const frameDuration = 16;

  const totalFrames = Math.round(animationDuration / frameDuration);
  const increment = Math.ceil(rightEarningsValue / totalFrames);

  let earnings = 0;
  let frameCount = 0;

  function updateEarnings() {
    if (frameCount < totalFrames) {
      earnings += increment;
      rightEarnings.textContent = "$" + addCommasToNumber(earnings);
      frameCount++;
      setTimeout(updateEarnings, frameDuration);
    } else {
      rightEarnings.textContent = "$" + addCommasToNumber(rightEarningsValue);
    }
  }

  updateEarnings();
}

function handleButtonClick(isHigher) {
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

  higherBtn.style.display = "none";
  lowerBtn.style.display = "none";
}

function pullHighScoreFromLocalStorage() {
  if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", "0");
  } else {
    highScore = parseInt(localStorage.getItem("highScore"));
  }
}

function getNewPlayersForBothPanels() {
  x = chooseNumberFrom0to100();
  y = chooseNumberFrom0to100();

  while (x == y) {
    x = chooseNumberFrom0to100();
    y = chooseNumberFrom0to100();
  }
}

function getNewPlayerForRightPanel() {
  x = y;
  y = chooseNumberFrom0to100();
  while (x == y) {
    x = chooseNumberFrom0to100();
    y = chooseNumberFrom0to100();
  }
}

function revertCircleForNewRound() {
  circle.style.backgroundColor = "#25252a";
  innerCircle.textContent = "VS";
}

function showButtonsForNewRound() {
  higherBtn.style.display = "inline-block";
  lowerBtn.style.display = "inline-block";
}

function showGreenCircleForCorrectAnswer() {
  circle.style.backgroundColor = "#396d14";
  innerCircle.textContent = "✓";
}

function showRedCircleForWrongAnswer() {
  circle.style.backgroundColor = "#9e180c";
  innerCircle.textContent = "✗";
}

function setupPageForInitialLoad() {
  pullHighScoreFromLocalStorage();
  getNewPlayersForBothPanels();

  highScoreValue.textContent = highScore;
  scoreValue.textContent = score;

  updatePlayerInfo();
}

function handleGameRound(isHigher) {
  (async () => {
    handleButtonClick(isHigher);
    animateCountingOnRightPanelEarnings();

    if (score > 0) {
      showGreenCircleForCorrectAnswer();
      await sleep(4000);
      hideEarningsOnRightPanel();
      getNewPlayerForRightPanel();
      showButtonsForNewRound();
      updatePlayerInfo();
      revertCircleForNewRound();
    } else {
      showRedCircleForWrongAnswer();
      await sleep(4000);
      hideEarningsOnRightPanel();
      getNewPlayersForBothPanels();
      showButtonsForNewRound();
      updatePlayerInfo();
      revertCircleForNewRound();
    }
  })();
}

window.addEventListener("DOMContentLoaded", setupPageForInitialLoad);

higherBtn.addEventListener("click", () => handleGameRound(true));

lowerBtn.addEventListener("click", () => handleGameRound(false));
