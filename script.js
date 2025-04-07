// 绑定按钮事件
document.getElementById("startBtn").addEventListener("click", startGame);

// 变量定义
let angle = 0;             // 当前角度
let speed = 0;             // 当前速度（度/帧）
let deceleration = 0.05;   // 减速度（度/帧²），可自行调整
let spinning = false;      // 是否正在旋转
let totalMoney = 1000;     // 初始金额

// 获取小球容器（用来旋转）
const ballContainer = document.getElementById("ballContainer");

/**
 * 开始游戏
 */
function startGame() {
  // 读取用户输入
  const guess = parseInt(document.getElementById("guessNumber").value, 10);
  
  // 判断输入合法性
  if (isNaN(guess) || guess < 0 || guess > 35) {
    alert("请输入 0~35 之间的数字");
    return;
  }

  // 若当前还在旋转，则不再重复启动
  if (spinning) return;

  // 初始化速度，随机一个范围
  speed = 20 + Math.random() * 10;
  spinning = true;

  // 启动动画
  requestAnimationFrame(spin);
}

/**
 * 动画循环：旋转小球，直到速度衰减至0
 */
function spin() {
  if (!spinning) return;

  // 角度累加
  angle += speed;
  // 减速
  speed -= deceleration;

  // 若速度衰减到0或以下，停止旋转
  if (speed <= 0) {
    speed = 0;
    spinning = false;
    // 归一化角度到 [0, 360)
    angle = angle % 360;
    // 判断结果
    checkResult();
  }

  // 旋转容器
  ballContainer.style.transform = `rotate(${angle}deg)`;

  // 循环调用
  requestAnimationFrame(spin);
}

/**
 * 根据最终角度计算结果，并更新显示
 */
function checkResult() {
  // 一圈360度，假设共36格(0~35)，每格10度
  const finalPocket = Math.floor(angle / 10);

  // 获取用户猜测
  const guess = parseInt(document.getElementById("guessNumber").value, 10);

  if (finalPocket === guess) {
    alert("YOU WIN");
    // 奖励
    totalMoney += 100;
  } else {
    // 失败惩罚
    totalMoney -= 10;
  }

  // 更新总金额
  document.getElementById("totalMoney").innerText = "Total Money: " + totalMoney;
}
