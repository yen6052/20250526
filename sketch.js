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
  background(0);
  video.loadPixels();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 畫三角網格
    randomSeed(5);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangles.length; i++) {
      let tri = triangles[i];
      let [a, b, c] = tri;
      let pointA = keypoints[a];
      let pointB = keypoints[b];
      let pointC = keypoints[c];

      let cx = (pointA[0] + pointB[0] + pointC[0]) / 3;
      let cy = (pointA[1] + pointB[1] + pointC[1]) / 3;

      let index = (floor(cx) + floor(cy) * video.width) * 4;
      let rr = video.pixels[index];
      let gg = video.pixels[index + 1];
      let bb = video.pixels[index + 2];

      stroke(255, 255, 0);
      fill(rr, gg, bb);
      vertex(pointA[0], pointA[1]);
      vertex(pointB[0], pointB[1]);
      vertex(pointC[0], pointC[1]);
    }
    endShape();

    // 根據手勢決定圓圈位置
    let idx = 33; // 預設左眼
    if (gesture === "剪刀") {
      idx = 33; // 左眼
    } else if (gesture === "石頭") {
      idx = 263; // 右眼
    } else if (gesture === "布") {
      idx = 152; // 下巴
    }
    let pt = keypoints[idx];

    // 畫小圓圈
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    ellipse(pt[0], pt[1], 30, 30);

    // 顯示手勢文字
    noStroke();
    fill(0, 200, 0);
    textSize(32);
    text(gesture, 20, 40);
  }
}
