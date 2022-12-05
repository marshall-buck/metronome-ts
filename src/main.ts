import "./style.css";
let audioContext: AudioContext;
let masterGainNode: GainNode;
let osc: OscillatorNode;
let isPlaying = false;
let volume = 0.5;
/* UI *******************************************************/

// Start ****
const startButton = document.querySelector("#start") as HTMLInputElement;

function toggleStartButton() {
  if (!isPlaying) {
    startButton.textContent = "Stop";
  } else {
    startButton.textContent = "Start";
  }
  isPlaying = !isPlaying;
}

/** Handles starting/Stopping metronome */
function handleStart(e: Event) {
  console.log(audioContext);

  const txt = (e.target as HTMLInputElement).innerText;
  if (txt === "Start") {
    playTone();
    console.log("handleStart", masterGainNode);
  } else {
    masterGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime);
    osc.stop(0.1);
  }
  toggleStartButton();
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
  console.log(volume);

  masterGainNode.gain.exponentialRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.5
  );
}

masterVolume?.addEventListener("input", volumeSliderHandler);

// ******* AUDIO

function playTone() {
  osc = new OscillatorNode(audioContext);
  osc.connect(masterGainNode);
  osc.type = "sine";
  osc.frequency.value = 440;

  masterGainNode.gain.linearRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.3
  );
  osc.start(audioContext.currentTime + 0.1);
  // osc.stop(.2)
}

function init() {
  audioContext = new AudioContext();
  masterGainNode = new GainNode(audioContext);
  masterGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  masterGainNode.connect(audioContext.destination);
}

init();
