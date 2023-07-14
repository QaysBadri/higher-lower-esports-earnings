import { CSGOdata } from "./CSGOdata.js";

let highScore = 0;
let score = 0;
let player1, player2;
let currentHighScore = 0;

const higherBtn = document.getElementById("higher-button");
const lowerBtn = document.getElementById("lower-button");

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
  const currentHandle = CSGOdata[player1].CurrentHandle;
  const currentHandle2 = CSGOdata[player2].CurrentHandle;
  const leftIMG = document.getElementById("left-panel");
  const rightIMG = document.getElementById("right-panel");

  leftName.innerHTML = `${CSGOdata[player1].NameFirst} "<span class="player-handle-color">${currentHandle}</span>" ${CSGOdata[player1].NameLast}`;
  leftEarnings.textContent =
    "$" + addCommasToNumber(CSGOdata[player1].TotalUSDPrize);
  rightName.innerHTML = `${CSGOdata[player2].NameFirst} "<span class="player-handle-color">${currentHandle2}</span>" ${CSGOdata[player2].NameLast}`;

  leftIMG.style.background = `url(${CSGOdata[player1].ImageURL})`;
  rightIMG.style.background = `url(${CSGOdata[player2].ImageURL})`;
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
    const rightEarningsValue = Number(CSGOdata[player2].TotalUSDPrize);
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
    Number(CSGOdata[player2].TotalUSDPrize) >
      Number(CSGOdata[player1].TotalUSDPrize)
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

function setupPageForInitialLoad() {
  pullHighScoreFromLocalStorage();
  getNewPlayersForBothPanels();

  highScoreValue.textContent = highScore;
  scoreValue.textContent = score;

  updatePlayerInfo();
}

async function handleGameRound(isHigher) {
  removeButtons();
  await animateCountingOnRightPanelEarnings();
  await updateScore(isHigher);

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
    await sleep(3000);
    hideEarningsOnRightPanel();
    getNewPlayersForBothPanels();
    showButtonsForNewRound();
    updatePlayerInfo();
    revertCircleForNewRound();
  }
}

window.addEventListener("DOMContentLoaded", setupPageForInitialLoad);

higherBtn.addEventListener("click", () => handleGameRound(true));

lowerBtn.addEventListener("click", () => handleGameRound(false));
