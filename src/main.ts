import "./style.css";
let audioContext: AudioContext;
let masterGainNode: GainNode;
let osc: OscillatorNode;
let isPlaying = false;
let volume = 0.5;
/* UI *******************************************************/

// Start ****
const startButton = document.querySelector("#start");

// function toggleStartButton() {
//   if(isPlaying)  startButton.textContent = "stop"
// }

/** Handles starting/Stopping metronome */
function handleStart(e: Event) {
  console.log("start clicked", e);

  playTone();
}

startButton?.addEventListener("click", handleStart);

// Tempo ****
const tempoSlider: HTMLInputElement | null =
  document.querySelector("input[name=tempo]");

/** Handler to change Tempo */
function changeTempo(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  console.log(val);
}

tempoSlider?.addEventListener("input", changeTempo);

// Volume ****
const masterVolume: HTMLInputElement | null = document.querySelector(
  "input[name=master-volume]"
);
function volumeSliderHandler(e: Event) {
  const val = +(e.target as HTMLInputElement).value;
  console.log(val);
  volume = val;
  masterGainNode.gain.exponentialRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.3
  );
}

masterVolume?.addEventListener("input", volumeSliderHandler);

// ******* AUDIO

function playTone() {
  osc = audioContext.createOscillator();
  osc.connect(masterGainNode);
  osc.type = "sine";
  osc.frequency.value = 440;
  masterGainNode.gain.linearRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.3
  );
  osc.start();
  // osc.stop(.2)

  // return osc;
}

function init() {
  audioContext = new AudioContext();
  masterGainNode = audioContext.createGain();
  masterGainNode.gain.setValueAtTime(0, audioContext.currentTime);
  masterGainNode.connect(audioContext.destination);
}

init();
