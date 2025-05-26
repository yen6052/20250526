let video;
let facemesh;
let predictions = [];

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
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 假設 gesture 變數已正確設定
    let x, y;
    if (gesture === "剪刀") {
      // 左眼（第33點）
      [x, y] = keypoints[33];
    } else {
      // 預設第94點
      [x, y] = keypoints[94];
    }

    noFill();
    stroke(255, 0, 0);
    strokeWeight(4);
    ellipse(x, y, 100, 100);
  }
}
