function draw() {
  background(0);
  video.loadPixels();

  if (faces.length > 0) {
    let face = faces[0];

    // 畫三角網格
    randomSeed(5);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangles.length; i++) {
      let tri = triangles[i];
      let [a, b, c] = tri;
      let pointA = face.keypoints[a];
      let pointB = face.keypoints[b];
      let pointC = face.keypoints[c];

      let cx = (pointA.x + pointB.x + pointC.x) / 3;
      let cy = (pointA.y + pointB.y + pointC.y) / 3;

      let index = (floor(cx) + floor(cy) * video.width) * 4;
      let rr = video.pixels[index];
      let gg = video.pixels[index + 1];
      let bb = video.pixels[index + 2];

      stroke(255, 255, 0);
      fill(rr, gg, bb);
      vertex(pointA.x, pointA.y);
      vertex(pointB.x, pointB.y);
      vertex(pointC.x, pointC.y);
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
    let pt = face.keypoints[idx];

    // 畫小圓圈
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    ellipse(pt.x, pt.y, 10, 10);

    // 顯示手勢文字
    noStroke();
    fill(0, 200, 0);
    textSize(32);
    text(gesture, 20, 40);
  }
}
