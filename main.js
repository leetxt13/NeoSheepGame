"use strict";
const ITEM_SIZE = 100;
const DEVIL_SIZE = -50;
let lifeNum = 3;

const field = document.querySelector(".game__field");
const field__size = field.getBoundingClientRect();
const game__button = document.querySelector(".game__button");
const button__box = document.querySelector(".button__box");
const jesus = document.querySelector(".jesus");
const jesus__size = jesus.getBoundingClientRect();
const jesus__area = document.querySelector(".jesus__area");
const game__timer = document.querySelector(".game__timer");
const game__score = document.querySelector(".game__score");
const popup = document.querySelector(".pop-up");
const popupMessage = document.querySelector(".pop-up__message");
const popupRefresh_btn = document.querySelector(".pop-up__refresh");

const cross__btn = document.querySelector(".gameItem__relocation");
const game__GoToFirstScreen__btn = document.querySelector(".game__firstScreen");
const first__screen = document.querySelector(".first__screen");
const first__screen__btn1 = document.querySelector(".first__screen__btn1");
const first__screen__btn2 = document.querySelector(".first__screen__btn2");
const first__screen__btn3 = document.querySelector(".first__screen__btn3");

const life = document.querySelector(".life");

let RUNNING_TIME = 10;
let SCORE = 5;
let started = false;
let timer = undefined;
let sheepMoveInterval = undefined;
let devilMoveInterval = undefined;
let lowLevel = false;
let middleLevel = false;
let highLevel = false;
let crossCondition = false;
let addingTime = false;

const bgSound = new Audio("./sound/bg.mp3");
const devilPullSound = new Audio("./sound/bug_pull.mp3");
const sheepPullSound = new Audio("./sound/carrot_pull.mp3");
const gameWinSound = new Audio("./sound/game_win.mp3");
const gameLostSound = new Audio("./sound/alert.wav");

game__button.addEventListener("click", () => {
  if (started === true) {
    game__button.innerHTML = `<i class="fas fa-play"></i>`;
    stopGame();
    showPopupMessage("REPLAY?");
    startBGM(gameLostSound);
  }
});

field.addEventListener("click", (e) => {
  if (e.target.dataset.id === "sheep") {
    e.target.remove();
    SCORE--;
    game__score.innerText = SCORE;
    startBGM(sheepPullSound);
    if (SCORE === 0) {
      showPopupMessage("YOU WIN!!💥");
      stopGame();
      startBGM(gameWinSound);
    }
  } else if (e.target.dataset.id === "devil") {
    startBGM(devilPullSound);
    lifeNum--;
    const heart = document.querySelector(`i[data-num="${lifeNum}"]`);
    heart.remove();
    if (lifeNum === 0) {
      startBGM(gameLostSound);
      stopGame();
      showPopupMessage("YOU LOST!!💥\n 사탄에게 생명을 잃다");
    }
  }
});

popupRefresh_btn.addEventListener("click", () => {
  lifeNum = 3;
  life.innerHTML = ` <i class="fa-solid fa-heart" data-num="0" style="color:red"></i>
  <i class="fa-solid fa-heart" data-num="1" style="color:red"></i>
  <i class="fa-solid fa-heart" data-num="2" style="color:red"></i>`;
  popup.classList.remove("show");
  game__button.innerHTML = `<i class="fas fa-play"></i>`;
  if (lowLevel == true) {
    initGame(8, 5);
  } else if (middleLevel == true) {
    initGame(13, 10);
  } else if (highLevel == true) {
    initGame(18, 18);
    makeDevilMove();
    addingTime = true;
  }
});

cross__btn.addEventListener("click", () => {
  crossCondition = true;
  const message = document.createElement("img");
  message.setAttribute("class", "jesus__message");
  message.setAttribute("src", "./img/message.png");
  jesus__area.appendChild(message);
  cross__btn.innerHTML = `<i class="fa-regular fa-circle-xmark" style="color:red"></i>`;
  cross__btn.classList.add("deactive");
  makeSheepMove();
  setTimeout(() => {
    clearInterval(sheepMoveInterval);
  }, 1000);
  setTimeout(() => {
    message.remove();
  }, 4000);
});

game__GoToFirstScreen__btn.addEventListener("click", () => {
  first__screen.classList.remove("hide");
  stopGame();
});

first__screen__btn1.addEventListener("click", () => {
  game__timer.innerText = "시 작";
  lowLevel = true;
  middleLevel = false;
  highLevel = false;
  initGame(8, 5);
  first__screen.classList.add("hide");
});
first__screen__btn2.addEventListener("click", () => {
  game__timer.innerText = "시 작";
  middleLevel = true;
  lowLevel = false;
  highLevel = false;
  initGame(13, 10);
  first__screen.classList.add("hide");
  makeDevilLarge();
});
first__screen__btn3.addEventListener("click", () => {
  game__timer.innerText = "시 작";
  highLevel = true;
  middleLevel = false;
  lowLevel = false;
  initGame(18, 18);
  makeDevilMove();
  first__screen.classList.add("hide");
  addingTime = true;
});

function initGame(sheepNum, devilNum) {
  SCORE = sheepNum;
  started = true;
  addItem(devilNum, "devill2");
  addItem(sheepNum, "sheep");
  setTimerandScore();
  game__button.innerHTML = `<i class="fas fa-stop"></i>`;
  button__box.classList.remove("hide");
  game__timer.classList.remove("hide");
  cross__btn.innerHTML = `<i class="fa-solid fa-cross"></i>`;
  cross__btn.classList.remove("deactive");
  startBGM(bgSound);
  makeSheepMove();
  setTimeout(() => {
    clearInterval(sheepMoveInterval);
  }, 2000);
  setTimeout(() => {
    clearInterval(sheepMoveInterval);
  }, 4000);
  setTimeout(() => {
    makeSheepMove();
  }, 5000);
  setTimeout(() => {
    clearInterval(sheepMoveInterval);
  }, 7000);
  setTimeout(() => {
    makeSheepMove();
  }, 7500);
  setTimeout(() => {
    clearInterval(sheepMoveInterval);
  }, 8000);
}

function stopGame() {
  started = false;
  stopTimer();
  field.innerHTML = "";
  stopBGM(bgSound);
  button__box.classList.add("hide");
  game__timer.classList.add("hide");
  game__timer.innerText = "시 작";
}

function setTimerandScore() {
  let remainingTime = RUNNING_TIME;
  timer = setInterval(() => {
    if (crossCondition === true) {
      remainingTime += 5;
      updateTimer(remainingTime);
      crossCondition = false;
      addingTime = false;
    } else if (addingTime === true) {
      remainingTime += 1;
      updateTimer(remainingTime);
      crossCondition = false;
      addingTime = false;
    }
    if (SCORE <= 0) {
      clearInterval(timer);
    }
    if (remainingTime === 0) {
      clearInterval(timer);
      stopGame();
      showPopupMessage("YOU LOST!!💥");
      startBGM(gameLostSound);
    }
    updateTimer(remainingTime--);
  }, 1000);

  game__score.innerText = SCORE;
}
function stopTimer() {
  clearInterval(timer);
}
function updateTimer(timer) {
  let min = Math.floor(timer / 60);
  let sec = timer % 60;
  game__timer.innerText = `${min}:${sec}`;
}
function showPopupMessage(message) {
  button__box.classList.add("hide");
  popup.classList.add("show");
  game__timer.classList.add("hide");
  popupMessage.innerText = message;
}
function addItem(itemNum, itemSort) {
  for (let i = 0; i < itemNum; i++) {
    const img = document.createElement("img");
    img.setAttribute("class", `item__${itemSort}`);
    img.setAttribute("src", `./img/${itemSort}.png`);
    if (itemSort === "devill2") {
      img.setAttribute("data-id", "devil");
    } else if (itemSort === "sheep") {
      img.setAttribute("data-id", "sheep");
    }
    makePosition(img);
    field.appendChild(img);
  }
}

function makePosition(img) {
  const field = document.querySelector(".game__field");
  const field__size = field.getBoundingClientRect();
  const x1 = 0;
  const y1 = 0;
  const x2 = field__size.width - ITEM_SIZE;
  const y2 = field__size.height - ITEM_SIZE;
  const x = makeRandomNumber(x1, x2);
  const y = makeRandomNumber(y1, y2);
  img.style.position = "absolute";
  img.style.top = `${y}px`;
  img.style.left = `${x}px`;
}
function makeDevilPosition(img) {
  const field = document.querySelector(".game__field");
  const field__size = field.getBoundingClientRect();
  const x1 = 0;
  const y1 = 0;
  const x2 = field__size.width - DEVIL_SIZE;
  const y2 = field__size.height - DEVIL_SIZE;
  const x = makeRandomNumber(x1, x2);
  const y = makeRandomNumber(y1, y2);
  img.style.position = "absolute";
  img.style.top = `${y}px`;
  img.style.left = `${x}px`;
}

function makeRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function makeDevilMove() {
  const devil = document.querySelectorAll("img[data-id='devil']");
  devil.forEach((dev) => {
    devilMoveInterval = setInterval(() => {
      makeDevilPosition(dev);
      dev.style.transition = "all 5s cubic-bezier(.01,1.05,.84,-0.03) ";
    }, 1900);
  });
}

function makeDevilLarge() {
  const devil = document.querySelectorAll("img[data-id='devil']");
  devil.forEach((dev) => {
    setInterval(() => {
      dev.classList.toggle("scale");
    }, 1500);
  });
}
function makeSheepMove() {
  const sheep = document.querySelectorAll("img[data-id='sheep']");
  sheepMoveInterval = setInterval(() => {
    sheep.forEach((sheep) => {
      makePosition(sheep);
      sheep.style.transition = "all 1100ms cubic-bezier(1,.16,.21,.54)";
    });
  }, 500);
}

function startBGM(sound) {
  sound.play();
  sound.currentTime = 0;
}
function stopBGM(sound) {
  sound.pause();
  sound.currentTime = 0;
}
