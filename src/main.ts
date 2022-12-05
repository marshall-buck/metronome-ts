import "./style.css";
const VOLUME_SLIDER_RAMP_TIME = 0.2;

let audioContext: AudioContext = new AudioContext();
let masterGainNode: GainNode = new GainNode(audioContext);
let isPlaying = false;
let volume = 0.5;
let timerID: number;

let tempo = 60;
const lookahead = 100; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0; // The note we are currently playing
let nextNoteTime = 0.0; // when the next note is due.

masterGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
masterGainNode.connect(audioContext.destination);

interface NotesInQueue {
  note: number;
  time: number;
}
/* UI *******************************************************/

const tempoLabel = document.querySelector(
  "label[for=tempo] span"
) as HTMLElement;

const masterVolumeLabel = document.querySelector(
  "label[for=master-volume] span"
) as HTMLElement;

const pads = document.querySelectorAll(".beat");

// Start ****
const startButton = document.querySelector("#start") as HTMLInputElement;

/** Toggle button to show Stop or Start */
function toggleStart() {
  if (!isPlaying) startButton.innerText = "Start";
  else startButton.innerText = "Stop";
}

/** Handles starting/Stopping metronome */
function handleStart(e: Event) {
  console.log(audioContext);
  isPlaying = !isPlaying;
  toggleStart();

  if (isPlaying) {
    // Start playing

    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    currentNote = 0;
    nextNoteTime = audioContext.currentTime;
    scheduler(); // kick off scheduling
    requestAnimationFrame(draw); // start the drawing loop.
  } else {
    window.clearTimeout(timerID);
  }
}

startButton?.addEventListener("click", handleStart);

// Tempo ****
const tempoSlider: HTMLInputElement = document.querySelector(
  "input[name=tempo]"
) as HTMLInputElement;

/** Handler to change Tempo */
function changeTempo(e: Event) {
  const target = e.target as HTMLInputElement;
  tempo = +target.value;
  tempoLabel.innerText = target.value;
}

tempoSlider?.addEventListener("input", changeTempo);

// VOLUME ****
const masterVolume: HTMLInputElement | null = document.querySelector(
  "input[name=master-volume]"
);
function volumeSliderHandler(e: Event) {
  const target = e.target as HTMLInputElement;

  volume = +target.value;

  masterVolumeLabel.innerText = target.value;

  masterGainNode.gain.exponentialRampToValueAtTime(
    volume,
    audioContext.currentTime + VOLUME_SLIDER_RAMP_TIME
  );
}

masterVolume?.addEventListener("input", volumeSliderHandler);

// ******* AUDIO

// Scheduling

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat; // Add beat length to last beat time

  // Advance the beat number, wrap to zero when reaching 4
  currentNote = (currentNote + 1) % 4;
}
const notesInQueue: NotesInQueue[] = [];
function scheduleNote(beatNumber: number, time: number) {
  // console.log("Schedule note called", beatNumber, time);

  // Push the note into the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time: time });

  playTone(time);
}

function playTone(time: number) {
  // console.log("play tone", tempo);

  const osc = new OscillatorNode(audioContext, {
    frequency: 380,
    type: "triangle",
  });
  //  Separate gain node for each note
  // const oscGain = new GainNode(audioContext);
  // oscGain.gain.cancelScheduledValues(time);
  // oscGain.gain.setValueAtTime(0, time);
  // oscGain.gain.linearRampToValueAtTime(1, time);
  // oscGain.gain.linearRampToValueAtTime(0, time);

  osc.connect(masterGainNode);
  osc.start(time);
  osc.stop(time + 0.05);
}


function scheduler() {
  // While there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
  timerID = setTimeout(scheduler, lookahead);
}

// Draw function to update the UI, so we can see when the beat progress.
// This is a loop: it reschedule itself to redraw at the end.
let lastNoteDrawn = 3;
function draw() {
  let drawNote = lastNoteDrawn;
  const currentTime = audioContext.currentTime;

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    drawNote = notesInQueue[0].note;
    notesInQueue.shift(); // Remove note from queue
  }

  // We only need to draw if the note has moved.
  if (lastNoteDrawn !== drawNote) {
    pads.forEach((pad, idx) => {
      if (idx === drawNote) pad.classList.toggle("active");
      else pad.setAttribute("class", "beat");
    });

    lastNoteDrawn = drawNote;
  }
  // Set up to draw again
  requestAnimationFrame(draw);
}
