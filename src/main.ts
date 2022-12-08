import "./style.css";

import { Note, Metronome } from "./Note";

interface NotesInQueue {
  note: number;
  time: number;
}
const VOLUME_SLIDER_RAMP_TIME = 0.2;

let audioContext: Metronome = new Metronome();
// let audioContext: AudioContext = new AudioContext();
let masterGainNode: GainNode = new GainNode(audioContext);
let isPlaying = false;
let volume = 0.5;
let timerID: NodeJS.Timeout;
const notesInQueue: NotesInQueue[] = [];
// let beatsPerMeasure = 4;
let tempo = 60;
let currentBeat = 0; // The note we are currently playing
let nextNoteTime = 0.0; // when the next note is due.
let lastNoteDrawn = 3;
let timeSig = { beats: 4, noteValue: 4 };
const beatModifiers = { n: 1, "8": 2, "16": 4, d8: 3 };
// let met = new Metronome();
let anF: number;

const lookahead = 100; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

masterGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
masterGainNode.connect(audioContext.destination);

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
  isPlaying = !isPlaying;
  toggleStart();
  // console.log("isPlaying from handleStart", isPlaying);

  if (isPlaying) {
    // Start playing

    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    nextNoteTime = audioContext.currentTime;
    scheduler(); // kick off scheduling
    anF = requestAnimationFrame(draw); // start the drawing loop.
  } else {
    clearInterval(timerID);
    cancelAnimationFrame(anF);
    // console.log("timeout cleared", timerID);
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

function playTone(time: number) {
  // console.log("play tone", time);
  const note = new Note(audioContext, masterGainNode);
  note.play(time);
}

// Scheduling

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat; // Add beat length to last beat time

  // Advance the beat number, wrap to 1 when reaching 4
  currentBeat = (currentBeat + 1) % timeSig.beats;
}

function scheduleNote(beatNumber: number, time: number) {
  // Push the note into the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time: time });
  playTone(time);
}

function scheduler() {
  if (timerID) clearInterval(timerID);
  // console.log(timerID, "cleared");
  // While there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentBeat, nextNoteTime);
    nextNote();
  }

  timerID = setInterval(scheduler, lookahead);
  // console.log("Scheduler Called settimeout set", timerID);
}

// Draw function to update the UI, so we can see when the beat progress.
// This is a loop: it reschedules itself to redraw at the end.

function draw() {
  let drawNote = lastNoteDrawn;
  const currentTime = audioContext.currentTime;

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    // console.log("drawNote, lastNoteDrawn", drawNote, lastNoteDrawn);

    drawNote = notesInQueue[0].note;
    notesInQueue.shift(); // Remove note from queue
    // console.log("drawNote AFT, lastNoteDrawn", drawNote, lastNoteDrawn);
  }
  // console.log("draw note", currentBeat, drawNote);
  // We only need to draw if the note has moved.

  if (lastNoteDrawn !== drawNote) {
    pads.forEach((pad, idx) => {
      //  To highlight beat every n beats drawNote/ n
      if (idx === drawNote) {
        pad.classList.toggle("active");
      } else pad.setAttribute("class", "beat");
    });

    lastNoteDrawn = drawNote;
  }
  // Set up to draw again
  anF = requestAnimationFrame(draw);
}
