const video = document.getElementById("video");
const cursor = document.getElementById("cursor");
const buttons = document.querySelectorAll("button");

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let canClick = true;
let sensitivity =1.5; //aumenta o movimento
let smoothFactor = 0.07; //menos tremedeira
let centerX = 0.5;
let centerY = 0.5;
let calibrated = false;
let lastNosePosition = null;



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
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(results => {
  if (!results.multiFaceLandmarks.length) return;

  const landmarks = results.multiFaceLandmarks[0];

  const nose = landmarks[1];
  lastNosePosition = nose;
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  


  //centraliza no meio da tela
 let offsetX = nose.x - centerX;
 let offsetY = nose.y - centerY;


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

function calibrate() {
  if (lastNosePosition) {
    centerX = lastNosePosition.x;
    centerY = lastNosePosition.y;
    calibrated = true;
    alert("Calibrado!");
  }
}

document.getElementById("calibrateBtn").addEventListener("click", () => {
  if (lastNosePosition) {
    centerX = lastNosePosition.x;
    centerY = lastNosePosition.y;

    document.getElementById("statusText").innerText = "Calibrado ✓";
  }
});