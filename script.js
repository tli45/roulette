// 绑定 START 按钮点击事件
document.getElementById("startBtn").addEventListener("click", startGame);

// 为胜利模态窗口的按钮绑定事件
document.getElementById("playAgainBtnWin").addEventListener("click", function() {
  document.getElementById("winModal").style.display = "none";
  resetGame();
  startGame();  // 直接启动游戏
});
document.getElementById("closeBtnWin").addEventListener("click", function() {
  document.getElementById("winModal").style.display = "none";
});

// 为失败模态窗口的按钮绑定事件
document.getElementById("playAgainBtnLose").addEventListener("click", function() {
  document.getElementById("loseModal").style.display = "none";
  resetGame();
  startGame();  // 直接启动游戏
});
document.getElementById("closeBtnLose").addEventListener("click", function() {
  document.getElementById("loseModal").style.display = "none";
});

// 全局变量定义
let angle = 0;             // 当前旋转角度
let speed = 0;             // 当前旋转速度（度/帧）
let deceleration = 0.05;   // 减速度（度/帧²）
let spinning = false;      // 是否正在旋转
let totalMoney = 100;      // 初始金额为 100

const ballContainer = document.getElementById("ballContainer");

/**
 * 开始游戏函数
 */
function startGame() {
  const guess = parseInt(document.getElementById("guessNumber").value, 10);
  const bet = parseFloat(document.getElementById("betAmount").value);

  if (isNaN(guess) || guess < 1 || guess > 36) {
    alert("Please enter your guess number in range of 1~36");
    return;
  }
  if (isNaN(bet) || bet <= 0) {
    alert("Please enter valid bet");
    return;
  }
  if (bet > totalMoney) {
    alert("Bet cannot be greater than total money");
    return;
  }
  if (spinning) return;

  speed = 10 + Math.random() * 10;
  spinning = true;
  requestAnimationFrame(spin);
}

/**
 * 动画循环：旋转小球并逐步减速
 */
function spin() {
  if (!spinning) return;

  angle += speed;
  speed -= deceleration;

  if (speed <= 0) {
    speed = 0;
    spinning = false;
    angle = angle % 360;
    checkResult();
  }
  
  ballContainer.style.transform = `rotate(${angle}deg)`;
  requestAnimationFrame(spin);
}

/**
 * 检查结果，并更新总金额
 */
function checkResult() {
  const finalPocket = Math.floor(angle / 10);
  const guess = parseInt(document.getElementById("guessNumber").value, 10);
  const bet = parseFloat(document.getElementById("betAmount").value);

  if (finalPocket === guess) {
    totalMoney += bet * 36;
    showWinModal();
  } else {
    totalMoney -= bet;
    showLoseModal();
  }
  document.getElementById("totalMoney").innerText = "Total Money: " + totalMoney;
}

/**
 * 显示胜利模态窗口
 */
function showWinModal() {
  document.getElementById("winModal").style.display = "flex";
}

/**
 * 显示失败模态窗口
 */
function showLoseModal() {
  document.getElementById("loseModal").style.display = "flex";
}

/**
 * 重置游戏状态（如小球角度）
 */
function resetGame() {
  angle = 0;
  ballContainer.style.transform = `rotate(0deg)`;
}
