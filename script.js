import { CSGOdata } from "./Data/CSGOdata.js";
import { DOTA2data } from "./Data/DOTA2data.js";
import { FORTNITEdata } from "./Data/FORTNITEdata.js";
import { VALORANTdata } from "./Data/VALORANTdata.js";
import { LEAGUEdata } from "./Data/LEAGUEdata.js";

const game = localStorage.getItem("game");
const gameData = {
  CSGO: CSGOdata,
  DOTA2: DOTA2data,
  FORTNITE: FORTNITEdata,
  VALORANT: VALORANTdata,
  LEAGUE: LEAGUEdata,
};

let highScore = 0;
let score = 0;
let player1, player2;

const higherBtn = document.getElementById("higher-button");
const lowerBtn = document.getElementById("lower-button");
const tryAgainBtn = document.getElementById("try-again");
const gameOver = document.getElementById("game-over");
const gameOverScoreValue = document.getElementById("game-over-score-value");
const scoreValue = document.getElementById("score-value");
const highScoreValue = document.getElementById("highscore-value");

const randomIndex = () => Math.floor(Math.random() * 100);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const addCommasToNumber = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function updatePlayerInfo() {
  const leftName = document.getElementById("left-name");
  const leftEarnings = document.getElementById("left-earnings");
  const rightName = document.getElementById("right-name");
  const rightEarnings = document.getElementById("right-earnings");

  const leftPlayer = gameData[game][player1];
  const rightPlayer = gameData[game][player2];

  leftName.innerHTML = `${leftPlayer.NameFirst} "<span class="player-handle">${leftPlayer.CurrentHandle}</span>" ${leftPlayer.NameLast}`;
  leftEarnings.textContent = `$${addCommasToNumber(leftPlayer.TotalUSDPrize)}`;

  rightName.innerHTML = `${rightPlayer.NameFirst} "<span class="player-handle">${rightPlayer.CurrentHandle}</span>" ${rightPlayer.NameLast}`;
  rightEarnings.textContent = "";

  setPlayerImage("left-panel", leftPlayer.ImageURL);
  setPlayerImage("right-panel", rightPlayer.ImageURL);
}

async function animateRightPanelEarnings() {
  const rightEarningsElement = document.getElementById("right-earnings");
  const finalEarnings = gameData[game][player2].TotalUSDPrize;

  const duration = 1500;
  const frameRate = 16;
  const totalFrames = Math.round(duration / frameRate);
  const increment = Math.ceil(finalEarnings / totalFrames);

  let currentEarnings = 0;
  for (let frame = 0; frame < totalFrames; frame++) {
    currentEarnings += increment;
    rightEarningsElement.textContent = `$${addCommasToNumber(
      Math.min(currentEarnings, finalEarnings)
    )}`;
    await sleep(frameRate);
  }
  rightEarningsElement.textContent = `$${addCommasToNumber(finalEarnings)}`;
}

function setPlayerImage(panelId, imageUrl) {
  const panel = document.getElementById(panelId);
  panel.style.backgroundImage = `url(${
    imageUrl || "Images/unknown-person.jpg"
  })`;
  panel.style.backgroundSize = "cover";
  panel.style.backgroundPosition = "center";
}

async function handleGameRound(isHigher) {
  disableButtons();

  const rightEarnings = gameData[game][player2].TotalUSDPrize;
  const leftEarnings = gameData[game][player1].TotalUSDPrize;

  await animateRightPanelEarnings();

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

    showFeedback("correct");
  } else {
    showFeedback("wrong");
    await sleep(1500);
    endGame();
    return;
  }

  await sleep(2000);
  prepareNextRound();
}

function prepareNextRound() {
  player1 = player2;
  player2 = getNextPlayer();
  updatePlayerInfo();
  enableButtons();
}

function getNextPlayer() {
  let nextPlayer;
  do {
    nextPlayer = randomIndex();
  } while (nextPlayer === player1 || nextPlayer === player2);
  return nextPlayer;
}

function showFeedback(type) {
  const circle = document.getElementById("circle");
  const innerCircle = document.getElementById("inner-circle");

  if (type === "correct") {
    circle.classList.add("correct");
    innerCircle.textContent = "✓";
  } else {
    circle.classList.add("wrong");
    innerCircle.textContent = "✗";
  }

  setTimeout(() => {
    circle.classList.remove("correct", "wrong");
    innerCircle.textContent = "VS";
  }, 1500);
}

function endGame() {
  gameOver.style.display = "flex";
  gameOverScoreValue.textContent = score;
  tryAgainBtn.style.display = "block";
}

function disableButtons() {
  higherBtn.disabled = true;
  lowerBtn.disabled = true;
}

function enableButtons() {
  higherBtn.disabled = false;
  lowerBtn.disabled = false;
}

function initializeGame() {
  highScore = parseInt(localStorage.getItem("highScore")) || 0;
  highScoreValue.textContent = highScore;

  player1 = randomIndex();
  player2 = getNextPlayer();
  updatePlayerInfo();

  higherBtn.addEventListener("click", () => handleGameRound(true));
  lowerBtn.addEventListener("click", () => handleGameRound(false));

  gameOver.style.display = "none";
  tryAgainBtn.style.display = "none";
  score = 0;
  scoreValue.textContent = score;
}

tryAgainBtn.addEventListener("click", initializeGame);

window.addEventListener("DOMContentLoaded", initializeGame);
