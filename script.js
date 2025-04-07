// 绑定 START 按钮点击事件
document.getElementById("startBtn").addEventListener("click", startGame);

// 绑定胜利模态窗口按钮事件
document.getElementById("playAgainBtnWin").addEventListener("click", function() {
  document.getElementById("winModal").style.display = "none";
  resetGame();
  startGame();  // 直接启动游戏
});
document.getElementById("closeBtnWin").addEventListener("click", function() {
  document.getElementById("winModal").style.display = "none";
});

// 绑定失败模态窗口按钮事件
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
  定义美式双零轮盘的数字顺序（共38格）
  顺序为：0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24,
         36, 13, 1, "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6,
         21, 33, 16, 4, 23, 35, 14, 2
*/
const pockets = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24,
  36, 13, 1, "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6,
  21, 33, 16, 4, 23, 35, 14, 2
];

// 美式轮盘共38格，每格的角度
const pocketCount = pockets.length; // 38
const segmentAngle = 360 / pocketCount;  // ≈9.4737°

// offsetAngle 用于校正轮盘图片的实际朝向，如果图片中"0"不在正上方请调整该值
const offsetAngle = 180+360 / pocketCount/2;  // 根据实际情况调整

/**
 * 根据当前角度返回对应的轮盘数字
 * @param {number} angle - 当前旋转角度
 * @returns 返回对应的口袋数字（可能是数字或"00"）
 */
function getPocketByAngle(angle) {
  // 将角度归一化到[0, 360)
  angle = ((angle % 360) + 360) % 360;
  // 加上偏移量以校正图片朝向
  let adjustedAngle = angle + offsetAngle;
  adjustedAngle = ((adjustedAngle % 360) + 360) % 360;
  const index = Math.floor(adjustedAngle / segmentAngle);
  return pockets[index];
}

/**
 * 开始游戏函数，验证输入并启动旋转动画
 */
function startGame() {
  // 获取用户输入的猜测数字（允许输入"00"）和赌注金额
  const guessInput = document.getElementById("guessNumber").value;
  const bet = parseFloat(document.getElementById("betAmount").value);

  // 验证猜测数字：如果不是"00"，则必须是1~36之间的数字
  if (guessInput === "" || (guessInput !== "00" && (isNaN(parseInt(guessInput, 10)) || parseInt(guessInput, 10) < 1 || parseInt(guessInput, 10) > 36))) {
    alert("请输入1~36之间的数字或 '00'");
    return;
  }
  if (isNaN(bet) || bet <= 0) {
    alert("请输入有效的赌注");
    return;
  }
  if (bet > totalMoney) {
    alert("赌注不能超过当前总金额");
    return;
  }
  if (spinning) return;

  // 初始化旋转速度（随机在10到20之间）
  speed = 10 + Math.random() * 10;
  spinning = true;
  requestAnimationFrame(spin);
}

/**
 * 旋转动画循环，逐渐减速
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
 * 检查结果，更新总金额，并在窗口中显示最终数字
 */
function checkResult() {
  // 根据当前角度获取最终数字
  const finalPocket = getPocketByAngle(angle);
  const guessInput = document.getElementById("guessNumber").value;
  const bet = parseFloat(document.getElementById("betAmount").value);
  
  // 如果用户输入的是"00"，直接使用字符串比较，否则转换为数字比较
  let guess = guessInput === "00" ? "00" : parseInt(guessInput, 10);
  
  if (finalPocket === guess) {
    totalMoney += bet * 36;
    // 更新胜利窗口中显示最终数字的文本
    document.getElementById("resultTextWin").innerText = "Result：" + finalPocket;
    showWinModal();
  } else {
    totalMoney -= bet;
    // 更新失败窗口中显示最终数字的文本
    document.getElementById("resultTextLose").innerText = "Result：" + finalPocket;
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
 * 重置游戏状态（例如将旋转角度重置为0）
 */
function resetGame() {
  angle = 0;
  ballContainer.style.transform = `rotate(0deg)`;
}
