import { CSGOdata } from "./Data/CSGOdata.js";
import { DOTA2data } from "./Data/DOTA2data.js";
import { FORTNITEdata } from "./Data/FORTNITEdata.js";
import { VALORANTdata } from "./Data/VALORANTdata.js";
import { LEAGUEdata } from "./Data/LEAGUEdata.js";

let game = localStorage.getItem("game");

let highScore = 0;
let score = 0;
let player1, player2;
let currentHighScore = 0;
let gameOverScoreValue = 0;

const gameData = {
  CSGO: CSGOdata,
  DOTA2: DOTA2data,
  FORTNITE: FORTNITEdata,
  VALORANT: VALORANTdata,
  LEAGUE: LEAGUEdata,
};

const higherBtn = document.getElementById("higher-button");
const lowerBtn = document.getElementById("lower-button");

const tryAgainBtn = document.getElementById("try-again");
const gameOver = document.getElementById("game-over");
const gameOverScore = document.getElementById("game-over-score");
const gameOverScoreID = document.getElementById("game-over-score-value");

const scoreValue = document.getElementById("score-value");
const highScoreValue = document.getElementById("highscore-value");

const innerCircle = document.getElementById("inner-circle");

function chooseNumberFrom0to99() {
  return Math.floor(Math.random() * 99);
}

function addCommasToNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updatePlayerInfo() {
  const leftName = document.getElementById("left-name");
  const leftEarnings = document.getElementById("left-earnings");
  const rightName = document.getElementById("right-name");
  const currentHandle = gameData[game][player1].CurrentHandle;
  const currentHandle2 = gameData[game][player2].CurrentHandle;
  const leftIMG = document.getElementById("left-panel");
  const rightIMG = document.getElementById("right-panel");

  leftName.innerHTML = `${gameData[game][player1].NameFirst} "<span class="player-handle-color">${currentHandle}</span>" ${gameData[game][player1].NameLast}`;
  leftEarnings.textContent =
    "$" + addCommasToNumber(gameData[game][player1].TotalUSDPrize);
  rightName.innerHTML = `${gameData[game][player2].NameFirst} "<span class="player-handle-color">${currentHandle2}</span>" ${gameData[game][player2].NameLast}`;

  if (
    gameData[game][player1].ImageURL == undefined &&
    gameData[game][player2].ImageURL == undefined
  ) {
    leftIMG.style.background = `url(Images/unknown-person.jpg)`;
    rightIMG.style.background = `url(Images/unknown-person.jpg)`;
  } else if (gameData[game][player1].ImageURL == undefined) {
    leftIMG.style.background = `url(Images/unknown-person.jpg)`;
    rightIMG.style.background = `url(${gameData[game][player2].ImageURL})`;
  } else if (gameData[game][player2].ImageURL == undefined) {
    leftIMG.style.background = `url(${gameData[game][player1].ImageURL})`;
    rightIMG.style.background = `url(Images/unknown-person.jpg)`;
  } else {
    leftIMG.style.background = `url(${gameData[game][player1].ImageURL})`;
    rightIMG.style.background = `url(${gameData[game][player2].ImageURL})`;
  }
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

function animateCountingOnRightPanelEarnings() {
  return new Promise((resolve) => {
    const rightEarnings = document.getElementById("right-earnings");
    const rightEarningsValue = Number(gameData[game][player2].TotalUSDPrize);
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
        resolve();
      }
    }

    updateEarnings();
  });
}

function showFireAnimation() {
  const fireAnimation = document.getElementById("fire-animation");
  fireAnimation.style.transform = "scale(0.6)";
}

function removeFireAnimation() {
  const fireAnimation = document.getElementById("fire-animation");
  fireAnimation.style.transform = "scale(0)";
}

function removeButtons() {
  higherBtn.style.display = "none";
  lowerBtn.style.display = "none";
}

function updateScore(isHigher) {
  if (
    isHigher ==
    Number(gameData[game][player2].TotalUSDPrize) >
      Number(gameData[game][player1].TotalUSDPrize)
  ) {
    score++;
    scoreValue.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreValue.textContent = highScore;
      localStorage.setItem("highScore", highScore);
    }
  } else {
    gameOverScoreValue = score;
    score = 0;
    scoreValue.textContent = score;
  }

  if (score >= Number(currentHighScore) + 3) {
    showFireAnimation();
  } else {
    removeFireAnimation();
  }
}

function pullHighScoreFromLocalStorage() {
  if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", "0");
  } else {
    highScore = parseInt(localStorage.getItem("highScore"));
  }
}

function getNewPlayersForBothPanels() {
  const prevPlayer1 = player1;
  const prevPlayer2 = player2;

  player1 = chooseNumberFrom0to99();
  player2 = chooseNumberFrom0to99();

  while (
    player1 == player2 ||
    player1 == prevPlayer1 ||
    player1 == prevPlayer2 ||
    player2 == prevPlayer1 ||
    player2 == prevPlayer2
  ) {
    player1 = chooseNumberFrom0to99();
    player2 = chooseNumberFrom0to99();
  }

  pullHighScoreFromLocalStorage();
  if (currentHighScore < localStorage.getItem("highScore")) {
    currentHighScore = localStorage.getItem("highScore");
  }
}

function getNewPlayerForRightPanel() {
  const prevPlayer1 = player1;

  player1 = player2;
  player2 = chooseNumberFrom0to99();
  while (player1 == player2 || player2 == prevPlayer1) {
    player1 = chooseNumberFrom0to99();
    player2 = chooseNumberFrom0to99();
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
  circle.style.animation = "scale-up 1.2s ease-in-out";

  setTimeout(() => {
    circle.style.animation = "";
  }, 1200);

  innerCircle.textContent = "✓";
}

function showRedCircleForWrongAnswer() {
  circle.style.backgroundColor = "#9e180c";
  circle.style.animation = "scale-down 1.2s ease-in-out";

  setTimeout(() => {
    circle.style.animation = "";
  }, 1200);

  innerCircle.textContent = "✗";
}

function showGameOver() {
  gameOver.style.display = "inline-block";
  gameOverScore.style.display = "inline-block";
  gameOverScoreID.textContent = gameOverScoreValue;
  tryAgainBtn.style.display = "inline-block";
}

function hideGameOver() {
  gameOver.style.display = "none";
  gameOverScore.style.display = "none";
  tryAgainBtn.style.display = "none";
}

function resetGame() {
  hideEarningsOnRightPanel();
  getNewPlayersForBothPanels();
  showButtonsForNewRound();
  updatePlayerInfo();
  revertCircleForNewRound();
  hideGameOver();
}

function setupPageForInitialLoad() {
  pullHighScoreFromLocalStorage();
  getNewPlayersForBothPanels();

  if (gameOver) {
    hideGameOver();
  }

  if (scoreValue) {
    highScoreValue.textContent = highScore;
    scoreValue.textContent = score;
    updatePlayerInfo();
  }
}

async function handleGameRound(isHigher) {
  removeButtons();
  await animateCountingOnRightPanelEarnings();
  updateScore(isHigher);

  if (score > 0) {
    showGreenCircleForCorrectAnswer();
    await sleep(3000);
    hideEarningsOnRightPanel();
    getNewPlayerForRightPanel();
    showButtonsForNewRound();
    updatePlayerInfo();
    revertCircleForNewRound();
  } else {
    showRedCircleForWrongAnswer();
    await sleep(2000);
    showGameOver();
  }
}

window.addEventListener("DOMContentLoaded", setupPageForInitialLoad);

if (higherBtn) {
  higherBtn.addEventListener("click", function () {
    handleGameRound(true);
  });
}

if (lowerBtn) {
  lowerBtn.addEventListener("click", function () {
    handleGameRound(false);
  });
}

if (tryAgainBtn) {
  tryAgainBtn.addEventListener("click", resetGame);
}
