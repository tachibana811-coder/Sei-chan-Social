// BGM
const bgm = new Audio("assets/bgm/bgm.mp3");
bgm.loop = true;      // ループ再生
bgm.volume = 0.4;     // 音量（0.0〜1.0）
bgm.play();

let turn = 1;
let followers = 0;
let postData = {};

const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const turnDisplay = document.getElementById("turn-display");
const followerDisplay = document.getElementById("follower-display");
const seichanText = document.getElementById("seichan-text");
const timeline = document.getElementById("timeline");

const resultRank = document.getElementById("result-rank");
const resultFollowers = document.getElementById("result-followers");
const restartBtn = document.getElementById("restart-btn");
const resultImage = document.getElementById("result-image");

const emotionButtons = document.querySelectorAll(".emotion-btn");

const seichanTexts = [
  "今日の投稿どうしようかな〜",
  "うーん、今日はどんな気分でいこうかな",
  "ちょっと伸びてきた気がする…！",
  "このままいけるかも〜！",
  "そろそろ勝負したい気分…",
  "いい感じに盛り上がってきたよ〜！",
  "あと少しでゴールだよ〜",
  "ここからどう伸ばすかが勝負だね！",
  "ラスト前！気合い入れるよ〜！",
  "ラスト！バズらせるよ〜！！"
];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    postData = data.posts;
  });

function updateHeader() {
  turnDisplay.textContent = `ターン ${turn} / 10`;
  followerDisplay.textContent = `フォロワー：${followers.toLocaleString()}`;
  seichanText.textContent = seichanTexts[Math.min(turn - 1, seichanTexts.length - 1)];
}

function addPost(post) {
  const box = document.createElement("div");
  box.className = "post-box";

  const randomComment =
    post.comments[Math.floor(Math.random() * post.comments.length)];

  const changeText =
    post.followers >= 0
      ? `＋${post.followers.toLocaleString()}`
      : `${post.followers.toLocaleString()}`;

  box.innerHTML = `
    <div class="post-header">
      <img src="assets/gallery/seichan_icon.png" class="icon">
      <div class="name">銀河打者</div>
      <div class="time">1分前</div>
    </div>

    <img class="post-image" src="${post.file}">
    <div class="post-text">${post.text}</div>
    <div class="comments">${randomComment}</div>
    <div class="follow-change">${changeText}</div>
  `;

  timeline.prepend(box);
}

emotionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const list = postData[type];
    const selected = list[Math.floor(Math.random() * list.length)];

    followers += selected.followers;
    addPost(selected);

    // 吹き出しの色を変える
    seichanText.classList.remove("pink", "blue", "orange");
    seichanText.classList.add(type);

    turn++;
    updateHeader();

    if (turn > 10) {
      showResult();
    }
  });
});

function showResult() {
  gameScreen.classList.remove("active");
  resultScreen.classList.add("active");

// ★ 結果画面に入ったらBGM停止
  bgm.pause();

  let rank = "";
  let img = "";
  let color = "";

  if (followers >= 1000000) {
    rank = "すごい人気者！";
    img = "assets/gallery/result_good.png";
    color = "#ffb3d4";
  } else if (followers >= 500000) {
    rank = "いい感じに人気！";
    img = "assets/gallery/result_normal.png";
    color = "#b3dbff";
  } else if (followers >= 200000) {
    rank = "まあまあ普通";
    img = "assets/gallery/result_normal2.png";
    color = "#ffd1a1";
  } else {
    rank = "人気が出なかった…";
    img = "assets/gallery/result_bad.png";
    color = "#bbbbbb";
  }

  resultRank.textContent = rank;
  resultRank.style.color = color;

  resultFollowers.textContent = `最終フォロワー：${followers.toLocaleString()}`;

  // ★ 結果画像をセット
  resultImage.src = img;
}

restartBtn.addEventListener("click", () => {
  turn = 1;
  followers = 0;
  timeline.innerHTML = "";
  gameScreen.classList.add("active");
  resultScreen.classList.remove("active");
  updateHeader();

   bgm.play();
});

updateHeader();
