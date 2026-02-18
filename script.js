const video = document.getElementById("video");
const cursor = document.getElementById("cursor");
const buttons = document.querySelectorAll("button");

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  speechSynthesis.speak(utterance);
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    speak(button.dataset.text);
  });
});

const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}./`,
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(results => {
  if (!results.multiFaceLandmarks.length) return;

  const landmarks = results.multiFaceLandmarks[0];

  const nose = landmarks[1];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];

  // Movimento cabeça
  cursorX = window.innerWidth * nose.x;
  cursorY = window.innerHeight * nose.y;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;

  // Piscada
  const eyeDistance = Math.abs(leftEyeTop.y - leftEyeBottom.y);

  if (eyeDistance < 0.01) {
    checkClick();
  }
});

function checkClick() {
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    if (
      cursorX > rect.left &&
      cursorX < rect.right &&
      cursorY > rect.top &&
      cursorY < rect.bottom
    ) {
      button.click();
    }
  });
}

const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();