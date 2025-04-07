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

/* 
  定义美式双零轮盘的数字顺序（共 38 格）
  顺序为：0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24,
           36, 13, 1, "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6,
           21, 33, 16, 4, 23, 35, 14, 2
*/
const pockets = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24,
  36, 13, 1, "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6,
  21, 33, 16, 4, 23, 35, 14, 2
];

// 由于美式轮盘有 38 格，每格所占角度
const pocketCount = pockets.length; // 38
const segmentAngle = 360 / pocketCount;  // ≈9.4737°
/*
  offsetAngle 用于校正图片中数字的实际朝向
  如若图片中“0”不在正上方，则需调整这个偏移量
*/
const offsetAngle = 0;  // 根据实际情况调整

/**
 * 根据当前 angle 返回对应的轮盘数字
 */
function getPocketByAngle(angle) {
  // 归一化 angle 到 [0, 360)
  angle = ((angle % 360) + 360) % 360;
  // 加上图片偏移量
  let adjustedAngle = angle + offsetAngle;
  adjustedAngle = ((adjustedAngle % 360) + 360) % 360;
  const index = Math.floor(adjustedAngle / segmentAngle);
  return pockets[index];
}

/**
 * 开始游戏函数
 */
function startGame() {
  // 获取用户输入的猜测数字（允许输入 "00"）
  const guessInput = document.getElementById("guessNumber").value;
  const bet = parseFloat(document.getElementById("betAmount").value);

  // 对猜测进行基本验证：如果不是 "00" 则应为数字 1~36
  if (guessInput === "" || (guessInput !== "00" && (isNaN(parseInt(guessInput, 10)) || parseInt(guessInput, 10) < 1 || parseInt(guessInput, 10) > 36))) {
    alert("Please enter your guess number in range of 1~36 or '00'");
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

  // 初始化旋转速度（随机范围内）
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
  // 获取实际落盘数字
  const finalPocket = getPocketByAngle(angle);
  const guessInput = document.getElementById("guessNumber").value;
  const bet = parseFloat(document.getElementById("betAmount").value);
  
  // 如果用户输入的是 "00"，直接比较字符串；否则转换为数字
  let guess = guessInput === "00" ? "00" : parseInt(guessInput, 10);
  
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
