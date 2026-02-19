const video = document.getElementById("video");
const cursor = document.getElementById("cursor");
const buttons = document.querySelectorAll("button");

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let canClick = true;
let sensitivity =1.5; //aumenta o movimento
let smoothFactor = 0.07; //menos tremedeira

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
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
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

  //centraliza no meio da tela
  let offsetX = 0.5 - nose.x;
  let offsetY = 0.5 - nose.y;

  //zona morta (ignora micro movimentos)
  let deadZone = 0.02;

  if (Math.abs(offsetX) < deadZone) offsetX = 0;
  if (Math.abs(offsetY) < deadZone) offsetY = 0;

  let targetX = cursorX + offsetX * window.innerWidth * sensitivity;
  let targetY = cursorY + offsetY * window.innerHeight * sensitivity; 
  
  //suavização
  cursorX += (targetX - cursorX) * smoothFactor;
  cursorY += (targetY - cursorY) * smoothFactor;

  //limites da tela
  cursorX = Math.max(0, Math.min(window.innerWidth, cursorX));
  cursorY = Math.max(0, Math.min(window.innerHeight, cursorY));

  cursor.style.left = `${cursorX - 15}px`;
  cursor.style.top = `${cursorY - 15}px`;

  // Piscada
  const eyeDistance = Math.abs(leftEyeTop.y - leftEyeBottom.y);

  if (eyeDistance < 0.015 && canClick){
    canClick = false;
    checkClick();

    setTimeout(() => {
        canClick =true;
    }, 5000); // 5 segundo de espera
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