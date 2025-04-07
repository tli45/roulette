// 绑定按钮点击事件
document.getElementById("startBtn").addEventListener("click", startGame);

// 全局变量定义
let angle = 0;             // 当前旋转角度
let speed = 0;             // 当前旋转速度（度/帧）
let deceleration = 0.05;   // 减速度（度/帧²）
let spinning = false;      // 是否正在旋转
let totalMoney = 100;      // 初始金额为 100

// 获取小球容器（用于旋转动画）
const ballContainer = document.getElementById("ballContainer");

/**
 * 开始游戏函数
 */
function startGame() {
  // 获取用户输入的猜测数字和赌注
  const guess = parseInt(document.getElementById("guessNumber").value, 10);
  const bet = parseFloat(document.getElementById("betAmount").value);

  // 检查输入的数字是否合法
  if (isNaN(guess) || guess < 1 || guess > 36) {
    alert("Please enter your guess number in range of 1~36");
    return;
  }
  // 检查赌注是否合法
  if (isNaN(bet) || bet <= 0) {
    alert("Please enter valid bet");
    return;
  }
  // 检查赌注不能超过当前总金额
  if (bet > totalMoney) {
    alert("Bet cannot be greater than total money");
    return;
  }

  // 如果正在旋转则忽略重复点击
  if (spinning) return;

  // 初始化旋转速度（随机范围内）
  speed = 15 + Math.random() * 10;
  spinning = true;

  // 启动动画
  requestAnimationFrame(spin);
}

/**
 * 动画循环：旋转小球并逐步减速
 */
function spin() {
  if (!spinning) return;

  // 更新角度
  angle += speed;
  // 应用减速
  speed -= deceleration;

  // 如果速度衰减到 0 或以下，则停止旋转
  if (speed <= 0) {
    speed = 0;
    spinning = false;
    // 将角度归一化到 [0, 360)
    angle = angle % 360;
    // 检查结果
    checkResult();
  }

  // 应用旋转变换
  ballContainer.style.transform = `rotate(${angle}deg)`;

  // 循环调用动画
  requestAnimationFrame(spin);
}

/**
 * 根据最终角度计算结果并更新总金额
 */
function checkResult() {
  // 假设转盘分为 36 格（每格 10 度）
  const finalPocket = Math.floor(angle / 10);

  // 获取用户输入的数字和赌注
  const guess = parseInt(document.getElementById("guessNumber").value, 10);
  const bet = parseFloat(document.getElementById("betAmount").value);

  if (finalPocket === guess) {
    alert("YOU WIN");
    // 赢时总金额增加赌注的 36 倍
    totalMoney += bet * 36;
  } else {
    // 输时扣除赌注金额
    totalMoney -= bet;
  }

  // 更新页面上显示的总金额
  document.getElementById("totalMoney").innerText = "Total Money: " + totalMoney;
}
