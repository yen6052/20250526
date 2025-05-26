let video;
let facemesh;
let predictions = [];
let handpose;
let handPredictions = [];
let gesture = "";

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });

  // 加入 handpose 手勢辨識
  handpose = ml5.handpose(video, handReady);
  handpose.on('predict', results => {
    handPredictions = results;
    gesture = detectGesture(handPredictions);
  });
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function handReady() {
  // 手部模型載入完成
}

// 手勢判斷：剪刀、石頭、布
function detectGesture(hands) {
  if (hands.length === 0) return "";
  const annotations = hands[0].annotations;
  const tips = [
    annotations.thumb[3],
    annotations.indexFinger[3],
    annotations.middleFinger[3],
    annotations.ringFinger[3],
    annotations.pinky[3]
  ];
  const wrist = hands[0].annotations.palmBase[0];
  let extended = tips.map(tip => dist(tip[0], tip[1], wrist[0], wrist[1]) > 80);
  if (extended[1] && extended[2] && !extended[3] && !extended[4]) return "剪刀";
  if (extended.every(e => e)) return "布";
  if (extended.every(e => !e)) return "石頭";
  return "";
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 根據手勢決定圓圈位置
    let idx = 168; // 預設下巴
    if (gesture === "剪刀") {
      idx = 159; // 左眼上緣
    } else if (gesture === "石頭") {
      idx = 10; // 額頭中心
    } else if (gesture === "布") {
      idx = 454; // 右臉頰
    }
    // 直接取得點座標（不需縮放）
    let [x, y] = keypoints[idx];

    noFill();
    stroke(255, 0, 0);
    strokeWeight(4);
    ellipse(x, y, 100, 100);

    // 顯示手勢
    noStroke();
    fill(0, 200, 0);
    textSize(32);
    text(gesture, 20, 40);
  }
}
